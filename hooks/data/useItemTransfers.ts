import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/supabase";

export type ItemTransferRow =
    Database["public"]["Tables"]["item_transfers"]["Row"];

export type ItemTransferSnapshot = {
    name: string;
    description: string;
    rarity: Database["public"]["Enums"]["item_rarity"];
    tag: Database["public"]["Enums"]["item_tag"];
    quantity: number;
    requires_attunement: boolean;
};

// ─── Friendly error messages from RPC RAISE EXCEPTION codes ──────────────────

const CLAIM_ERROR_MESSAGES: Record<string, string> = {
    transfer_not_found: "This QR code is invalid.",
    transfer_already_claimed: "This item has already been claimed.",
    transfer_expired: "This QR code has expired.",
    character_not_found: "Character not found.",
    unauthorized: "You are not authorised to claim this item.",
    cannot_transfer_to_same_character: "Cannot transfer an item to yourself.",
};

function friendlyClaimError(raw: string): string {
    const key = Object.keys(CLAIM_ERROR_MESSAGES).find((k) =>
        raw.includes(k),
    );
    return key ? CLAIM_ERROR_MESSAGES[key] : "Failed to claim item. Please try again.";
}

// ─── Create a transfer token ──────────────────────────────────────────────────

export function useCreateItemTransfer(characterId: string) {
    return useMutation<
        ItemTransferRow,
        Error,
        { itemId: string; snapshot: ItemTransferSnapshot }
    >({
        mutationFn: async ({ itemId, snapshot }) => {
            const { data, error } = await supabase
                .from("item_transfers")
                .insert({
                    item_id: itemId,
                    from_character_id: characterId,
                    item_snapshot: snapshot,
                })
                .select()
                .single();
            if (error) throw new Error(error.message);
            return data;
        },
    });
}

// ─── Claim a transfer token ───────────────────────────────────────────────────

export function useClaimItemTransfer(characterId: string) {
    return useMutation<
        { success: boolean; new_item_id: string },
        Error,
        string // transferId
    >({
        mutationFn: async (transferId) => {
            const { data, error } = await supabase.rpc(
                "claim_item_transfer",
                {
                    p_transfer_id: transferId,
                    p_to_character_id: characterId,
                },
            );
            if (error) throw new Error(friendlyClaimError(error.message));
            return data as { success: boolean; new_item_id: string };
        },
    });
}
