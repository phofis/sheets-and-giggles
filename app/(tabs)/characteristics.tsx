import { ThemedView, ThemedBoxList } from "@/components/themed";
import { ScrollView, ActivityIndicator } from "react-native";
import { useState } from "react";
import { Header } from "@/components/Header";
import { BiometricsGrid } from "@/components/characteristics/BiometricsGrid";
import { Note } from "@/components/Note";
import { EditScreenShell } from "@/components/editing/EditScreenShell";
import { useStyles } from "@/hooks/useStyles";
import { useCharacteristics, Characteristics } from "@/hooks/useCharacteristics";
import { useCharacterId } from "@/context/CharacterIdContext";
import { useCharacterEditor } from "@/hooks/editing/useCharacterEditor";
import { useFieldEditorModals } from "@/hooks/editing/useFieldEditorModals";
import {
    biometricPatch,
    traitArrayPatch,
    type TraitArrayField,
} from "@/hooks/editing/characterFieldPatches";
import type { BoxListItem } from "@/components/themed/ThemedBoxList";

const defaultCharacteristics: Characteristics = {
    characterHeader: {
        name: "",
        level: 1,
        class: "",
        inspiration: 1,
    },
    biometrics: [],
    background: "",
    traits: [],
    ideals: [],
    bonds: [],
    flaws: [],
    personalityTraits: [],
    idealsRaw: [],
    bondsRaw: [],
    flawsRaw: [],
};

export default function CharacteristicsScreen() {
    const { styles } = useStyles((theme, c) => ({
        shell: { flex: 1, marginBottom: theme.spacing.xl },
        screen: { flex: 1 },
        scrollView: { flex: 1, alignSelf: "stretch" },
        scrollContentContainer: {
            flexGrow: 1,
            paddingTop: theme.spacing.xxxl,
        },
        content: {
            alignSelf: "stretch",
            paddingHorizontal: theme.spacing.lg,
            paddingTop: theme.spacing.xl,
            gap: theme.spacing.lg,
        },
        features: {
            borderRadius: theme.borderRadius.md,
            borderLeftWidth: 2,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.1,
            shadowRadius: 15,
            elevation: 4,
        },
    }));

    const characterId = useCharacterId();
    const [isEditMode, setIsEditMode] = useState(false);
    const { data: characteristics = defaultCharacteristics, isLoading } =
        useCharacteristics(characterId as string);
    const { updateCharacter } = useCharacterEditor(characterId);
    const { openText, openNumeric, modals } = useFieldEditorModals();

    const openTraitEditor = (
        field: TraitArrayField,
        items: string[],
        index: number,
        item: BoxListItem,
    ) => {
        openText({
            label: "Edit entry",
            initialValue: item.description,
            placeholder: "Enter text",
            onSubmit: (value) =>
                updateCharacter.mutate(traitArrayPatch(field, items, index, value)),
        });
    };

    return (
        <EditScreenShell
            isEditMode={isEditMode}
            style={styles.shell}
            onToggleEditMode={() => setIsEditMode((v) => !v)}
        >
            <ThemedView backgroundColor="surface.background" style={styles.screen}>
                {modals}
                <ScrollView
                    contentContainerStyle={styles.scrollContentContainer}
                    style={styles.scrollView}
                >
                    {isLoading ? (
                        <ActivityIndicator />
                    ) : (
                        <ThemedView style={styles.content}>
                            <Header
                                characterHeader={characteristics.characterHeader}
                                isEditMode={isEditMode}
                                onEditInspiration={() =>
                                    openNumeric({
                                        label: "Inspiration",
                                        initialValue: characteristics.characterHeader.inspiration,
                                        min: 0,
                                        max: 99,
                                        onSubmit: (value) =>
                                            updateCharacter.mutate({ inspiration: value }),
                                    })
                                }
                                onEditLevel={() =>
                                    openNumeric({
                                        label: "Level",
                                        initialValue: characteristics.characterHeader.level,
                                        min: 1,
                                        max: 20,
                                        onSubmit: (value) =>
                                            updateCharacter.mutate({ level: value }),
                                    })
                                }
                                onEditName={() =>
                                    openText({
                                        label: "Character name",
                                        initialValue: characteristics.characterHeader.name,
                                        onSubmit: (value) =>
                                            updateCharacter.mutate({ name: value }),
                                    })
                                }
                            />

                            <BiometricsGrid
                                biometricEntries={characteristics.biometrics}
                                isEditMode={isEditMode}
                                onEditEntry={(entry) =>
                                    openText({
                                        label: entry.label,
                                        initialValue: entry.value,
                                        onSubmit: (value) => {
                                            try {
                                                updateCharacter.mutate(
                                                    biometricPatch(entry.label, value),
                                                );
                                            } catch {
                                                // invalid biometric label
                                            }
                                        },
                                    })
                                }
                            />

                            <Note
                                backgroundColor="surface.note"
                                isEditMode={isEditMode}
                                textColor="text.note"
                                title="Background"
                                titleColor="text.lively"
                                onEditContent={() =>
                                    openText({
                                        label: "Background",
                                        initialValue: characteristics.background,
                                        onSubmit: (value) =>
                                            updateCharacter.mutate({ background: value }),
                                    })
                                }
                            >
                                {characteristics.background}
                            </Note>

                            <ThemedBoxList
                                data={characteristics.traits}
                                glowColor="palette.secondary"
                                isEditMode={isEditMode}
                                itemStyle={styles.features}
                                title="Personality Traits"
                                onItemPress={(item, index) =>
                                    openTraitEditor(
                                        "personality_traits",
                                        characteristics.personalityTraits,
                                        index,
                                        item,
                                    )
                                }
                            />

                            <ThemedBoxList
                                data={characteristics.bonds}
                                glowColor="palette.tertiary"
                                isEditMode={isEditMode}
                                itemStyle={styles.features}
                                title="Bonds"
                                onItemPress={(item, index) =>
                                    openTraitEditor(
                                        "bonds",
                                        characteristics.bondsRaw,
                                        index,
                                        item,
                                    )
                                }
                            />

                            <ThemedBoxList
                                data={characteristics.ideals}
                                glowColor="palette.tertiary"
                                isEditMode={isEditMode}
                                itemStyle={styles.features}
                                title="Ideals"
                                onItemPress={(item, index) =>
                                    openTraitEditor(
                                        "ideals",
                                        characteristics.idealsRaw,
                                        index,
                                        item,
                                    )
                                }
                            />

                            <ThemedBoxList
                                data={characteristics.flaws}
                                glowColor="semantic.error"
                                isEditMode={isEditMode}
                                itemStyle={styles.features}
                                title="Flaws"
                                onItemPress={(item, index) =>
                                    openTraitEditor(
                                        "flaws",
                                        characteristics.flawsRaw,
                                        index,
                                        item,
                                    )
                                }
                            />
                        </ThemedView>
                    )}
                </ScrollView>
            </ThemedView>
        </EditScreenShell>
    );
}
