# BCSO production backend

This folder contains the production database schema and secure Edge Functions. GitHub Pages alone cannot provide secure authentication, server-side password hashing, sessions, account lockout, or protected writes; those run in Supabase.

## Setup
1. Create a Supabase project.
2. Open SQL Editor and run `schema.sql`.
3. In Supabase Authentication, keep email/password enabled. The Edge Function maps a BCSO callsign to an internal email (`CALLSIGN@bcso.local`), so personnel only see callsign/password.
4. Deploy both functions: `supabase functions deploy admin-create-user` and `supabase functions deploy admin-delete-user`.
5. Set the Edge Function `SUPABASE_SERVICE_ROLE_KEY` secret. Never put this key in GitHub or browser JavaScript.
6. Add your Supabase project URL and publishable/anon key to the website configuration (the publishable key is safe to expose; the service role key is not).
7. Create the first Commissioner/Admin manually in Supabase Auth, then insert their matching row into `profiles` with role `admin`.

## Security model
- Supabase Auth handles password hashing and sessions.
- Postgres Row Level Security prevents users from bypassing role permissions.
- Admin account creation/deletion is server-side and never exposes the service-role key.
- Reports, announcements, SOPs, subdivision membership, profiles and strikes are persisted in Postgres.
- For lockout protection, configure Supabase Auth's built-in rate limits/CAPTCHA and use `login_attempts` for application-level auditing. Never implement password verification in client JavaScript.

## Important
The repository intentionally contains **no real passwords, API secrets, or service-role keys**. The old demo passwords must not be used as production credentials. Create real accounts through Supabase after setup.
