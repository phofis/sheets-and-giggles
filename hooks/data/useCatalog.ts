import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/supabase";
import { useQuery } from "@tanstack/react-query";
import { useCatalogQuery } from "./factory";

type RaceRow = Database["public"]["Tables"]["races"]["Row"];
type ClassRow = Database["public"]["Tables"]["classes"]["Row"];
type SubclassRow = Database["public"]["Tables"]["subclasses"]["Row"];
type SpellRow = Database["public"]["Tables"]["spells"]["Row"];
type FeatureRow = Database["public"]["Tables"]["features"]["Row"];

export type ClassWithSubclasses = ClassRow & { subclasses: SubclassRow[] };

export function useRaces() {
    return useCatalogQuery<RaceRow[]>("races", async () => {
        const { data, error } = await supabase
            .from("races")
            .select("*")
            .order("name");
        if (error) throw error;
        return data;
    });
}

export function useClasses() {
    return useCatalogQuery<ClassWithSubclasses[]>("classes", async () => {
        const { data, error } = await supabase
            .from("classes")
            .select("*, subclasses(*)")
            .order("name");
        if (error) throw error;
        return (data ?? []) as ClassWithSubclasses[];
    });
}

export function useSpellsCatalog() {
    return useCatalogQuery<SpellRow[]>("spells", async () => {
        const { data, error } = await supabase
            .from("spells")
            .select("*")
            .order("name");
        if (error) throw error;
        return data;
    });
}

/**
 * Spells available to a specific class via the `class_spells` join table.
 */
export function useClassSpells(classId: string | undefined) {
    return useQuery<SpellRow[]>({
        queryKey: ["catalog", "class_spells", classId ?? ""],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("class_spells")
                .select("spells(*)")
                .eq("class_id", classId as string);
            if (error) throw error;
            return ((data ?? []) as { spells: SpellRow | null }[])
                .map((row) => row.spells)
                .filter((s): s is SpellRow => s !== null)
                .sort((a, b) => a.name.localeCompare(b.name));
        },
        enabled: !!classId,
    });
}

export function useFeaturesCatalog() {
    return useCatalogQuery<FeatureRow[]>("features", async () => {
        const { data, error } = await supabase
            .from("features")
            .select("*")
            .order("name");
        if (error) throw error;
        return data;
    });
}
