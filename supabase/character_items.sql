-- `character_items` — inventory items owned by a character.
--
-- The table-level CHECK prevents `attuned = true` when `requires_attunement
-- = false`. The 5e cap of at most 3 attuned items per character is enforced
-- in app code before persisting.

CREATE TABLE public.character_items (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id        UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  name                TEXT NOT NULL,
  description         TEXT NOT NULL,
  requires_attunement BOOLEAN NOT NULL DEFAULT false,
  attuned             BOOLEAN NOT NULL DEFAULT false,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (requires_attunement OR NOT attuned)
);

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.character_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE INDEX character_items_character_id_idx ON public.character_items (character_id);

ALTER TABLE public.character_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY character_items_select_own ON public.character_items
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.characters
      WHERE characters.id = character_id
        AND characters.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY character_items_insert_own ON public.character_items
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.characters
      WHERE characters.id = character_id
        AND characters.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY character_items_update_own ON public.character_items
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

CREATE POLICY character_items_delete_own ON public.character_items
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.characters
      WHERE characters.id = character_id
        AND characters.user_id = (SELECT auth.uid())
    )
  );
