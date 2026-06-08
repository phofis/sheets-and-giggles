import { Constants } from "@/types/supabase";
import type { Database } from "@/types/supabase";

export type ItemFilters = {
    rarity?: Database["public"]["Enums"]["item_rarity"];
    tag?: Database["public"]["Enums"]["item_tag"];
    requires_attunement?: boolean;
};

type ItemFilterShape = {
    name: string;
    description: string;
    rarity: string;
    tag: string;
    requires_attunement: boolean;
};

export function matchesItemFilters(
    item: ItemFilterShape,
    search: string,
    filters: ItemFilters,
): boolean {
    const query = search.trim().toLowerCase();
    if (query) {
        const inName = item.name.toLowerCase().includes(query);
        const inDescription = item.description.toLowerCase().includes(query);
        if (!inName && !inDescription) {
            return false;
        }
    }
    if (filters.rarity && item.rarity !== filters.rarity) {
        return false;
    }
    if (filters.tag && item.tag !== filters.tag) {
        return false;
    }
    if (filters.requires_attunement !== undefined && item.requires_attunement !== filters.requires_attunement) {
        return false;
    }
    return true;
}

const rarityOptions = Constants.public.Enums.item_rarity.map((value) => ({
    value,
    label: value,
}));

const tagOptions = Constants.public.Enums.item_tag.map((value) => ({
    value,
    label: value,
}));

export const itemFilterFormFields = [
    {
        name: "rarity",
        label: "Rarity",
        type: "select" as const,
        optional: true,
        options: [{ value: "", label: "Any rarity" }, ...rarityOptions],
        initialValue: "",
    },
    {
        name: "tag",
        label: "Item type",
        type: "select" as const,
        optional: true,
        options: [{ value: "", label: "Any type" }, ...tagOptions],
        initialValue: "",
    },
    {
        name: "requires_attunement",
        label: "Requires attunement",
        type: "select" as const,
        optional: true,
        options: [
            { value: "", label: "Any" },
            { value: "true", label: "Yes" },
            { value: "false", label: "No" },
        ],
        initialValue: "",
    },
];

export function parseItemFilterValues(
    values: Record<string, string | number>,
): ItemFilters {
    const rarityRaw = String(values.rarity ?? "").trim();
    const tagRaw = String(values.tag ?? "").trim();
    const requires_attunementRaw = String(values.requires_attunement ?? "").trim();

    return {
        rarity: rarityRaw === ""
            ? undefined
            : (rarityRaw as Database["public"]["Enums"]["item_rarity"]),
        tag: tagRaw === ""
            ? undefined
            : (tagRaw as Database["public"]["Enums"]["item_tag"]),
        requires_attunement:
            requires_attunementRaw === ""
                ? undefined
                : requires_attunementRaw === "true",
    };
}
