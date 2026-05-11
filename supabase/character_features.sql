-- `character_features` — join table linking characters to the features they
-- carry (granted at creation, level-up, or during adventure).
--
-- Eligibility (origin match, subclass match, level requirement) is enforced
-- in the service layer before insert; this file only restricts who can
-- read/write the join row to the owning character's user.
--
-- The two read views at the bottom (`v_character_features`,
-- `v_character_levelup_available_features`) use `security_invoker = true` so
-- the underlying tables' RLS policies are respected when the view is queried.

CREATE TYPE public.feature_assignment_source AS ENUM ('creation', 'level_up', 'adventure');

CREATE TABLE public.character_features (
  character_id     UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  feature_id       UUID NOT NULL REFERENCES public.features(id) ON DELETE CASCADE,
  assigned_source  public.feature_assignment_source NOT NULL,
  assigned_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (character_id, feature_id)
);

CREATE INDEX character_features_feature_id_idx   ON public.character_features (feature_id);
CREATE INDEX character_features_character_id_idx ON public.character_features (character_id);

ALTER TABLE public.character_features ENABLE ROW LEVEL SECURITY;

CREATE POLICY character_features_select_own ON public.character_features
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.characters
      WHERE characters.id = character_id
        AND characters.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY character_features_insert_own ON public.character_features
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.characters
      WHERE characters.id = character_id
        AND characters.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY character_features_delete_own ON public.character_features
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.characters
      WHERE characters.id = character_id
        AND characters.user_id = (SELECT auth.uid())
    )
  );

-- Resolved feature list per character. Read this view when the app wants to
-- show "what does this character currently have".
CREATE VIEW public.v_character_features
WITH (security_invoker = true)
AS
SELECT
  cf.character_id,
  f.id          AS feature_id,
  f.name        AS feature_name,
  f.description AS feature_description,
  f.origin_type,
  f.class_id,
  f.subclass_id,
  f.race_id,
  f.min_character_level,
  cf.assigned_source,
  cf.assigned_at
FROM public.character_features cf
JOIN public.features f ON f.id = cf.feature_id;

-- Eligible class/subclass features for manual level-up selection, excluding
-- already-assigned rows. Used to populate the level-up UI's "pick a feature"
-- list.
CREATE VIEW public.v_character_levelup_available_features
WITH (security_invoker = true)
AS
SELECT
  c.id AS character_id,
  f.id AS feature_id,
  f.name,
  f.description,
  f.origin_type,
  f.class_id,
  f.subclass_id,
  f.min_character_level
FROM public.characters c
JOIN public.features f
  ON f.origin_type IN ('class', 'subclass')
  AND f.class_id = c.class_id
  AND (
    f.origin_type = 'class'
    OR (f.origin_type = 'subclass' AND c.subclass_id IS NOT NULL AND f.subclass_id = c.subclass_id)
  )
  AND c.level >= f.min_character_level
LEFT JOIN public.character_features cf
  ON cf.character_id = c.id
  AND cf.feature_id = f.id
WHERE cf.feature_id IS NULL;
