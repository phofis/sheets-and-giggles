-- `character_spells` — many-to-many table for spells learned by a character.
--
-- `prepared` reflects whether the spell is currently prepared for casting;
-- `always_prepared` is `true` for spells that bypass the prepared count
-- (domain spells, oath spells, racial spells, etc.).

CREATE TABLE public.character_spells (
  character_id    UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  spell_id        UUID NOT NULL REFERENCES public.spells(id) ON DELETE CASCADE,
  prepared        BOOLEAN NOT NULL DEFAULT false,
  always_prepared BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (character_id, spell_id)
);

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.character_spells
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE INDEX character_spells_spell_id_idx ON public.character_spells (spell_id);

ALTER TABLE public.character_spells ENABLE ROW LEVEL SECURITY;

CREATE POLICY character_spells_select_own ON public.character_spells
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.characters
      WHERE characters.id = character_id
        AND characters.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY character_spells_insert_own ON public.character_spells
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.characters
      WHERE characters.id = character_id
        AND characters.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY character_spells_update_own ON public.character_spells
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

CREATE POLICY character_spells_delete_own ON public.character_spells
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.characters
      WHERE characters.id = character_id
        AND characters.user_id = (SELECT auth.uid())
    )
  );
