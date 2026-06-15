import { useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ThemedHeadline, ThemedText, ThemedView } from "@/components/themed";
import { CatalogFeatureCard } from "@/components/features/CatalogFeatureCard";
import { FeatureToolbar } from "@/components/features/FeatureToolbar";
import {
    buildFeatureFilterFormFields,
    matchesFeatureFilters,
    parseFeatureFilterValues,
    type FeatureFilters,
} from "@/components/features/featureFilters";
import { useCharacterId } from "@/context/CharacterIdContext";
import {
    useAssignFeature,
    useCharacterFeatures,
    useFeaturesCatalog,
} from "@/hooks/data";
import { useFieldEditorModals } from "@/hooks/editing/useFieldEditorModals";
import { useStyles } from "@/hooks/useStyles";

export default function FeatureListScreen() {
    const router = useRouter();
    const characterId = useCharacterId();
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState<FeatureFilters>({});
    const { openForm, modals } = useFieldEditorModals();

    const { data: catalog = [], isLoading, error } = useFeaturesCatalog();
    const { data: characterFeatures = [] } = useCharacterFeatures(characterId);
    const assignFeature = useAssignFeature(characterId);

    const assignedFeatureIds = useMemo(
        () =>
            new Set(
                characterFeatures
                    .map((entry) => entry.feature_id)
                    .filter((id): id is string => id != null),
            ),
        [characterFeatures],
    );

    const filteredFeatures = useMemo(
        () =>
            catalog.filter((feature) =>
                matchesFeatureFilters(feature, search, filters),
            ),
        [catalog, search, filters],
    );

    const { styles } = useStyles((t) => ({
        screen: {
            flex: 1,
            padding: t.spacing.lg,
        },
        scrollContent: {
            paddingBottom: t.spacing.xxl,
        },
        backButton: {
            marginBottom: t.spacing.md,
            paddingVertical: t.spacing.sm,
        },
        headline: {
            marginBottom: t.spacing.lg,
            textAlign: "center",
        },
        list: {
            width: "100%",
        },
        empty: {
            marginTop: t.spacing.xxxl,
            textAlign: "center",
        },
        loading: {
            marginTop: t.spacing.xxxl,
            alignItems: "center",
            gap: t.spacing.sm,
        },
    }));

    const openFilterModal = () => {
        openForm({
            title: "Filter features",
            submitLabel: "Apply filters",
            fields: buildFeatureFilterFormFields({ filters }),
            onSubmit: (values) => setFilters(parseFeatureFilterValues(values)),
        });
    };

    return (
        <ThemedView backgroundColor="surface.background" style={styles.screen}>
            {modals}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.push("/character-sheet" as never)}
            >
                <ThemedText color="text.muted" style={{ fontWeight: "bold" }}>
                    ← Back to character sheet
                </ThemedText>
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <ThemedView style={styles.list}>
                    <ThemedHeadline
                        color="text.heading"
                        style={styles.headline}
                    >
                        Feature Catalog
                    </ThemedHeadline>

                    <FeatureToolbar
                        hideAdd
                        search={search}
                        searchPlaceholder="Search features..."
                        onAssignFeature={() => {}}
                        onFilterPress={openFilterModal}
                        onSearchChange={setSearch}
                    />

                    {isLoading ? (
                        <ThemedView style={styles.loading}>
                            <ActivityIndicator size="large" />
                            <ThemedText color="text.muted" variant="body">
                                Loading feature catalog...
                            </ThemedText>
                        </ThemedView>
                    ) : error ? (
                        <ThemedView style={styles.empty}>
                            <ThemedText color="semantic.error" variant="body">
                                Failed to load features.
                            </ThemedText>
                        </ThemedView>
                    ) : filteredFeatures.length === 0 ? (
                        <ThemedView style={styles.empty}>
                            <ThemedText color="text.muted" variant="body">
                                No features match your search.
                            </ThemedText>
                        </ThemedView>
                    ) : (
                        filteredFeatures.map((feature) => (
                            <CatalogFeatureCard
                                key={feature.id}
                                feature={feature}
                                isAssigned={assignedFeatureIds.has(feature.id)}
                                onAdd={() =>
                                    assignFeature.mutate({
                                        feature_id: feature.id,
                                        assigned_source: "adventure",
                                    })
                                }
                            />
                        ))
                    )}
                </ThemedView>
            </ScrollView>
        </ThemedView>
    );
}
