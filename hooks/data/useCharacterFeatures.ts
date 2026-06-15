import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/supabase";
import { useCharacterQuery, useCharacterMutation } from "./factory";

export type FeatureRow = Database["public"]["Views"]["v_character_features"]["Row"];
export type FeatureCatalogRow = Database["public"]["Tables"]["features"]["Row"];
export type OriginType = Database["public"]["Enums"]["feature_origin_type"];
type FeatureInsert =
    Database["public"]["Tables"]["character_features"]["Insert"];

export function useCharacterFeatures(characterId: string | undefined) {
    return useCharacterQuery<FeatureRow[]>(
        characterId,
        ["features"],
        async (id) => {
            const { data, error } = await supabase
                .from("v_character_features")
                .select("*")
                .eq("character_id", id);
            if (error) throw error;
            return data;
        },
    );
}

export function useAssignFeature(characterId: string) {
    return useCharacterMutation<
        FeatureRow[],
        Omit<FeatureInsert, "character_id">
    >(
        characterId,
        ["features"],
        async (id, input) => {
            const { error } = await supabase
                .from("character_features")
                .insert({ character_id: id, ...input })
                .select("*");
            if (error) throw error;
            // Refetch the view for the full resolved row
            const { data: features, error: fetchError } = await supabase
                .from("v_character_features")
                .select("*")
                .eq("character_id", id);
            if (fetchError) throw fetchError;
            return features;
        },
        (prev, _input) => prev, // let invalidation refresh from view
    );
}

export function useUnassignFeature(characterId: string) {
    return useCharacterMutation<FeatureRow[], string>(
        characterId,
        ["features"],
        async (id, featureId) => {
            const { error } = await supabase
                .from("character_features")
                .delete()
                .eq("character_id", id)
                .eq("feature_id", featureId);
            if (error) throw error;
            const { data, error: fetchError } = await supabase
                .from("v_character_features")
                .select("*")
                .eq("character_id", id);
            if (fetchError) throw fetchError;
            return data;
        },
        (prev, featureId) => prev.filter((f) => f.feature_id !== featureId),
    );
}

/**
 * Class- and subclass-grade features unlocked at a specific character level,
 * excluding any already assigned to the character. Subclass features are only
 * included when the character (or the prospective subclass for this level-up)
 * is known.
 */
export function useLevelUpAvailableFeatures(
    characterId: string | undefined,
    classId: string | null | undefined,
    subclassId: string | null | undefined,
    targetLevel: number | undefined,
) {
    return useCharacterQuery<FeatureCatalogRow[]>(
        characterId,
        [
            "levelup_features",
            classId ?? "",
            subclassId ?? "",
            String(targetLevel ?? ""),
        ],
        async (id) => {
            if (!classId || !targetLevel) return [];

            const classQuery = supabase
                .from("features")
                .select("*")
                .eq("origin_type", "class")
                .eq("class_id", classId)
                .eq("min_character_level", targetLevel);

            const subclassQuery = subclassId
                ? supabase
                      .from("features")
                      .select("*")
                      .eq("origin_type", "subclass")
                      .eq("class_id", classId)
                      .eq("subclass_id", subclassId)
                      .eq("min_character_level", targetLevel)
                : null;

            const [classRes, subclassRes, assignedRes] = await Promise.all([
                classQuery,
                subclassQuery ?? Promise.resolve({ data: [], error: null }),
                supabase
                    .from("character_features")
                    .select("feature_id")
                    .eq("character_id", id),
            ]);

            if (classRes.error) throw classRes.error;
            if (subclassRes.error) throw subclassRes.error;
            if (assignedRes.error) throw assignedRes.error;

            const assignedIds = new Set(
                (assignedRes.data ?? []).map((a) => a.feature_id),
            );

            return [
                ...((classRes.data ?? []) as FeatureCatalogRow[]),
                ...((subclassRes.data ?? []) as FeatureCatalogRow[]),
            ].filter((f) => !assignedIds.has(f.id));
        },
    );
}
