import { Constants } from "@/types/supabase";
import type { Database } from "@/types/supabase";

export type FeatureFilters = {
    originType?: Database["public"]["Enums"]["feature_origin_type"];
    minLevel?: number;
};

type FeatureFilterShape = {
    feature_name?: string | null;
    feature_description?: string | null;
    origin_type?: Database["public"]["Enums"]["feature_origin_type"] | null;
    min_character_level?: number | null;
    name?: string;
    description?: string;
};

function featureName(feature: FeatureFilterShape): string {
    return (feature.feature_name ?? feature.name ?? "").toLowerCase();
}

function featureDescription(feature: FeatureFilterShape): string {
    return (feature.feature_description ?? feature.description ?? "").toLowerCase();
}

function featureOriginType(
    feature: FeatureFilterShape,
): Database["public"]["Enums"]["feature_origin_type"] | null | undefined {
    return feature.origin_type;
}

function featureMinLevel(feature: FeatureFilterShape): number | null | undefined {
    return feature.min_character_level;
}

export function matchesFeatureFilters(
    feature: FeatureFilterShape,
    search: string,
    filters: FeatureFilters,
): boolean {
    const query = search.trim().toLowerCase();
    if (query) {
        const name = featureName(feature);
        const description = featureDescription(feature);
        if (!name.includes(query) && !description.includes(query)) {
            return false;
        }
    }
    if (
        filters.originType !== undefined &&
        featureOriginType(feature) !== filters.originType
    ) {
        return false;
    }
    if (
        filters.minLevel !== undefined &&
        featureMinLevel(feature) !== filters.minLevel
    ) {
        return false;
    }
    return true;
}

const originTypeOptions = Constants.public.Enums.feature_origin_type.map(
    (value) => ({
        value,
        label: value.charAt(0).toUpperCase() + value.slice(1).replace("_", " "),
    }),
);

const minLevelOptions = Array.from({ length: 20 }, (_, i) => {
    const level = i + 1;
    return { value: String(level), label: `Level ${level}` };
});

export const featureFilterFormFields = [
    {
        name: "originType",
        label: "Origin type",
        type: "select" as const,
        optional: true,
        options: [{ value: "", label: "Any origin" }, ...originTypeOptions],
        initialValue: "",
    },
    {
        name: "minLevel",
        label: "Min character level",
        type: "select" as const,
        optional: true,
        options: [{ value: "", label: "Any level" }, ...minLevelOptions],
        initialValue: "",
    },
];

export function buildFeatureFilterFormFields(params: {
    filters: FeatureFilters;
}) {
    const { filters } = params;
    return featureFilterFormFields.map((field) => ({
        ...field,
        initialValue:
            field.name === "originType"
                ? (filters.originType ?? "")
                : filters.minLevel === undefined
                  ? ""
                  : String(filters.minLevel),
    }));
}

export function parseFeatureFilterValues(
    values: Record<string, string | number>,
): FeatureFilters {
    const originRaw = String(values.originType ?? "").trim();
    const minLevelRaw = String(values.minLevel ?? "").trim();

    return {
        originType:
            originRaw === ""
                ? undefined
                : (originRaw as Database["public"]["Enums"]["feature_origin_type"]),
        minLevel: minLevelRaw === "" ? undefined : parseInt(minLevelRaw, 10),
    };
}
