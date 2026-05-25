import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/supabase";
import { useCharacterQuery, useCharacterMutation } from "./factory";

type SpellSlotRow =
    Database["public"]["Tables"]["character_spell_slots"]["Row"];

export function useCharacterSpellSlots(characterId: string | undefined) {
    return useCharacterQuery<SpellSlotRow[]>(
        characterId,
        ["spellSlots"],
        async (id) => {
            const { data, error } = await supabase
                .from("character_spell_slots")
                .select("*")
                .eq("character_id", id)
                .order("level");
            if (error) throw error;
            return data;
        },
    );
}

export function useUpsertSpellSlot(characterId: string) {
    return useCharacterMutation<
        SpellSlotRow[],
        { level: number; current: number; max: number },
        SpellSlotRow
    >(
        characterId,
        ["spellSlots"],
        async (id, input) => {
            const { data, error } = await supabase
                .from("character_spell_slots")
                .upsert({ character_id: id, ...input })
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        (prev, input) => {
            const exists = prev.find((s) => s.level === input.level);
            if (exists)
                return prev.map((s) =>
                    s.level === input.level ? { ...s, ...input } : s,
                );
            return [
                ...prev,
                { character_id: characterId, ...input } as SpellSlotRow,
            ].sort((a, b) => a.level - b.level);
        },
    );
}

export function useSpendSpellSlots(characterId: string) {
    return useCharacterMutation<
        SpellSlotRow[],
        { level: number; amount: number },
        SpellSlotRow
    >(
        characterId,
        ["spellSlots"],
        async (id, { level, amount }) => {
            // Fetch current, decrement, update
            const { data: current, error: fetchErr } = await supabase
                .from("character_spell_slots")
                .select("*")
                .eq("character_id", id)
                .eq("level", level)
                .single();

            if (fetchErr) throw fetchErr;
            if (current.current < amount)
                throw new Error("No spell slots remaining");
            if (current.current - amount > current.max)
                throw new Error("Cannot exceed maximum spell slots");
            const { data, error } = await supabase
                .from("character_spell_slots")
                .update({ current: current.current - amount })
                .eq("character_id", id)
                .eq("level", level)
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        (prev, { level, amount }) =>
            prev.map((s) =>
                s.level === level
                    ? {
                          ...s,
                          current: Math.min(
                              s.max,
                              Math.max(0, s.current - amount),
                          ),
                      }
                    : s,
            ),
    );
}

export function useResetSpellSlots(characterId: string) {
    return useCharacterMutation<SpellSlotRow[], void, SpellSlotRow[]>(
        characterId,
        ["spellSlots"],
        async (id) => {
            // Reset all slots to max
            const { data: slots, error: fetchErr } = await supabase
                .from("character_spell_slots")
                .select("*")
                .eq("character_id", id);
            if (fetchErr) throw fetchErr;
            const updates = slots.map((s) =>
                supabase
                    .from("character_spell_slots")
                    .update({ current: s.max })
                    .eq("character_id", id)
                    .eq("level", s.level),
            );
            await Promise.all(updates);
            const { data, error } = await supabase
                .from("character_spell_slots")
                .select("*")
                .eq("character_id", id)
                .order("level");
            if (error) throw error;
            return data;
        },
        (prev) => prev.map((s) => ({ ...s, current: s.max })),
    );
}
