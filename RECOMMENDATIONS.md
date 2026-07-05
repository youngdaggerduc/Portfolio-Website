# Portfolio Website — Recommendations

Review date: 2026-07-05. Scope: full frontend review (main portfolio page, shared components, meta/SEO, assets). Constraint respected throughout: **no layout changes to the hero section** — hero notes are styling/content polish only.

Legend: 🔴 fix soon · 🟡 worth doing · 🟢 nice-to-have

> **STATUS UPDATE (2026-07-05): almost everything below has been implemented.** Still outstanding — these need input only you can provide:
>
> 1. **Project links** — `Modal.jsx` now renders "VIEW CODE" / "LIVE DEMO" only when a project has `github` / `live` fields in `frontend/src/data.js`. Add the URLs there when ready (buttons stay hidden until then).
> 2. **Absolute OG URLs** — `/og-image.jpg` (1200×630, generated from the hero video) is wired into `index.html`, but `og:image` should be prefixed with your production domain once you know it (see TODO comment in `index.html`). Same blocker applies to `og:url`, `<link rel="canonical">`, and `sitemap.xml` — all skipped until the domain exists.
> 3. **Phone number visibility** and **adding Education/Certificates to the nav** — your call, left as-is.
> 4. The broad inline-style→CSS migration and the SwingFigure/SwingingSpood animation choreography were left alone (high churn / needs visual tuning by eye).
>
> Notable extras done during implementation: the 34 MB GIFs are now ~3.7 MB animated WebPs (originals kept locally as `*.original.gif`, gitignored), the resume was renamed to `pierce-doman-resume.pdf`, and the preloader now only plays once per tab session.

---

## Part 1 — General Recommendations

### 1.1 Functional bugs

- 🔴 **The swinging Spider-Man in About is never visible.** In `frontend/src/components/SwingingSpood.jsx:94`, visibility is set with `visible: opacity > 1`. Opacity is computed as `fadeIn * fadeOut`, both capped at 1, so it can never exceed 1 — `visibility` is always `hidden` and the whole swing (character + web line) never shows on desktop. Change to `opacity > 0`. This is a flagship theme moment that's currently dead code.

- 🔴 **Project modal has dead buttons.** `frontend/src/components/Modal.jsx:47-62` — "VIEW CODE" and "LIVE DEMO" both link to `#` for every project. Clicking them scrolls to the top and goes nowhere, which reads as unfinished to a recruiter. Add `github` / `live` fields per project in `frontend/src/data.js` and render each button only when its link exists. For proprietary work (Radian, Lumiere Lounge) drop "VIEW CODE" entirely rather than faking it.

- 🟡 **Certificate carousel snaps backwards on wrap.** `CertsSection.jsx` advances `pos` mod `total`, so going from the last card back to 0 makes the track jump left in one frame instead of continuing forward, despite the array being duplicated (`[...CERTS, ...CERTS]`). Let `pos` grow past `total` and reset the transform (transition disabled) once it exceeds the first copy.

- 🟡 **Carousel card width breaks on small phones.** The track translates by a hard-coded `CARD_W = 256` (`CertsSection.jsx:19`), but at `max-width: 420px` the CSS shrinks `.cert-card` to 200px (`App.css:2457`). Slides drift further off-center with each advance. Read the real card width (ref + `offsetWidth`) or use a CSS variable both sides share.

- 🟡 **Dev-hint text can appear publicly.** `BehindTheMaskSection.jsx:27` — if `me.jpeg` ever fails to load, visitors see "Upload me.jpg to show your photo". Replace the fallback hint with something in-universe ("IDENTITY CLASSIFIED" fits the mask conceit) or just the initials.

- 🟢 **External links should open in new tabs.** GitHub/LinkedIn in `ContactSection.jsx` `SOCIALS` lack `target="_blank" rel="noopener noreferrer"`. Recruiters mid-scroll shouldn't lose the site.

- 🟢 **Hardcoded footer year.** `App.jsx:70` — `© 2026` will go stale; use `new Date().getFullYear()`.

### 1.2 Performance

- 🔴 **Two GIFs total ~67 MB.** `spoodhand.gif` (34 MB) and `spoodswing.gif` (33 MB) are the two heaviest assets on the entire site — heavier than everything else combined by ~40×, and both are committed to git and deployed. Convert them to looping `<video>` (WebM/VP9 with an MP4 fallback, muted/autoplay/loop/playsinline — you already have the exact autoplay handling in `HeroSection.jsx` to reuse) or animated WebP. Expect ~1–2 MB each at the same visual quality. This is the single biggest improvement available on the site; on mobile data these GIFs are effectively unloadable.

- 🟡 **Add a `poster` to the hero video.** `HeroSection.jsx:45-58` — until `piercespood.mp4` (772 KB) buffers, the hero is a dark void. A poster frame (grab the first frame, export as compressed JPG/WebP) makes first paint instant and doubles as the fallback when iOS blocks autoplay in Low Power Mode.

- 🟡 **Preloader gates every visit by a minimum 1.1 s** (`Preloader.jsx:16`). It's a great first impression, but repeat visitors and people bouncing between `#/games` / `#/chatbot` and back pay it every time the Portfolio remounts. Store a `sessionStorage` flag and skip (or shorten to ~300 ms) after the first showing.

- 🟢 **Rename `Pierce Doman Resume.pdf`** to `pierce-doman-resume.pdf` — spaces in URLs get encoded to `%20` and look messy when shared/linked directly.

### 1.3 SEO & sharing

- 🔴 **The social share image won't render.** `index.html:31,40` uses `/favicon.svg` for `og:image` and `twitter:image`. Two problems: most platforms (LinkedIn, X, WhatsApp, Discord) don't render SVG previews at all, and OG images must be **absolute URLs**. Create a 1200×630 raster card (hero frame + name + title — the Spider-Verse styling will make it pop in feeds) and reference it with the full production URL. For a portfolio, link previews on LinkedIn are arguably the highest-traffic surface there is.

- 🟡 **Add `og:url` + `<link rel="canonical">`** with the production domain, and a `sitemap.xml` referenced from `robots.txt`.

- 🟡 **Enrich the JSON-LD Person** (`index.html:56-88`): add `url`, `image`, and `sameAs: [github, linkedin]` — that's what actually links your identity graph for search.

- 🟡 **Per-route document titles.** `App.jsx` swaps pages on hash change but the `<title>` stays "Pierce Doman — Full Stack Developer & AI Engineer" on the chatbot and games pages. Set `document.title` per route (also fixes browser history/bookmarks).

### 1.4 Accessibility

- 🟡 **Modal dialog semantics.** `Modal.jsx` handles Escape but: no `role="dialog"` / `aria-modal="true"`, focus is not moved into the modal on open nor returned to the trigger on close, there's no focus trap, and the page behind still scrolls. The Nav drawer already locks body scroll (`Nav.jsx:32`) — reuse that pattern.

- 🟡 **Auto-advancing carousel can't be paused.** `CertsSection.jsx:76-79` rotates every 3.2 s unconditionally (WCAG 2.2.2). Pause on hover/focus-within, and stop auto-advance permanently once the user interacts with the arrows/dots.

- 🟡 **Per-letter headings read poorly in screen readers.** `LetterReveal` splits titles into individual letter spans, which many screen readers announce letter-by-letter. Give the wrapper `aria-label` with the full text and `aria-hidden` on the letter spans (same for `TypedText` — expose the full sentence immediately to AT rather than as it types).

- 🟡 **Low-contrast small text.** Several places set body copy at 11–13 px with `opacity: 0.6`–`0.7` (`ContactSection.jsx:207`, `.hero-stat-l`, cert dates). On `#07071a` that lands well under the 4.5:1 WCAG ratio. Keep the muted look but raise to ~`rgba(240,238,255,0.78)` minimum for anything under 18 px.

- 🟢 **Project cards are click-targets on `div`s** (`ProjectsSection.jsx:27-32`). Keyboard users can still reach the inner "VIEW PROJECT →" button, so this works — but add `cursor: pointer` awareness for the card plus a visible `:focus-visible` style on the button so keyboard flow is obvious.

### 1.5 Content & credibility

- 🟡 **Prove the work.** The projects section describes six projects but links to no code, demos, or write-ups (see dead modal buttons above). Even 2–3 public GitHub repos or one short case-study per flagship project (problem → approach → result, with a metric) dramatically raises credibility. The Lumiere Lounge and Radian entries would benefit most from a "shipped to production for a real client" screenshot walkthrough.

- 🟡 **"2:1 Honours" appears four times** (hero stats, About stats, About text, Education). Once in Education plus once in the hero is plenty — repetition makes it read like the headline achievement when your shipped projects are stronger evidence. Consider swapping the About stat for something like "6 Shipped Projects" or "2 Books Published" (which is buried in a bullet but is genuinely distinctive).

- 🟡 **Hero stat says "5 Projects Led" while the site shows 6 project cards** — a visitor who counts will notice. Either clarify the stat label ("5 Stalled Projects Rescued" is more specific *and* more impressive) or align the numbers.

- 🟢 **Odd phrasing** in `data.js:22`: "Earned Second Class Honours recognition" attached to the final-year project reads confusingly (degrees earn honours, projects don't). Reword to e.g. "Contributed to a Second Class Honours degree" or drop it there.

- 🟢 **Clean out commented-off certs** in `CertsSection.jsx:9-10` ("Coming Soon" entries) — dead data in a file recruiters may actually read if they view source on GitHub.

- 🟢 **Publishing your phone number** invites scraper spam. Your call — but email + LinkedIn is standard for portfolios.

### 1.6 Code quality (low priority, non-user-facing)

- 🟢 Heavy inline `style={{}}` usage across sections (About "Currently" list, Contact success state, hero CTA overrides). Works fine, but migrating repeated patterns into `App.css` classes would shrink the JSX and keep hover/focus states possible.
- 🟢 `HERO_STATS` in `HeroSection.jsx` and the About stats grid duplicate the same four facts in two shapes — one shared source in `data.js` prevents drift (the "5 vs 6 projects" issue above is exactly this kind of drift).
- 🟢 `Nav.jsx` `LINKS` omits Education and Certificates — probably intentional to keep the bar tight, but worth a deliberate decision; the mobile drawer has room for both.

---

## Part 2 — Design Recommendations

The Spider-Verse comic direction is strong and consistently executed — halftones, hard offset shadows, Bangers display type, CMYK-ish red/cyan/magenta. These recommendations lean *into* the theme rather than diluting it.

### 2.1 Hero (styling/content only — layout untouched)

- 🟡 **Role pill casing is inconsistent.** "FULL STACK", "AI ENGINEER", "FREELANCER" are uppercase; "Business Process Analyst" is title case (`HeroSection.jsx:97`) and it's also much longer than its row-mate, making the second row feel unbalanced. Uppercase it and consider the shorter "PROCESS ANALYST" or "BIZ PROCESS ANALYST" so both rows carry similar visual weight. No layout change — same pills, same rows.

- 🟡 **Poster frame for the video** (also listed under performance) is a *design* fix too: the current dark flash before the video buffers is the very first thing every visitor sees.

- 🟢 **Tagline contrast.** The `.hero-tagline` paragraph sits over the busiest part of the vignette; a slightly stronger text shadow or +0.1 opacity on the text would improve legibility on mid-brightness screens without touching position or size.

- 🟢 **"With Great Code Comes Great Responsibility"** is the best theme beat on the page — consider giving it a comic caption-box treatment (yellow-tinted box, black border, slight rotation — the classic narration box from the films) instead of plain text. Same slot, same size; pure restyle.

### 2.2 Theme depth — make the comic conceit do more work

- 🟡 **Fix the chapter numbering.** Sections are labeled `// Chapter 01`, `01.5`, `01.8`, `02`, `03`, `04`, with "Credentials" and "Bonus Stage" unnumbered. The decimal chapters read like retrofits. Renumber sequentially — or better, commit to the comic conceit fully: `ISSUE #01 — ORIGIN STORY`, `ISSUE #02 — FIELD WORK`, `ISSUE #03 — TRAINING ARC`… Comic issues are the native unit of the genre and give every section a title, not just a number.

- 🟢 **Onomatopoeia accents at section transitions.** The comic dividers are good but purely geometric. One or two small "THWIP!" / "WHAM!" burst-star graphics (SVG, rotated, behind the divider) at key transitions — e.g. entering MY WORK — would be a high-theme, low-effort touch. Use sparingly: two on the whole page, not one per divider.

- 🟢 **Vary the second Spider-Comm strip.** The identical marquee appears after the hero and again before Contact (`App.jsx:47,61`). Second appearance could swap copy ("STILL SCROLLING? ASK THE BOT →") so it reads as a designed reprise, not a repeated component.

- 🟢 **The footer breaks character.** Every section is a comic panel, then the footer is two centered lines of plain text. A thin final panel — black bar, halftone, "TO BE CONTINUED…" in Bangers with the copyright line beneath — ends the book the way it started.

### 2.3 Color system

- 🟡 **Give the three accents consistent meaning.** Right now cyan/red/magenta are assigned round-robin (projects rotate `cyan → red → mag`, education cards likewise). The palette is great; its *semantics* are random. A simple rule — **cyan = interactive/links, red = identity/emphasis, magenta = AI-related** — would make the accents scannable: AI Image Generator and the AI/ML skill block are magenta, freelance/client work cyan, etc. Small change in `data.js` color assignments, big gain in coherence.

- 🟢 The magenta CV button on the hero already breaks from the red/cyan CTA pair nicely — it would land even better once magenta consistently means "the AI stuff", since the chatbot/games are your AI showpieces.

### 2.4 Typography & readability

- 🟡 **Body copy is small for its density.** Space Mono at 13 px is used for full paragraphs (About, modal details, job bullets). Monospace is already low-efficiency for long-form reading; at 13 px on dark it gets tiring. Bump long-form body text to 14–15 px (keep labels/tags at 11–12 px — the size *contrast* is part of the comic look). No layout implication; the panels are fluid.

- 🟢 Bangers is doing display duty everywhere from 48 px titles down to 18 px buttons. At small sizes with letter-spacing it can get spindly — keep Bangers ≥ 16 px and let Space Mono bold handle anything smaller.

### 2.5 Motion & polish

- 🟡 **Restore the About swing** (bug in §1.1) — then check its choreography: the swing plus SwingFigure plus letter-pop title plus panel reveals all fire in the same viewport. Consider delaying SwingFigure until the swing completes so the section's two hero animations don't compete.

- 🟢 The `prefers-reduced-motion` and touch-device fallbacks (`App.css:543,1338,2673`) are genuinely well done — rare to see. Once the GIFs become videos, remember to gate their autoplay behind the same media queries.

- 🟢 **Cert cards could use a hover lift** consistent with project cards (translate −2px, deepen the offset shadow) — currently they're the only cards on the page that don't respond to hover, which makes the carousel feel less interactive than it is.

### 2.6 Section-specific touches

- 🟢 **Certificates**: every card header says "CERTIFIED" — the issuer ("UDEMY", "FREECODECAMP") in the colored header bar would carry more information at the same visual weight, and the repeated word is doing nothing.
- 🟢 **Tech stack**: all pills are visually equal, so React reads the same as tools you've touched once. Either trim to what you'd happily be interviewed on, or add a subtle "core" treatment (filled vs outlined pill) for your top ~6.
- 🟢 **Contact**: "TRANSMITTED!" success state is a perfect theme beat. Consider matching the error state to it — a red comic panel ("WEB FLUID JAMMED — try again or email me directly") instead of the current plain bordered div, so even failure stays in character.

---

## Suggested priority order

1. Fix the SwingingSpood visibility bug (one character).
2. Replace the two ~34 MB GIFs with video/WebP (biggest UX win on the site).
3. Real OG share image + absolute URL (biggest reach win — LinkedIn previews).
4. Project links in modal / remove dead buttons (credibility).
5. Hero video poster + role-pill casing.
6. Carousel fixes (wrap snap, mobile width, pause on hover).
7. Modal a11y (focus trap, dialog role, scroll lock).
8. Chapter renumbering + accent-color semantics pass.
9. Everything marked 🟢 as time allows.
