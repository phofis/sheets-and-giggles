import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/auth";

export type Adventurer = {
    id: string;
    name: string;
    class: string;
    subclass: string | null;
    race: string;
    hp: number;
    maxHp: number;
    armorClass: number;
    photoUri: string | null;
    level: number;
};

export function useAdventurers() {
    const { user } = useAuth();

    return useQuery<Adventurer[]>({
        queryKey: ["adventurers", user?.id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("characters")
                .select("*, classes(name), races(name), subclasses(name)")
                .eq("user_id", user!.id);

            if (error) throw error;

            return data.map((row) => ({
                id: row.id,
                name: row.name,
                class: row.classes?.name ?? "Unknown",
                subclass: row.subclasses?.name ?? null,
                race: row.races?.name ?? "Unknown",
                hp: row.hp_current,
                maxHp: row.hp_max,
                armorClass: row.armor_class,
                photoUri: row.photo_uri,
                level: row.level,
            }));
        },
        enabled: !!user?.id,
    });
}