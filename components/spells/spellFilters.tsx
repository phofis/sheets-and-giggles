import { Constants } from "@/types/supabase";
import type { Database } from "@/types/supabase";

export type SpellFilters = {
    level?: number;
    school?: Database["public"]["Enums"]["school_of_magic"];
};

type SpellFilterShape = {
    name: string;
    level: number;
    school_of_magic: string;
};

export function matchesSpellFilters(
    spell: SpellFilterShape,
    search: string,
    filters: SpellFilters,
): boolean {
    const query = search.trim().toLowerCase();
    if (query && !spell.name.toLowerCase().includes(query)) {
        return false;
    }
    if (filters.level !== undefined && spell.level !== filters.level) {
        return false;
    }
    if (filters.school && spell.school_of_magic !== filters.school) {
        return false;
    }
    return true;
}

const levelOptions = Array.from({ length: 10 }, (_, level) => ({
    value: String(level),
    label: level === 0 ? "Cantrip" : `Level ${level}`,
}));

const schoolOptions = Constants.public.Enums.school_of_magic.map((value) => ({
    value,
    label: value,
}));

export const spellFilterFormFields = [
    {
        name: "level",
        label: "Spell level",
        type: "select" as const,
        optional: true,
        options: [{ value: "", label: "Any level" }, ...levelOptions],
        initialValue: "",
    },
    {
        name: "school",
        label: "School of magic",
        type: "select" as const,
        optional: true,
        options: [{ value: "", label: "Any school" }, ...schoolOptions],
        initialValue: "",
    },
];

export function parseSpellFilterValues(values: Record<string, string | number>): SpellFilters {
    const levelRaw = String(values.level ?? "").trim();
    const schoolRaw = String(values.school ?? "").trim();

    return {
        level: levelRaw === "" ? undefined : parseInt(levelRaw, 10),
        school: schoolRaw === ""
            ? undefined
            : (schoolRaw as Database["public"]["Enums"]["school_of_magic"]),
    };
}
