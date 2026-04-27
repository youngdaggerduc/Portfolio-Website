# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Backend** (from `backend/`, venv at `backend/venv/`):
```bash
source venv/Scripts/activate                # Git Bash on Windows
uvicorn app.main:app --reload --port 8001   # dev server (Hyper-V often reserves :8000 on Windows)
pip install -r requirements.txt
```

**Frontend** (from `frontend/`):
```bash
npm run dev        # dev server on :5173
npm run build      # production build -> dist/
npm run lint       # eslint (react-hooks rules are strict — see Gotchas below)
```

**Migrations (Aerich)** — not yet initialized. Schema currently auto-generates via `generate_schemas=True` in `app/main.py`. First-time setup:
```bash
cd backend
aerich init -t app.config.TORTOISE_ORM
aerich init-db
# subsequent model changes:
aerich migrate && aerich upgrade
```
When switching to Aerich, remove `generate_schemas=True` in `app/main.py` to avoid drift.

No test suite exists.

## Architecture

Two independent apps, connected only over HTTP.

- **`backend/`** — FastAPI + Tortoise ORM. `app/main.py` wires CORS (allow-list is hardcoded to `http://localhost:5173` — changing the frontend port requires a code edit), mounts routers from `app/routers/`, and calls `register_tortoise(...)` to bind Tortoise to the app lifecycle. DB config lives in `app/config.py`, which reads `DATABASE_URL` from `backend/.env` (default: `sqlite://db.sqlite3`). New model modules must be added to the `TORTOISE_ORM["apps"]["models"]["models"]` list in `config.py` alongside `aerich.models`.

- **`frontend/`** — Vite + React SPA. `vite.config.js` proxies `/api/*` → `http://localhost:8001`, so frontend code calls `fetch('/api/...')` with no host. For prod, serve the API under `/api` or set up an equivalent reverse proxy. Entry: `src/main.jsx` → `src/App.jsx`.

**Frontend routing.** No router library. `App.jsx` defines an inline `useHashRoute` hook and a small switch: `#/chatbot` renders `ChatbotPage`, `#/games` renders `GamesPage`, anything else renders `Portfolio`. Both overlay pages are fullscreen `position: fixed` overlays scoped under `.chatbot-shell` / `.games-shell`, each with its own scoped CSS file. Internal links use `href="#/chatbot"` / `href="#/games"`; in-page back/exit buttons use `href="#/"`. To add another route, extend the switch in `App()` — don't reach for react-router.

**Adding a backend endpoint**: new module under `app/routers/`, define an `APIRouter`, register in `app/main.py` via `app.include_router(...)`. The `/api` prefix is set per-router (see `homepage.py`), not globally.

**Switching DB**: change `DATABASE_URL` in `backend/.env` (e.g., `postgres://...`) and add the driver (`asyncpg`) to `requirements.txt`. Tortoise picks the dialect from the URL.

**Static / public assets.** Files placed in `frontend/public/` are served at the root path with no hashing — reference them as `/filename.ext` in JSX (e.g., `href="/Pierce Doman Resume.pdf"`, `image: '/odoo.png'`). Do NOT import them via `src/` or Vite will bundle and fingerprint them, breaking bare-path references. The CV download link and all project/cert images follow this pattern.

## Contact form

`POST /api/contact` (`app/routers/contact.py`) sends email via Python stdlib `smtplib` — no extra pip dependency. Requires `SMTP_USER` and `SMTP_PASSWORD` in `backend/.env` (use a Gmail App Password, not the account password). The `Reply-To` header is set to the visitor's address so hitting Reply in Gmail goes back to them. Key conventions:

- **Honeypot field `website`** is a hidden off-screen input in the form. If non-empty, the endpoint returns `{"ok": true}` silently without sending mail — never signal to bots that the honeypot triggered.
- **Rate limiting** follows the same in-memory deque pattern as the chatbot (3/hour, 10/day per IP, env-tunable). State is lost on restart — same single-process caveat applies.
- **`SMTP_USER` / `SMTP_PASSWORD` absence** returns a clear 500 at call time so the app still boots without mail configured.

## Chatbot stack

`/api/chat` is the most complex backend surface. Several pieces interact and the conventions are not obvious from the code alone:

- **Spider-PD's knowledge lives in `backend/data/resume.txt`**, split by lines containing only `---` and titled with `[TITLE: ...]` on the first line of each block. Edit chunks freely — `app/rag.py` re-embeds automatically when the SHA-256 of (model + concatenated chunks) changes. Cache lives at `backend/data/.index.json`; delete it to force a rebuild. Embedding model defaults to `text-embedding-3-small` and is included in the hash so swapping models also invalidates the cache.

- **Persona and RAG context are separate system messages, in that order.** `app/system_prompt.txt` is the persona (read fresh on every request — edits are live with no restart). Retrieved chunks are formatted by `format_context()` and pushed as a *second* system message. Keep them split so persona stays tunable independent of retrieval.

- **Memory is two-layered.** Conversations persist in full to `backend/memory/{session_id}.json` (one JSON file per session, gitignore-worthy). Only the last `CHAT_MAX_HISTORY` messages (default 10) are sent to OpenAI per turn — this is the dominant cost lever, since a long conversation never grows the per-call payload. Session IDs are validated against `^[A-Za-z0-9_-]{1,64}$` to keep filenames safe.

- **`POST /api/chat` returns SSE, not JSON.** Wire format: `event: session` first (`{session_id}` for the client to persist in `localStorage`), then `event: token` repeated with `{text}`, finally `event: done` or `event: error`. The frontend reader in `ChatbotPage.jsx` parses events manually because `EventSource` doesn't support POST. Each `data:` line is JSON-encoded (rather than raw text) so newlines inside tokens can't break SSE framing.

- **Frontend `setMessages` updaters must be pure.** React StrictMode double-invokes state updaters in dev. Earlier bug: an outer `let assistantStarted` flag mutated inside the updater desynced on the second pass and appended assistant tokens into the user bubble. Always derive branch decisions from `prev` inside the updater, never from a closure variable.

- **Rate limiting is in-memory and per-IP** (`_rate_buckets` in `routers/chatbot.py`). State is lost on every uvicorn restart and it does not work across multiple workers or behind a load balancer. Fine for single-process portfolio scale; swap for Redis if either changes. Defaults: 15/min, 100/day.

- **`get_client()` lazy-initializes `AsyncOpenAI`** so the app boots without `OPENAI_API_KEY` set — only chat calls fail (with a clear 500). Useful when working on non-chatbot endpoints without keys configured.

- **Required env: `OPENAI_API_KEY`.** All other chat/RAG/rate-limit knobs have defaults — see `backend/.env.example`.

## AI Games

`#/games` renders `GamesPage` — a picker with two AI-driven mini-games. Backend endpoints live in `app/routers/games.py` under `/api/games/*` and use `get_client()` from `chatbot.py` for OpenAI access (so a missing `OPENAI_API_KEY` only fails the games endpoints, not boot).

- **Game 1: Spot the Bug.** `POST /api/games/spot-bug/puzzle` returns `{language, code, choices, correct, bugLine, explanation}` using OpenAI's JSON-mode (`response_format={"type":"json_object"}`). The router randomizes language, bug flavour, and which letter (A–D) is the correct option *before* prompting, so the model can't bias toward one answer. `POST /api/games/spot-bug/reaction` takes `{outcome: "win"|"lose"|"timeout"}` and returns persona text (Aunt May for win, J. Jonah Jameson otherwise). Frontend has a `FALLBACK_PUZZLE` so the game still works if OpenAI is down.
- **Game 2: Hire Spider-Man.** `POST /api/games/hire/reply` takes the full message list (each `{role: "spider"|"user", text}`), the round number, and `max_rounds`; returns `{text}`. After round 3, the frontend calls `POST /api/games/hire/verdict` which returns `{outcome: "spider"|"recruiter", summary}` in JSON-mode. The system prompts pull from a hardcoded `SKILLS_CONTEXT` constant in `games.py` (kept separate from the chatbot RAG corpus — these are short pitches, not Q&A).
- **Rate limiting** is its own in-memory deque keyed by IP, separate from the chatbot's bucket. Defaults: 10/min, 60/day. Tunable via `GAMES_RATE_LIMIT_PER_MINUTE` / `GAMES_RATE_LIMIT_PER_DAY`. Same single-process caveat as the chatbot.
- **Set-state-in-effect rule.** `react-hooks/set-state-in-effect` is strict — `SpotTheBug`'s mount effect can't call `loadPuzzle()` directly because that synchronously calls `setPhase('loading')`. The pattern is: split into `fetchPuzzle` (pure async, returns data) and `loadPuzzle` (handler that resets state + calls fetch). The mount effect calls `fetchPuzzle` and only `setState`s after `await`, with a `cancelled` ref to handle StrictMode double-mount.

## Frontend animation system

The portfolio is heavily animated (Spider-Man / comic-book theme). Several load-bearing conventions are not obvious from the code:

- **Global reveal observer** (`src/hooks/useRevealObserver.js`) runs once on App mount, calls `document.querySelectorAll('.reveal')`, and attaches an IntersectionObserver. Any element rendered *after* mount with a `.reveal` class will **not** animate unless the observer is re-run. If you add lazily-rendered reveal targets, either re-query inside that component's effect or add a `MutationObserver`.

- **`.reveal` base state is `opacity: 0`** (in `App.css`). Do not flip it to `1` to "debug" missing animations — that breaks the fade. If reveals aren't firing, the root cause is usually (a) element rendered after observer mount, or (b) a `clip-path` ancestor clipping it out.

- **`clip-path` on sections clips fixed descendants.** `useSectionClipReveal` applies `clip-path: circle(...)` to every `main > section` for the "uncovered by webs" effect. This clips **all** descendants, including `position: fixed` ones. Anything meant to float above a section (e.g. `SwingingSpood`) must render via `createPortal(node, document.body)` to escape the clip context.

- **z-index layering** (conflicts are the easiest way to break things):
  - `0` — `WebBackground` (parallax web layers, pointer-events: none)
  - `1` — `nav`, `main`, `footer` (explicit, to sit above the web background)
  - `9000` — `SwingingSpood` `.swing-zone` (portal'd to body)
  - `99990` — `Preloader`
  - `99997–99999` — `WebCursor` shot / trail / dot

- **Custom cursor activation.** `WebCursor` adds `has-web-cursor` to `<html>` and CSS hides the native cursor globally (`html.has-web-cursor * { cursor: none !important }`). Activation is gated on `(pointer: fine)` AND `!(prefers-reduced-motion: reduce)`, and is disabled under 900px via media query. If cursor appears broken, check that class and those media queries first.

- **`prefers-reduced-motion` is checked independently in every motion component** via `window.matchMedia(...).matches` with a **lazy `useState` initializer**. Do not call `setReduced(...)` synchronously inside `useEffect` — the ESLint rule `react-hooks/set-state-in-effect` will fail the build. Pattern:
  ```jsx
  const [reduced] = useState(() =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  ```

- **Each scroll-driven component runs its own rAF loop** (`SwingingSpood`, `WebBackground`, `WebCursor`, `Nav`). These are not consolidated. If adding another scroll-tied animation, either hook into an existing loop or accept another listener — just make sure each uses `requestAnimationFrame` for coalescing, not raw `scroll` handlers.

- **`content-visibility: auto` is set on all `main > section` except `.hero`** with `contain-intrinsic-size: 1px 900px`. This skips paint/layout for offscreen sections. If a section has dynamic height that differs wildly from 900px, adjust that intrinsic size or you'll get scroll-jank.

## Mobile / responsive

- **Three breakpoint layers, all at the bottom of `App.css`**, applied in cascade order:
  - `@media (max-width: 900px)` — collapses multi-column grids to single column, hides `.swing-zone` / web cursor, switches `Nav` from inline links to a hamburger drawer.
  - `@media (max-width: 600px)` — phone-sized typography (hero name, section titles), tighter padding.
  - `@media (max-width: 420px)` — smallest-phone tightening; hero stats go to 1-col.

  Add new mobile overrides inside the matching block — don't add a fourth one unless the breakpoint is genuinely new.

- **Hero name `clamp()` is shadowed in three places** — `.hero-name`, `.hero-name .glitch-layer-1`, `.hero-name .glitch-layer-2`. The glitch layers must match the base size exactly or the RGB-split desyncs. The mobile breakpoints override all three together; do the same for any new hero typography change.

- **`Nav.jsx` mobile drawer locks body scroll** by writing `document.body.style.overflow = 'hidden'` while open. The cleanup restores `''` (not the previous value), so if another component also writes to `body.style.overflow`, they will trample each other. The chatbot uses `body.chatbot-active { overflow: hidden }` (a class, not inline style) specifically to avoid this.

## SEO / index.html

`index.html` carries the full meta layer: description, keywords, Open Graph, Twitter Card, JSON-LD `@graph` (Person + WebSite), preconnect to Google Fonts. Do **not** add `<link rel="canonical" href="/">` or `<link rel="preload" as="video" href="/piercespood.mp4">` — Vite's HTML plugin resolves bare `/` references to the project root directory and fails the build with `EISDIR`. Use absolute URLs once a domain is known.
