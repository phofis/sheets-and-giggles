-- `classes` — searchable catalog of official and custom classes.
--
-- Mirrors the `races` access model: official rows are global, custom rows are
-- created by users and editable/deletable only by their author.
-- `subclass_level` is the character level at which a subclass must be picked.

CREATE TABLE public.classes (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name               TEXT NOT NULL,
  short_description  TEXT NOT NULL,
  subclass_level     SMALLINT NOT NULL DEFAULT 3 CHECK (subclass_level BETWEEN 1 AND 20),
  is_official        BOOLEAN NOT NULL DEFAULT false,
  created_by_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.classes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE INDEX classes_name_idx ON public.classes (lower(name));

CREATE UNIQUE INDEX classes_official_name_unique
  ON public.classes (lower(name))
  WHERE is_official;

ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY classes_select_authenticated ON public.classes
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY classes_insert_custom ON public.classes
  FOR INSERT TO authenticated
  WITH CHECK (
    created_by_user_id = (SELECT auth.uid())
    AND is_official = false
  );

CREATE POLICY classes_update_own_custom ON public.classes
  FOR UPDATE TO authenticated
  USING (
    created_by_user_id = (SELECT auth.uid())
    AND is_official = false
  )
  WITH CHECK (
    created_by_user_id = (SELECT auth.uid())
    AND is_official = false
  );

CREATE POLICY classes_delete_own_custom ON public.classes
  FOR DELETE TO authenticated
  USING (
    created_by_user_id = (SELECT auth.uid())
    AND is_official = false
  );
