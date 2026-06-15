import { useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ThemedHeadline, ThemedText, ThemedView } from "@/components/themed";
import { CatalogSpellCard } from "@/components/spells/CatalogSpellCard";
import { SpellToolbar } from "@/components/spells/SpellToolbar";
import {
    buildSpellFilterFormFields,
    matchesSpellFilters,
    parseSpellFilterValues,
    type SpellFilters,
} from "@/components/spells/spellFilters";
import { useCharacterId } from "@/context/CharacterIdContext";
import {
    useCharacterSpells,
    useClasses,
    useClassSpells,
    useLearnSpell,
    useSpellsCatalog,
} from "@/hooks/data";
import { useFieldEditorModals } from "@/hooks/editing/useFieldEditorModals";
import { useStyles } from "@/hooks/useStyles";

export default function SpellListScreen() {
    const router = useRouter();
    const characterId = useCharacterId();
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState<SpellFilters>({});
    const { openForm, modals } = useFieldEditorModals();

    const { data: catalog = [], isLoading, error } = useSpellsCatalog();
    const { data: characterSpells = [] } = useCharacterSpells(characterId);
    const { data: classes } = useClasses();
    const { data: classSpellsForFilter } = useClassSpells(filters.classId);
    const learnSpell = useLearnSpell(characterId);

    const learnedSpellIds = useMemo(
        () => new Set(characterSpells.map((entry) => entry.spell_id)),
        [characterSpells],
    );

    const classOptions = useMemo(
        () => (classes ?? []).map((c) => ({ id: c.id, name: c.name })),
        [classes],
    );

    const classSpellIds = useMemo(
        () =>
            filters.classId && classSpellsForFilter
                ? new Set(classSpellsForFilter.map((s) => s.id))
                : null,
        [filters.classId, classSpellsForFilter],
    );

    const filteredSpells = useMemo(
        () =>
            catalog.filter((spell) =>
                matchesSpellFilters(spell, search, filters, classSpellIds),
            ),
        [catalog, search, filters, classSpellIds],
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
            title: "Filter spells",
            submitLabel: "Apply filters",
            fields: buildSpellFilterFormFields({ filters, classOptions }),
            onSubmit: (values) => setFilters(parseSpellFilterValues(values)),
        });
    };

    return (
        <ThemedView backgroundColor="surface.background" style={styles.screen}>
            {modals}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
            >
                <ThemedText color="text.muted" style={{ fontWeight: "bold" }}>
                    ← Back to your spells
                </ThemedText>
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <ThemedView style={styles.list}>
                    <ThemedHeadline
                        color="text.heading"
                        style={styles.headline}
                    >
                        Spell Catalog
                    </ThemedHeadline>

                    <SpellToolbar
                        hideAdd
                        search={search}
                        searchPlaceholder="Search spells..."
                        onFilterPress={openFilterModal}
                        onLearnSpell={() => {}}
                        onSearchChange={setSearch}
                    />

                    {isLoading ? (
                        <ThemedView style={styles.loading}>
                            <ActivityIndicator size="large" />
                            <ThemedText color="text.muted" variant="body">
                                Loading spell catalog...
                            </ThemedText>
                        </ThemedView>
                    ) : error ? (
                        <ThemedView style={styles.empty}>
                            <ThemedText color="semantic.error" variant="body">
                                Failed to load spells.
                            </ThemedText>
                        </ThemedView>
                    ) : filteredSpells.length === 0 ? (
                        <ThemedView style={styles.empty}>
                            <ThemedText color="text.muted" variant="body">
                                No spells match your search.
                            </ThemedText>
                        </ThemedView>
                    ) : (
                        filteredSpells.map((spell) => (
                            <CatalogSpellCard
                                key={spell.id}
                                characterId={characterId}
                                isLearned={learnedSpellIds.has(spell.id)}
                                spell={spell}
                                onAdd={() =>
                                    learnSpell.mutate({ spell_id: spell.id })
                                }
                            />
                        ))
                    )}
                </ThemedView>
            </ScrollView>
        </ThemedView>
    );
}
