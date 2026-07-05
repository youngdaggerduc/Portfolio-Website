# Portfolio Website — Recommendations (Round 2)

Review date: 2026-07-05. Round 1 (main portfolio page) is fully implemented and removed from this doc. Round 2 covers what round 1 didn't: the **backend API**, the **chatbot page**, the **games page**, and deployment/infra — plus a second design pass.

Legend: 🔴 fix soon · 🟡 worth doing · 🟢 nice-to-have

---

## Carried over from Round 1 — waiting on you

- **Project links** — `Modal.jsx` renders "VIEW CODE" / "LIVE DEMO" only when a project has `github` / `live` fields in `frontend/src/data.js`. Add URLs when ready; buttons stay hidden until then.
- **Domain-dependent SEO** — once the production domain exists: make `og:image` absolute (TODO comment in `index.html`), add `og:url`, `<link rel="canonical">`, and a `sitemap.xml` referenced from `robots.txt`.
- **Your-call items** — public phone number in Contact; whether Education/Certificates belong in the nav.

---

## Part 1 — General Recommendations

### 1.1 Backend security & privacy

- 🔴 **Visitor chat conversations are publicly readable and deletable.** `backend/app/routers/chatbot.py:203-224` — `GET /api/chat/sessions` returns every visitor's session id, message count, and **last message content** to anyone who calls it, and `DELETE /api/chat/sessions/{id}` lets anyone wipe any session. Session ids are otherwise unguessable UUIDs, but this endpoint hands them all out — and with a session id, a third party can continue someone else's conversation via `POST /api/chat` (inheriting their history). These read like debug/admin endpoints that shipped. Remove them, or gate them behind an admin token env var.

- 🟡 **Rate limiting probably doesn't work on Render.** All three rate limiters key on `request.client.host`, but the `startCommand` in `render.yaml` doesn't pass `--proxy-headers`, so behind Render's proxy every request likely reports the proxy's IP — meaning **all visitors share one bucket**: a single person (or bot) can exhaust the site-wide daily chat/games/contact limits for everyone. Add `--proxy-headers --forwarded-allow-ips="*"` to the uvicorn start command so `client.host` resolves from `X-Forwarded-For`.

- 🟡 **SMTP errors leak internals to the client.** `contact.py:94-96` returns `detail=f"SMTP auth failed: {e}"` / `f"Mail send failed: {e}"` — raw smtplib error text (which can include your SMTP host/user context) goes straight to the browser. Log the exception server-side and return a generic "Could not send — email me directly" message.

- 🟢 **Rate-limit buckets never evict idle IPs.** `_rate_buckets` dicts in `chatbot.py`, `games.py`, and `contact.py` keep a key per IP forever (emptied deques, but the keys stay). Harmless at portfolio scale, but a periodic sweep (or capping dict size) makes it bulletproof against IP-rotation growth.

### 1.2 Backend correctness & hygiene

- 🟡 **Chat memory silently vanishes on Render free tier.** Sessions are JSON files in `backend/memory/` and the RAG index cache is on disk — Render free instances have **ephemeral filesystems**, so every deploy/restart/sleep-wake wipes them. The UX consequence: the frontend keeps its `session_id` in localStorage and sends it, but the server has forgotten the conversation. Either accept it (fine for a portfolio — but then also expire the localStorage session id) or store sessions in the SQLite DB you already configure… which is *also* ephemeral on Render, so realistically: accept + document, or use a free hosted store (e.g. Upstash Redis) if continuity ever matters.

- 🟡 **The entire database stack is dead weight.** `tortoise-orm`, `aerich`, `aiosqlite`, `models.py` (a `Project` model), and `register_tortoise` in `main.py` are wired up but **no endpoint ever touches the DB** — projects live in `frontend/src/data.js`. Dropping the ORM removes 3 dependencies, schema generation at startup, and the sqlite files, shrinking cold-start time on Render's free tier (where cold starts are already the pain point).

- 🟡 **The chatbot's RAG corpus is one file.** `backend/data/` contains only `resume.txt`. The pipeline (chunking by `[TITLE:]` blocks, hashing, cached embeddings) is genuinely well built — it's just underfed. Add 3–4 more docs: per-project deep-dives (what/why/stack/outcome), an FAQ (availability, rates, remote work, timezone), and the "behind the mask" story. Ten minutes of writing directly upgrades every chatbot answer — this is the highest-leverage content edit on the whole site.

- 🟢 **Dead endpoint**: `GET /api/hello` in `homepage.py` is scaffolding — remove the router or repurpose it.

### 1.3 Chatbot page (`ChatbotPage.jsx`)

- 🟡 **Returning visitors get an invisible split-brain conversation.** The session id persists in localStorage and the server remembers the history, but the UI always starts blank — so the bot may "remember" things the visitor can't see it remembering. Pick one: (a) show the history on load (needs a `GET /api/chat/history/{session_id}` endpoint — knowledge of the UUID acts as the credential), or (b) simpler, add a "NEW CHAT 🕸️" button that clears the stored session id, and don't reuse old ids across page loads.

- 🟡 **Markdown renders as raw asterisks.** `MessageBubble` renders `msg.content` as plain text, but gpt-4o-mini loves emitting `**bold**` and `- lists`. Either add "Reply in plain text only, no markdown formatting" to `backend/app/system_prompt.txt`, or render a minimal safe subset (bold/italics/code) client-side.

- 🟢 **The textarea can't grow.** `rows={1}` with a "SHIFT+ENTER for new line" hint — new lines exist but the box stays one row tall (and `textareaRef` is created but never used). Wire the ref to auto-size (`height = 'auto'; height = scrollHeight`) capped at ~4 rows.

- 🟢 **`if (loading) setLoading(false)` reads a stale closure** (`ChatbotPage.jsx:332`) — the `loading` value is frozen from when `send()` was created. It happens to work (worst case a redundant `setLoading(false)`), so just drop the `if` and call `setLoading(false)` unconditionally on first token.

- 🟢 **The header quick-question row can overflow.** The four `SUGGESTIONS.slice(4)` buttons sit in a non-wrapping flex row in the chat header — verify mid-width behaviour and add `flexWrap: 'wrap'` or hide them below a breakpoint (the sidebar + welcome screen already cover suggestions).

### 1.4 Games page (`GamesPage.jsx`)

- 🟡 **1,500 lines, ~95% inline styles.** The portfolio page keeps styles in `App.css`; the games page defines nearly everything inline — no hover/focus pseudo-classes (hover is simulated with `useState` + `onMouseEnter`, which re-renders the card per mouse move and can't do `:focus-visible` at all). Migrating the repeated panel/header/button patterns into `GamesPage.css` classes would cut the file in half and give keyboard users proper focus states.

- 🟡 **One hard-coded fallback puzzle.** When `/api/games/spot-bug/puzzle` fails (e.g. Render cold start — likely the *first* thing a visitor hits), every retry serves the identical `sumArray` off-by-one puzzle. Ship a local pool of 5–6 fallback puzzles and pick randomly, so even a cold backend feels alive. Bonus: show a "waking up the server…" message on first slow fetch — a 30 s cold start with just a spinning 🕷️ looks broken.

- 🟢 **Duplicate initial-load logic.** The mount `useEffect` in `SpotTheBug` re-implements `loadPuzzle` inline; call `loadPuzzle()` from the effect instead (it already resets all state).

- 🟢 **`GameCard` click lives on a `div`.** The inner "PLAY NOW →" button has no `onClick` — clicks bubble to the card div. Works for mouse and (accidentally) keyboard, but move the handler onto the button and make the card a `<button>`/add `role` for honest semantics.

- 🟢 **Shared SVG components are duplicated.** `WebCornerSVG` and `SpiderSymbolSVG` are defined in both `ChatbotPage.jsx` and `GamesPage.jsx` (slightly diverged copies). Extract to `components/spider-svgs.jsx`.

### 1.5 Deployment & measurement

- 🟡 **Add analytics — you're flying blind.** There is currently no way to know whether recruiters visit, which projects they open, or whether anyone plays the games. A privacy-friendly, cookie-less option (Vercel Analytics is one click on your stack; Plausible/GoatCounter also work) needs no consent banner and answers the only question that matters for a portfolio: *is anyone seeing this?*

- 🟢 **Long-cache headers for heavy media.** `vercel.json` only has the SPA rewrite. `/spood*.webp` (~7.5 MB combined), `piercespood.mp4`, and images are re-validated per visit; add a `headers` block with `Cache-Control: public, max-age=31536000, immutable` for `*.webp`, `*.mp4`, `*.jpg`, `*.png` (they only change when the file is replaced anyway).

- 🟢 **Keep the backend warm.** Render free tier sleeps after 15 min → ~30 s cold start right when someone opens the chatbot. A free uptime pinger (UptimeRobot / cron-job.org) hitting `/healthz` every 10 min keeps it warm during the day. (Check Render's current free-tier ToS stance on pinging.)

- 🟢 **Add an `apple-touch-icon`.** Only `favicon.svg` exists — iOS home-screen saves and some link previews fall back to a screenshot. Add a 180×180 PNG (`<link rel="apple-touch-icon">`) — the spider logo on the dark background.

### 1.6 Content

- 🟡 **Feed the chatbot your projects** (same as §1.2 RAG note — listed here because it's a *writing* task, not a coding one): the bot currently can't answer "tell me more about Lumiere Lounge" any better than the project card can.

- 🟢 **Games hint text says "TAKES 60 SECONDS"** (`GamesCalloutSection`) but a Render cold start alone can eat 30 of them. Either keep the backend warm (§1.5) or soften the promise.

---

## Part 2 — Design Recommendations

Second pass — the comic identity on the main page is now strong and consistent; these push the two sub-pages up to the same standard and add polish.

### 2.1 Bring the sub-pages into the same book

- 🟡 **The chatbot and games pages skip the shared chrome.** No preloader flash (good) but also no scan-lines… actually those are global — the real gap: the main page's section-label webs, corner decorations, and comic dividers are absent, and both pages define their own one-off nav bars (`.top-nav`, `.games-nav`) with different back-link styles ("← BACK" vs "EXIT →" vs "PD"). Unify: one shared sub-page nav component with the `Pierce.exe_` logo (brand continuity — it's your best recurring mark) and a consistent "← BACK TO HQ" link.

- 🟢 **Issue numbering should extend to the sub-pages.** The main page now reads as ISSUE #01–#08; the games page could open with `// ANNUAL #1 — THE ARCADE` and the chatbot with `// ANNUAL #2 — SPIDER-COMM` (comics publish "Annuals" as side-stories — exactly what these pages are).

### 2.2 Chatbot page polish

- 🟡 **Speech-bubble tails.** The chat is the one place actual comic speech balloons are *literally the correct UI* and the bubbles are plain rectangles. A small CSS triangle tail on `.msg-bubble` (left for Spider-PD, right for you) plus slightly rounded corners on the AI side sells the comic panel instantly. Keep the hard black borders.

- 🟢 **Give Spider-PD an entrance.** First bot response could be prefixed by the typing indicator morphing in with a tiny "THWIP" label instead of appearing bare — one keyframe, big personality.

- 🟢 **The `PD` monogram avatar for the *user* and the sidebar portrait both say PD** — the visitor isn't Pierce. Change the user avatar to `YOU` or a generic silhouette so the roles read correctly at a glance.

### 2.3 Games page polish

- 🟡 **The timer deserves the theme.** "WEB FLUID" is a great label on a plain progress bar — render the remaining time as a depleting web-strand (dashed SVG line losing dashes, or the bar with a spiderweb texture) and flash the frame red under 5 s. This is the game's core tension surface; it's currently the least styled element on the page.

- 🟢 **Result cards could slam.** Win/lose banners fade in via `gamesSlideUp`; a comic "stamp" entrance (scale from 1.6 → 1 with a slight rotation, like the letter-slam you already have on MY WORK) matches the POW-moment these screens are.

- 🟢 **J. Jonah Jameson / Aunt May reactions are the best jokes on the site** — give them portrait treatment: a small square avatar frame (📰 / 👵 emoji is fine) with a "DAILY BUGLE" / "MAY'S KITCHEN" caption bar, styled like the comic-panel headers on the main page.

### 2.4 Main page — second-order polish

- 🟢 **Scrollspy the nav.** Highlight the active section link (cyan underline you already have on hover) via an IntersectionObserver — you already run one for reveals; reuse it. Helps orientation on a long single-page scroll.

- 🟢 **"TO BE CONTINUED…" could point somewhere.** It's currently decorative; make it a link to `#/games` ("the story continues in the Annuals") so the footer converts instead of just closing.

- 🟢 **Consider `prefers-reduced-data`.** The animated WebPs are now reasonable (~3.7 MB each) but still the heaviest assets; a `(prefers-reduced-data: reduce)` media check (plus `Save-Data` header awareness isn't possible client-side, but the media query is) could swap them for static frames on metered connections.

---

## Suggested priority order

1. Remove/protect the chat session list & delete endpoints (privacy).
2. Fix proxy IP handling so rate limits actually work per-visitor on Render.
3. Feed the RAG corpus (biggest content win, zero code).
4. Add analytics.
5. Chatbot: new-chat button + plain-text/markdown fix; games: fallback pool + cold-start message.
6. Drop the unused ORM stack; stop leaking SMTP errors.
7. Design: sub-page nav unification, speech-bubble tails, web-fluid timer.
8. Everything 🟢 as time allows.
