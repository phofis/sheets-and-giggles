-- `users` — account rows, one per signed-in identity.
--
-- `auth_provider` enum covers the three planned sign-in paths: email/password
-- (Supabase email auth) plus Google and Apple OAuth. `auth_provider_id` stores
-- the OAuth `sub` for google/apple and stays NULL for email signups (the email
-- itself lives in the `email` column and is uniqueness-enforced by Supabase
-- Auth).

CREATE TYPE public.auth_provider AS ENUM ('email', 'google', 'apple');

CREATE TABLE public.users (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_provider    public.auth_provider NOT NULL,
  auth_provider_id TEXT,
  email            TEXT,
  display_name     TEXT NOT NULL,
  avatar_url       TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Partial unique index: enforces uniqueness on (auth_provider, auth_provider_id)
-- only for rows that actually carry an OAuth `sub`. Email signups persist
-- auth_provider_id = NULL and so are skipped here; their uniqueness is the
-- responsibility of the `email` column / Supabase Auth.
CREATE UNIQUE INDEX users_provider_unique
  ON public.users (auth_provider, auth_provider_id)
  WHERE auth_provider_id IS NOT NULL;

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY users_select_own ON public.users
  FOR SELECT TO authenticated
  USING (id = (SELECT auth.uid()));

CREATE POLICY users_insert_own ON public.users
  FOR INSERT TO authenticated
  WITH CHECK (id = (SELECT auth.uid()));

CREATE POLICY users_update_own ON public.users
  FOR UPDATE TO authenticated
  USING (id = (SELECT auth.uid()))
  WITH CHECK (id = (SELECT auth.uid()));
