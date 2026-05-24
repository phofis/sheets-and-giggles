import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { CharacterDraftState } from "@/app/character-creation";
import { mapDraftToDTO } from "@/types/character";

interface CreateCharacterParams {
    draft: CharacterDraftState;
    userId: string;
}

/**
 * Executes a sequential insertion pipeline to persist a character draft.
 * Time Complexity (Network): O(1) for master record + O(1) bulk insert per junction table.
 */
export function useCreateCharacter() {
    const queryClient = useQueryClient();

    // return useMutation({
    //     mutationFn: async ({ draft, userId }: CreateCharacterParams) => {
    //         // ─── Phase 1: Master Record Insertion ────────────────────────────
    //         const characterPayload = mapDraftToDTO(draft, userId);

    //         const { data: characterData, error: characterError } = await supabase
    //             .from("characters")
    //             .insert(characterPayload)
    //             .select("id") // Strictly return the generated UUID
    //             .single();

    //         if (characterError) {
    //             throw new Error(`Master entity insertion failed: ${characterError.message}`);
    //         }

    //         const newCharacterId = characterData.id;

    //         // ─── Phase 2: Relational Spell Matrix ────────────────────────────
    //         if (draft.spells && draft.spells.length > 0) {
    //             const spellInsertPayload = draft.spells.map((spellId) => ({
    //                 character_id: newCharacterId,
    //                 spell_id: spellId,
    //                 prepared: true,
    //                 always_prepared: false
    //             }));

    //             const { error: spellsError } = await supabase
    //                 .from("character_spells")
    //                 .insert(spellInsertPayload);

    //             if (spellsError) {
    //                 console.error("Spell mapping failed. The character exists, but magic is unbound:", spellsError);
    //             }
    //         }

    //         // ─── Phase 3: Relational Equipment Matrix ────────────────────────
    //         if (draft.equipment && draft.equipment.length > 0) {
    //             const itemInsertPayload = draft.equipment.map((item) => ({
    //                 character_id: newCharacterId,
    //                 name: item.name,
    //                 description: item.description,
    //                 requires_attunement: false, // Default structural assumption
    //                 attuned: false
    //             }));

    //             const { error: itemsError } = await supabase
    //                 .from("character_items")
    //                 .insert(itemInsertPayload);

    //             if (itemsError) {
    //                 console.error("Equipment mapping failed:", itemsError);
    //             }
    //         }

    //         return newCharacterId;
    //     },
    //     onSuccess: () => {
    //         // Invalidate the cache to guarantee UI parity with the database state
    //         queryClient.invalidateQueries({ queryKey: ["characters"] });
    //     },
    // });
}