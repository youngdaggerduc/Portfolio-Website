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

**Adding a backend endpoint**: new module under `app/routers/`, define an `APIRouter`, register in `app/main.py` via `app.include_router(...)`. The `/api` prefix is set per-router (see `homepage.py`), not globally.

**Switching DB**: change `DATABASE_URL` in `backend/.env` (e.g., `postgres://...`) and add the driver (`asyncpg`) to `requirements.txt`. Tortoise picks the dialect from the URL.

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

## SEO / index.html

`index.html` carries the full meta layer: description, keywords, Open Graph, Twitter Card, JSON-LD `@graph` (Person + WebSite), preconnect to Google Fonts. Do **not** add `<link rel="canonical" href="/">` or `<link rel="preload" as="video" href="/piercespood.mp4">` — Vite's HTML plugin resolves bare `/` references to the project root directory and fails the build with `EISDIR`. Use absolute URLs once a domain is known.
