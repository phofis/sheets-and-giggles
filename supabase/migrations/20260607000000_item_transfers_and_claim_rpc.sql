-- Migration: item_transfers table + claim_item_transfer RPC
-- Enables QR-code-based atomic item transfers between characters.
-- One transfer token is created per share action (expires 24 h after creation).
-- The claim RPC atomically removes the item from the sender and grants it to
-- the recipient inside a single serialisable transaction.
--
-- Apply via Supabase MCP execute_sql or `supabase db query`.
-- Target: supabase-test (project_ref nsbvjwtvfblanjwwuytw).

-- ─── Table ────────────────────────────────────────────────────────────────────

CREATE TABLE item_transfers (
    id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id                 UUID        NOT NULL,
    from_character_id       UUID        NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    item_snapshot           JSONB       NOT NULL,
    claimed_at              TIMESTAMPTZ,
    claimed_by_character_id UUID        REFERENCES characters(id),
    expires_at              TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '24 hours'),
    created_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE item_transfers ENABLE ROW LEVEL SECURITY;

-- Owning user can insert a transfer for their own character's item.
CREATE POLICY "owner can create transfer" ON item_transfers
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM characters
            WHERE id = from_character_id
              AND user_id = auth.uid()
        )
    );

-- Owning user can read their own (pending or claimed) transfers.
CREATE POLICY "owner can read own transfers" ON item_transfers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM characters
            WHERE id = from_character_id
              AND user_id = auth.uid()
        )
    );

-- ─── RPC ──────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION claim_item_transfer(
    p_transfer_id     UUID,
    p_to_character_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_transfer              item_transfers%ROWTYPE;
    v_to_user_id            UUID;
    v_new_item_id           UUID;
BEGIN
    -- Lock the row to prevent concurrent claims.
    SELECT * INTO v_transfer
    FROM item_transfers
    WHERE id = p_transfer_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'transfer_not_found';
    END IF;

    IF v_transfer.claimed_at IS NOT NULL THEN
        RAISE EXCEPTION 'transfer_already_claimed';
    END IF;

    IF v_transfer.expires_at < now() THEN
        RAISE EXCEPTION 'transfer_expired';
    END IF;

    -- Verify calling user owns the target character.
    SELECT user_id INTO v_to_user_id
    FROM characters
    WHERE id = p_to_character_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'character_not_found';
    END IF;

    IF v_to_user_id IS DISTINCT FROM auth.uid() THEN
        RAISE EXCEPTION 'unauthorized';
    END IF;

    IF p_to_character_id = v_transfer.from_character_id THEN
        RAISE EXCEPTION 'cannot_transfer_to_same_character';
    END IF;

    -- Decrement or delete the original item.
    IF (v_transfer.item_snapshot->>'quantity')::int > 1 THEN
        UPDATE character_items
        SET quantity = quantity - 1
        WHERE id = v_transfer.item_id
          AND character_id = v_transfer.from_character_id;
    ELSE
        DELETE FROM character_items
        WHERE id = v_transfer.item_id
          AND character_id = v_transfer.from_character_id;
    END IF;

    -- Insert item for the recipient (always quantity 1 per transfer).
    INSERT INTO character_items (
        character_id,
        name,
        description,
        rarity,
        tag,
        quantity,
        requires_attunement,
        attuned
    ) VALUES (
        p_to_character_id,
        v_transfer.item_snapshot->>'name',
        v_transfer.item_snapshot->>'description',
        (v_transfer.item_snapshot->>'rarity')::item_rarity,
        (v_transfer.item_snapshot->>'tag')::item_tag,
        1,
        (v_transfer.item_snapshot->>'requires_attunement')::boolean,
        false
    )
    RETURNING id INTO v_new_item_id;

    -- Mark the transfer as claimed.
    UPDATE item_transfers
    SET claimed_at              = now(),
        claimed_by_character_id = p_to_character_id
    WHERE id = p_transfer_id;

    RETURN jsonb_build_object('success', true, 'new_item_id', v_new_item_id);
END;
$$;
