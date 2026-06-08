import {
    ThemedHeadline,
    ThemedText,
    ThemedView,
    SpellCard,
} from "@/components/themed";
import { SpellSlots } from "@/components/spells/SpellSlots";
import { SpellToolbar } from "@/components/spells/SpellToolbar";
import {
    matchesSpellFilters,
    parseSpellFilterValues,
    spellFilterFormFields,
    type SpellFilters,
} from "@/components/spells/spellFilters";
import { useStyles } from "@/hooks/useStyles";
import { useCharacterSpells } from "@/hooks/data/useCharacterSpells";
import { useFieldEditorModals } from "@/hooks/editing/useFieldEditorModals";
import { useCharacterId } from "@/context/CharacterIdContext";
import { EditScreenShell } from "@/components/editing/EditScreenShell";
import { ScrollView, View } from "react-native";
import { useMemo, useState } from "react";
import { useRouter } from "expo-router";

export default function SpellsScreen() {
    const router = useRouter();
    const characterId = useCharacterId();
    const [isEditMode, setIsEditMode] = useState(false);
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState<SpellFilters>({});
    const { openForm, modals: filterModals } = useFieldEditorModals();

    const { styles } = useStyles((t) => ({
        container: { flex: 1, padding: t.spacing.lg },
        scrollContent: { paddingBottom: t.spacing.xxl },
        headline: {
            marginBottom: t.spacing.lg,
            textAlign: "center",
        },
        list: { width: "100%" },
        empty: {
            marginTop: t.spacing.xxxl,
            textAlign: "center",
        },
        toolbarSpacing: {
            marginBottom: t.spacing.md,
        },
    }));

    const { data: spells } = useCharacterSpells(characterId);

    const filteredSpells = useMemo(
        () =>
            (spells ?? []).filter((entry) =>
                matchesSpellFilters(entry.spells, search, filters),
            ),
        [spells, search, filters],
    );

    const openFilterModal = () => {
        openForm({
            title: "Filter spells",
            submitLabel: "Apply filters",
            fields: spellFilterFormFields.map((field) => ({
                ...field,
                initialValue:
                    field.name === "level"
                        ? filters.level === undefined
                            ? ""
                            : String(filters.level)
                        : (filters.school ?? ""),
            })),
            onSubmit: (values) => setFilters(parseSpellFilterValues(values)),
        });
    };

    return (
        <EditScreenShell
            isEditMode={isEditMode}
            onToggleEditMode={() => setIsEditMode((v) => !v)}
        >
            <ThemedView
                backgroundColor="surface.background"
                style={styles.container}
            >
                {filterModals}
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <ThemedView style={styles.list}>
                        <SpellSlots />
                        <ThemedHeadline
                            color="text.heading"
                            style={styles.headline}
                        >
                            Your Spells
                        </ThemedHeadline>
                        <View style={styles.toolbarSpacing}>
                            <SpellToolbar
                                search={search}
                                searchPlaceholder="Search your spells..."
                                onAddPressOverride={() =>
                                    router.push("/spell-list" as never)
                                }
                                onFilterPress={openFilterModal}
                                onLearnSpell={() => {}}
                                onSearchChange={setSearch}
                            />
                        </View>
                        {filteredSpells.length === 0 ? (
                            <ThemedText
                                color="text.muted"
                                style={styles.empty}
                                variant="body"
                            >
                                {spells?.length
                                    ? "No spells match your search."
                                    : "No spells yet. Tap + to browse the catalog."}
                            </ThemedText>
                        ) : (
                            filteredSpells.map((spell) => (
                                <SpellCard key={spell.spell_id} spell={spell} />
                            ))
                        )}
                    </ThemedView>
                </ScrollView>
            </ThemedView>
        </EditScreenShell>
    );
}
