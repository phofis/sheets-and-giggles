-- `features` — catalog of class/subclass/race/character/background features.
--
-- Each row has exactly one origin (class, subclass, race, character, or
-- background) enforced by the first CHECK. Class/subclass features must
-- declare the `min_character_level` they unlock at; race/character/background
-- features intentionally have none. The composite FK to `subclasses` keeps a
-- subclass-scoped feature anchored to a real subclass under the named class.

CREATE TYPE public.feature_origin_type AS ENUM ('class', 'subclass', 'race', 'character', 'background');

CREATE TABLE public.features (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                TEXT NOT NULL,
  description         TEXT NOT NULL,
  origin_type         public.feature_origin_type NOT NULL,
  class_id            UUID REFERENCES public.classes(id) ON DELETE CASCADE,
  subclass_id         UUID,
  race_id             UUID REFERENCES public.races(id) ON DELETE CASCADE,
  min_character_level SMALLINT CHECK (min_character_level BETWEEN 1 AND 20),
  is_official         BOOLEAN NOT NULL DEFAULT false,
  created_by_user_id  UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  FOREIGN KEY (class_id, subclass_id) REFERENCES public.subclasses(class_id, subclass_id),
  CHECK (
    (origin_type = 'class'    AND class_id IS NOT NULL AND subclass_id IS NULL     AND race_id IS NULL)
    OR (origin_type = 'subclass' AND class_id IS NOT NULL AND subclass_id IS NOT NULL AND race_id IS NULL)
    OR (origin_type = 'race'  AND class_id IS NULL     AND subclass_id IS NULL     AND race_id IS NOT NULL)
    OR (
      origin_type IN ('character', 'background')
      AND class_id IS NULL AND subclass_id IS NULL AND race_id IS NULL
    )
  ),
  CHECK (
    (
      origin_type IN ('class', 'subclass')
      AND min_character_level IS NOT NULL
    )
    OR (
      origin_type IN ('race', 'character', 'background')
      AND min_character_level IS NULL
    )
  )
);

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.features
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE INDEX features_origin_type_idx   ON public.features (origin_type);
CREATE INDEX features_name_idx          ON public.features (lower(name));
CREATE INDEX features_class_id_idx      ON public.features (class_id);
CREATE INDEX features_subclass_key_idx  ON public.features (class_id, subclass_id);
CREATE INDEX features_race_id_idx       ON public.features (race_id);

-- Official features are unique per (origin, owning class/subclass/race, name).
-- COALESCE to a sentinel zero-UUID lets the unique index treat NULL FK columns
-- as a fixed bucket rather than always-not-equal NULLs.
CREATE UNIQUE INDEX features_official_origin_name_unique
  ON public.features (
    origin_type,
    COALESCE(class_id,    '00000000-0000-0000-0000-000000000000'::uuid),
    COALESCE(subclass_id, '00000000-0000-0000-0000-000000000000'::uuid),
    COALESCE(race_id,     '00000000-0000-0000-0000-000000000000'::uuid),
    lower(name)
  )
  WHERE is_official;

ALTER TABLE public.features ENABLE ROW LEVEL SECURITY;

CREATE POLICY features_select_authenticated ON public.features
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY features_insert_custom ON public.features
  FOR INSERT TO authenticated
  WITH CHECK (
    created_by_user_id = (SELECT auth.uid())
    AND is_official = false
  );

CREATE POLICY features_update_own_custom ON public.features
  FOR UPDATE TO authenticated
  USING (
    created_by_user_id = (SELECT auth.uid())
    AND is_official = false
  )
  WITH CHECK (
    created_by_user_id = (SELECT auth.uid())
    AND is_official = false
  );

CREATE POLICY features_delete_own_custom ON public.features
  FOR DELETE TO authenticated
  USING (
    created_by_user_id = (SELECT auth.uid())
    AND is_official = false
  );
