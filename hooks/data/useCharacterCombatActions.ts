import { supabase } from "@/lib/supabase";
import { useCharacterMutation, useCharacterQuery } from "./factory";

export type CombatActionSourceType = "feature" | "item" | "spell";

export type CharacterCombatActionRow = {
    character_id: string;
    source_type: CombatActionSourceType;
    source_id: string;
    created_at: string;
};

type PinInput = {
    source_type: CombatActionSourceType;
    source_id: string;
};

export function useCharacterCombatActions(characterId: string | undefined) {
    return useCharacterQuery<CharacterCombatActionRow[]>(
        characterId,
        ["combatActions"],
        async (id) => {
            const { data, error } = await supabase
                .from("character_combat_actions")
                .select("*")
                .eq("character_id", id)
                .order("created_at", { ascending: true });
            if (error) throw error;
            return (data ?? []) as CharacterCombatActionRow[];
        },
    );
}

export function useAddCombatAction(characterId: string) {
    return useCharacterMutation<
        CharacterCombatActionRow[],
        PinInput,
        CharacterCombatActionRow
    >(
        characterId,
        ["combatActions"],
        async (id, input) => {
            const { data, error } = await supabase
                .from("character_combat_actions")
                .insert({ character_id: id, ...input })
                .select()
                .single();
            if (error) throw error;
            return data as CharacterCombatActionRow;
        },
        (prev, input) => [
            ...prev,
            {
                character_id: characterId,
                created_at: new Date().toISOString(),
                ...input,
            },
        ],
    );
}

export function useRemoveCombatAction(characterId: string) {
    return useCharacterMutation<CharacterCombatActionRow[], PinInput, void>(
        characterId,
        ["combatActions"],
        async (id, input) => {
            const { error } = await supabase
                .from("character_combat_actions")
                .delete()
                .eq("character_id", id)
                .eq("source_type", input.source_type)
                .eq("source_id", input.source_id);
            if (error) throw error;
        },
        (prev, input) =>
            prev.filter(
                (row) =>
                    !(
                        row.source_type === input.source_type &&
                        row.source_id === input.source_id
                    ),
            ),
    );
}
