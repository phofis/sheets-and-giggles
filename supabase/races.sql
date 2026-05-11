-- `races` — searchable catalog of official and custom races.
--
-- Official rows (`is_official = true`) are seeded/admin-managed and globally
-- visible. Custom rows are owned by the user who created them; any
-- authenticated user can still SELECT them so the search UI works.

CREATE TABLE public.races (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name               TEXT NOT NULL,
  short_description  TEXT NOT NULL,
  is_official        BOOLEAN NOT NULL DEFAULT false,
  created_by_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.races
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE INDEX races_name_idx ON public.races (lower(name));

CREATE UNIQUE INDEX races_official_name_unique
  ON public.races (lower(name))
  WHERE is_official;

ALTER TABLE public.races ENABLE ROW LEVEL SECURITY;

CREATE POLICY races_select_authenticated ON public.races
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY races_insert_custom ON public.races
  FOR INSERT TO authenticated
  WITH CHECK (
    created_by_user_id = (SELECT auth.uid())
    AND is_official = false
  );

CREATE POLICY races_update_own_custom ON public.races
  FOR UPDATE TO authenticated
  USING (
    created_by_user_id = (SELECT auth.uid())
    AND is_official = false
  )
  WITH CHECK (
    created_by_user_id = (SELECT auth.uid())
    AND is_official = false
  );

CREATE POLICY races_delete_own_custom ON public.races
  FOR DELETE TO authenticated
  USING (
    created_by_user_id = (SELECT auth.uid())
    AND is_official = false
  );
