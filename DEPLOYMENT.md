# v2 Deployment Guide

The v2 stack is two services: **Next.js on Vercel** (frontend) and **FastAPI on Railway** (backend). Both pull from the same GitHub repo.

---

## 1. Backend — FastAPI on Railway

### Pre-deploy
Grab the **JWT Secret** from Supabase (Settings → API → JWT Settings → JWT Secret). FastAPI uses this to verify Supabase-issued tokens.

### Steps
1. Go to https://railway.app → New Project → Deploy from GitHub repo
2. Select `hatimpiplodwala/job-tracker`
3. Settings → **Root Directory**: `backend`
4. Settings → **Variables**, add:
   ```
   SUPABASE_URL          = https://xxxx.supabase.co
   SUPABASE_ANON_KEY     = (anon public key)
   SUPABASE_JWT_SECRET   = (JWT secret from Supabase API settings)
   CORS_ORIGINS          = https://your-vercel-domain.vercel.app
   ```
5. Settings → **Networking** → Generate Domain. Copy the URL — you'll need it for the frontend.
6. Railway auto-detects `railway.json` and runs `uvicorn main:app --host 0.0.0.0 --port $PORT`.
7. Verify: open `https://<your-railway-domain>/health` → should return `{"status":"ok"}`.

### Alternative: Render
Same setup. Use the `Procfile` instead of `railway.json`. Root directory: `backend`.

---

## 2. Frontend — Next.js on Vercel

### Steps
1. Go to https://vercel.com → New Project → Import `hatimpiplodwala/job-tracker`
2. **Root Directory**: `frontend`
3. **Environment Variables**, add:
   ```
   NEXT_PUBLIC_SUPABASE_URL       = https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY  = (anon public key)
   NEXT_PUBLIC_API_URL            = https://<your-railway-domain>
   ```
4. Deploy. Vercel auto-detects Next.js.
5. After deploy, update the backend's `CORS_ORIGINS` env var on Railway to include the live Vercel URL, then redeploy backend.

---

## 3. Smoke test

1. Open the Vercel URL → redirected to `/login`
2. Create an account → redirected to `/dashboard`
3. Add an application → row appears in table
4. Edit a row → save → delete (two-click confirm)
5. Click **Export CSV** → downloads file
6. Hard refresh — session persists (cookie-based)

---

## Notes

- Supabase RLS still scopes data per-user; FastAPI passes the user's JWT to Postgrest so policies fire as `auth.uid()`.
- v1 (Streamlit) remains untouched and continues running on Streamlit Cloud. Both can coexist against the same database.
- Both Vercel and Railway redeploy automatically on every push to `main`.
