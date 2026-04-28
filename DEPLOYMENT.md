# Deployment — free-tier hosting

Recommended stack:

- **Frontend** → [Vercel](https://vercel.com) (free, instant, no sleep)
- **Backend** → [Render](https://render.com) (free web service, sleeps after 15 min of inactivity, ~30 s cold start)

This combo is $0/month. Both providers connect directly to GitHub and redeploy on push.

---

## 1. Push the repo (already done if you ran `git push`)

The repo is at `https://github.com/youngdaggerduc/Portfolio-Website`.

---

## 2. Deploy the backend on Render

1. Sign up at <https://render.com> with your GitHub account.
2. Dashboard → **New +** → **Blueprint**.
3. Pick the `Portfolio-Website` repo. Render reads `render.yaml` at the repo root and proposes a service called `portfolio-api`.
4. Click **Apply**. Render starts the first deploy (≈3 min).
5. Once the service exists, open it → **Environment** → set the secrets that were marked `sync: false`:
   - `OPENAI_API_KEY` — your OpenAI key (required for chatbot + games)
   - `ALLOWED_ORIGINS` — leave blank for now; you'll fill it in after step 3 with your Vercel URL
   - `SMTP_USER`, `SMTP_PASSWORD`, `CONTACT_TO_EMAIL` — only if you want the contact form to send mail. Use a [Gmail App Password](https://myaccount.google.com/apppasswords), not your account password.
6. Click **Manual Deploy → Deploy latest commit** to pick up the env changes.
7. Once it's live, copy the URL Render gives you (looks like `https://portfolio-api-xxxx.onrender.com`). Test it:
   ```
   curl https://portfolio-api-xxxx.onrender.com/healthz
   # → {"ok":true}
   ```

i dep

---

## 3. Deploy the frontend on Vercel

1. Sign up at <https://vercel.com> with your GitHub account.
2. Dashboard → **Add New… → Project** → import the `Portfolio-Website` repo.
3. On the configure screen:
   - **Root Directory** → `frontend`
   - **Framework Preset** → Vite (auto-detected)
   - **Build Command** → `npm run build` (default)
   - **Output Directory** → `dist` (default)
4. Expand **Environment Variables** and add:
   - `VITE_API_BASE_URL` = `https://portfolio-api-xxxx.onrender.com` (the URL from step 2.7, no trailing slash)
5. Click **Deploy**. ≈1 min later you have a live URL like `https://portfolio-website-xxxx.vercel.app`.

---

## 4. Wire CORS back to Render

1. Copy the Vercel URL.
2. Go back to Render → your service → **Environment** → set:
   - `ALLOWED_ORIGINS` = `https://portfolio-website-xxxx.vercel.app`
   - (If you add a custom domain later, comma-separate: `https://pierce-doman.com,https://portfolio-website-xxxx.vercel.app`)
3. Save → Render redeploys automatically (~1 min).
4. Visit your Vercel URL — the chatbot, games, and contact form should all work end to end.

---

## 5. (Optional) Custom domain

Both Vercel and Render accept custom domains for free.

**On Vercel** (frontend):
- Project → Settings → Domains → add `pierce-doman.com` (or whatever you own).
- Vercel shows the DNS records to set at your registrar (Namecheap, GoDaddy, Cloudflare DNS, etc).

**On Render** (backend) — usually not needed; the auto-generated `*.onrender.com` URL is fine since users never see it. If you do want `api.pierce-doman.com`:
- Service → Settings → Custom Domains → add it, set the CNAME at your registrar.
- Update `VITE_API_BASE_URL` on Vercel to the new domain.
- Update `ALLOWED_ORIGINS` on Render to include both old and new frontend domains.

---

## What got configured for deployment

- `render.yaml` — Blueprint that creates the FastAPI service on Render with `uvicorn app.main:app --host 0.0.0.0 --port $PORT` and a `/healthz` health check.
- `backend/runtime.txt` — pins Python 3.12.5 on Render.
- `backend/app/main.py` — CORS origins now read from `ALLOWED_ORIGINS` env var (comma-separated). Adds a `/healthz` endpoint.
- `frontend/src/lib/api.js` — `apiUrl()` helper. Reads `VITE_API_BASE_URL` at build time. All `fetch()` calls in `ChatbotPage`, `GamesPage`, and `ContactSection` go through it.
- `frontend/vercel.json` — SPA rewrite so hash-route deep links resolve.
- `frontend/.env.example`, updated `backend/.env.example` — document every var.
- `.gitignore` — drops `frontend/.env*` so secrets never get committed.

---

## Alternatives if Render's cold start bugs you

| Frontend | Backend | Notes |
|---|---|---|
| **Vercel** | **Fly.io** | Fly's free tier keeps small VMs warm 24/7. More setup (need `fly.toml` + Dockerfile). |
| **Vercel** | **Hugging Face Spaces** (Docker) | No sleep on free tier, generous. Slightly slower deploys. |
| **Cloudflare Pages** | **Render** | Same as recommended but with Cloudflare's CDN on the static side. |
| **Netlify** | **Render** | Equivalent to Vercel + Render. Pick whichever UI you prefer. |

Vercel + Render is the recommended starting point because it's the simplest path that works first try.
