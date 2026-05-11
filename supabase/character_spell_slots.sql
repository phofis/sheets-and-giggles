-- `character_spell_slots` — per-character spell slot pool, one row per slot
-- level (1-9). Cantrips (level 0) aren't represented because they don't
-- consume slots. `current <= max` is enforced at the row level.

CREATE TABLE public.character_spell_slots (
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  level        SMALLINT NOT NULL CHECK (level BETWEEN 1 AND 9),
  current      SMALLINT NOT NULL CHECK (current >= 0),
  max          SMALLINT NOT NULL CHECK (max >= 0),
  PRIMARY KEY (character_id, level),
  CHECK (current <= max)
);

ALTER TABLE public.character_spell_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY character_spell_slots_select_own ON public.character_spell_slots
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.characters
      WHERE characters.id = character_id
        AND characters.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY character_spell_slots_insert_own ON public.character_spell_slots
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.characters
      WHERE characters.id = character_id
        AND characters.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY character_spell_slots_update_own ON public.character_spell_slots
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.characters
      WHERE characters.id = character_id
        AND characters.user_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.characters
      WHERE characters.id = character_id
        AND characters.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY character_spell_slots_delete_own ON public.character_spell_slots
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.characters
      WHERE characters.id = character_id
        AND characters.user_id = (SELECT auth.uid())
    )
  );
