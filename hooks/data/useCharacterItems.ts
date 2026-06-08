import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/supabase";
import { useCharacterQuery, useCharacterMutation } from "./factory";

export type ItemRow = Database["public"]["Tables"]["character_items"]["Row"];
type ItemInsert = Database["public"]["Tables"]["character_items"]["Insert"];
type ItemUpdate = Database["public"]["Tables"]["character_items"]["Update"];

export function useCharacterItems(characterId: string | undefined) {
    const queryClient = useQueryClient();

    // Keep the local cache in sync when another device deletes or inserts an
    // item (e.g. after a QR transfer).  One channel per character; Supabase
    // deduplicates channels with the same name automatically.
    useEffect(() => {
        if (!characterId) return;

        const channel = supabase
            .channel(`character-items:${characterId}`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "character_items",
                    filter: `character_id=eq.${characterId}`,
                },
                async (payload) => {
                    console.log("[realtime character_items]", payload.eventType, payload);
                    // Bypass staleTime + persister by writing fresh data
                    // directly into the cache so the UI updates immediately.
                    const { data } = await supabase
                        .from("character_items")
                        .select("*")
                        .eq("character_id", characterId)
                        .order("created_at", { ascending: true });

                    if (data) {
                        queryClient.setQueryData(
                            ["character", characterId, "items"],
                            data,
                        );
                    }
                },
            )
            .subscribe((status, err) => {
                console.log(`[realtime character-items:${characterId}] status:`, status, err ?? "");
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [characterId, queryClient]);

    return useCharacterQuery<ItemRow[]>(characterId, ["items"], async (id) => {
        const { data, error } = await supabase
            .from("character_items")
            .select("*")
            .eq("character_id", id)
            .order("created_at", { ascending: true });
        if (error) throw error;
        return data;
    });
}

export function useCreateCharacterItem(characterId: string) {
    return useCharacterMutation<
        ItemRow[],
        Omit<ItemInsert, "character_id">,
        ItemRow
    >(
        characterId,
        ["items"],
        async (id, input) => {
            const { data, error } = await supabase
                .from("character_items")
                .insert({ character_id: id, ...input })
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        (prev, input) => [
            ...prev,
            {
                id: "optimistic-temp",
                character_id: characterId,
                created_at: "",
                updated_at: "",
                ...input,
            } as ItemRow,
        ],
    );
}

export function useUpdateCharacterItem(characterId: string) {
    return useCharacterMutation<
        ItemRow[],
        { itemId: string; patch: ItemUpdate },
        ItemRow
    >(
        characterId,
        ["items"],
        async (_id, { itemId, patch }) => {
            const { data, error } = await supabase
                .from("character_items")
                .update(patch)
                .eq("id", itemId)
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        (prev, { itemId, patch }) =>
            prev.map((item) =>
                item.id === itemId ? { ...item, ...patch } : item,
            ),
    );
}

export function useDeleteCharacterItem(characterId: string) {
    return useCharacterMutation<ItemRow[], string, void>(
        characterId,
        ["items"],
        async (_id, itemId) => {
            const { error } = await supabase
                .from("character_items")
                .delete()
                .eq("id", itemId);
            if (error) throw error;
        },
        (prev, itemId) => prev.filter((item) => item.id !== itemId),
    );
}
