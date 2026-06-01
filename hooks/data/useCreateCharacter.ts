// hooks/data/useCreateCharacter.ts
import type { CharacterDraftState } from "@/app/character-creation";
import { mapDraftToDTO, type CharacterInsertPayload } from "@/types/character";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface CreateCharacterParams {
    draft: CharacterDraftState;
    userId: string;
}

/**
 * Executes a single-phase insertion pipeline to persist the primary character entity.
 * Auxiliary relational nodes (Spells, Equipment) are structurally deferred.
 * * Network Time Complexity: O(1) bounded to a single REST payload.
 */
export function useCreateCharacter() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ draft, userId }: CreateCharacterParams): Promise<string> => {
            // ─── Phase 1: State Transformation ───────────────────────────────
            // Apply the mapping matrix to resolve frontend variables to the PostgreSQL schema
            const characterPayload: CharacterInsertPayload = mapDraftToDTO(draft, userId);

            // ─── Phase 2: Master Record Insertion ────────────────────────────
            const { data, error } = await supabase
                .from("characters")
                .insert(characterPayload)
                .select("id") // Strictly resolve the generated UUID for subsequent use
                .single();

            if (error) {
                throw new Error(`Master entity transaction failed: ${error.message} (Code: ${error.code})`);
            }

            if (!data?.id) {
                throw new Error("Transaction resolved, but UUID derivation yielded a null pointer.");
            }

            return data.id;
        },
        onSuccess: () => {
            // Guarantee structural parity by invalidating the local deterministic cache
            queryClient.invalidateQueries({ queryKey: ["characters"] });
        },
    });
}