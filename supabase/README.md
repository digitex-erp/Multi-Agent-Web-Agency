# Supabase setup (Phase 2)

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run `supabase/migrations/001_leads.sql`.
3. Copy **Project URL** and **service_role** key (Settings → API).
4. Add to Vercel and local `.env`:

```env
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Never** expose `SUPABASE_SERVICE_ROLE_KEY` in the browser — server-only.

Without these vars, the app uses **in-memory fallback** (demo leads reset on server restart).
