-- Migration: character_combat_actions table
-- Lets a character pin specific features, items, or learned spells as quick-access
-- combat actions on the Combat screen. The (character_id, source_type, source_id)
-- composite primary key prevents duplicate pins.
--
-- source_id is intentionally NOT a foreign key because it points at three
-- different parent tables depending on source_type ('feature' → features.id,
-- 'item' → character_items.id, 'spell' → spells.id). Stale rows are pruned
-- lazily on read by joining client-side against the live source list.
--
-- Apply via Supabase MCP execute_sql or `supabase db query`.

CREATE TABLE character_combat_actions (
    character_id UUID        NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    source_type  TEXT        NOT NULL CHECK (source_type IN ('feature', 'item', 'spell')),
    source_id    UUID        NOT NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (character_id, source_type, source_id)
);

CREATE INDEX character_combat_actions_character_id_idx
    ON character_combat_actions (character_id);

ALTER TABLE character_combat_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner can read combat actions" ON character_combat_actions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM characters
            WHERE id = character_id
              AND user_id = auth.uid()
        )
    );

CREATE POLICY "owner can insert combat actions" ON character_combat_actions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM characters
            WHERE id = character_id
              AND user_id = auth.uid()
        )
    );

CREATE POLICY "owner can delete combat actions" ON character_combat_actions
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM characters
            WHERE id = character_id
              AND user_id = auth.uid()
        )
    );
