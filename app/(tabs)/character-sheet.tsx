import { ActivityIndicator, ScrollView, View } from "react-native";
import { useState } from "react";

import { ThemedView, ThemedList, ThemedHeadline } from "@/components/themed";
import { ThemedFeatureContainer } from "@/components/themed/ThemedFeatureContainer";
import { ThemedTwoColumnList } from "@/components/themed/ThemedTwoColumnList";
import { AbilityGrid } from "@/components/characterSheet/AbilityGrid";
import { Header } from "@/components/Header";
import { SavingThrowsIcon } from "@/components/icons";
import { EditScreenShell } from "@/components/editing/EditScreenShell";

import { useStyles } from "@/hooks/useStyles";
import { useCharacterSheet, CharacterSheet } from "@/hooks/useCharacterSheet";
import { useCharacterId } from "@/context/CharacterIdContext";
import { useCharacterFeatures } from "@/hooks/data/useCharacterFeatures";
import { useCharacterEditor } from "@/hooks/editing/useCharacterEditor";
import { useFieldEditorModals } from "@/hooks/editing/useFieldEditorModals";
import {
    abilityScorePatch,
    toggleProficientSave,
    toggleProficientSkill,
} from "@/hooks/editing/characterFieldPatches";
import type { AbilityKey } from "@/types/character";
import type { Database } from "@/types/supabase";
import type { ListItem, ListEntry } from "@/types/lists";

type SkillName = Database["public"]["Enums"]["skill_name"];

const defaultCharacterSheet: CharacterSheet = {
    characterHeader: {
        name: "",
        level: 1,
        class: "",
        inspiration: 1,
    },
    abilities: {
        STR: { score: 0, mod: "+0" },
        DEX: { score: 0, mod: "+0" },
        CON: { score: 0, mod: "+0" },
        INT: { score: 0, mod: "+0" },
        WIS: { score: 0, mod: "+0" },
        CHA: { score: 0, mod: "+0" },
    },
    savingThrows: [],
    allSkills: [],
    proficientSkills: [],
    proficientSaves: [],
    proficientSkillsKeys: [],
};

export default function MainSheetScreen() {
    const { styles } = useStyles((theme, c) => ({
        shell: { flex: 1, marginBottom: 20 },
        screen: { flex: 1 },
        scrollView: { flex: 1 },
        scrollContentContainer: {
            // padding: theme.spacing.lg,
            gap: theme.spacing.xl,
        },
        content: {
            alignSelf: "stretch",
            paddingHorizontal: theme.spacing.lg,
            paddingTop: theme.spacing.xl,
            gap: theme.spacing.lg,
        },
        features: {
            backgroundColor: c("card.background"),
            borderRadius: theme.borderRadius.md,
            borderLeftWidth: 2,
            borderLeftColor: c("card.glow"),
            shadowColor: c("card.glow"),
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.1,
            shadowRadius: 15,
            elevation: 4,
        },
        headline: {
            marginBottom: theme.spacing.lg,
            marginTop: theme.spacing.xxl,
            textAlign: "center",
        },
        list: { width: "95%" },
    }));

    const characterId = useCharacterId();
    const [isEditMode, setIsEditMode] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const {
        data: characterSheet = defaultCharacterSheet,
        isLoading: isLoadingCharacterSheet,
    } = useCharacterSheet(characterId);
    const { data: features, isLoading: isLoadingFeatures } =
        useCharacterFeatures(characterId);
    const { updateCharacter } = useCharacterEditor(characterId);
    const { openText, openNumeric, modals } = useFieldEditorModals();

    const isLoading = isLoadingCharacterSheet || isLoadingFeatures;
    const displayedSkills = isExpanded
        ? characterSheet.allSkills
        : characterSheet.proficientSkills;

    const handleSavingThrowPress = (item: ListItem) => {
        const key = item.editId as AbilityKey | undefined;
        if (!key) return;
        updateCharacter.mutate(
            toggleProficientSave(characterSheet.proficientSaves, key),
        );
    };

    const handleSkillPress = (item: ListEntry) => {
        const skill = item.editId as SkillName | undefined;
        if (!skill) return;
        updateCharacter.mutate(
            toggleProficientSkill(characterSheet.proficientSkillsKeys, skill),
        );
    };

    return (
        <EditScreenShell
            isEditMode={isEditMode}
            style={styles.shell}
            onToggleEditMode={() => setIsEditMode((v) => !v)}
        >
            {modals}
            <ThemedView
                backgroundColor="surface.background"
                style={styles.screen}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContentContainer}
                    style={styles.scrollView}
                >
                    {isLoading ? (
                        <ActivityIndicator />
                    ) : (
                        <ThemedView style={styles.content}>
                            <Header
                                characterHeader={characterSheet.characterHeader}
                                isEditMode={isEditMode}
                                onEditInspiration={() =>
                                    openNumeric({
                                        label: "Inspiration",
                                        initialValue:
                                            characterSheet.characterHeader
                                                .inspiration,
                                        min: 0,
                                        max: 99,
                                        onSubmit: (value) =>
                                            updateCharacter.mutate({
                                                inspiration: value,
                                            }),
                                    })
                                }
                                onEditLevel={() =>
                                    openNumeric({
                                        label: "Level",
                                        initialValue:
                                            characterSheet.characterHeader
                                                .level,
                                        min: 1,
                                        max: 20,
                                        onSubmit: (value) =>
                                            updateCharacter.mutate({
                                                level: value,
                                            }),
                                    })
                                }
                                onEditName={() =>
                                    openText({
                                        label: "Character name",
                                        initialValue:
                                            characterSheet.characterHeader.name,
                                        placeholder: "Enter name",
                                        onSubmit: (value) =>
                                            updateCharacter.mutate({
                                                name: value,
                                            }),
                                    })
                                }
                            />

                            <AbilityGrid
                                abilities={characterSheet.abilities}
                                isEditMode={isEditMode}
                                onEditScore={(key) =>
                                    openNumeric({
                                        label: `${key} score`,
                                        initialValue:
                                            characterSheet.abilities[key].score,
                                        min: 1,
                                        max: 30,
                                        onSubmit: (value) =>
                                            updateCharacter.mutate(
                                                abilityScorePatch(key, value),
                                            ),
                                    })
                                }
                            />

                            <ThemedTwoColumnList
                                data={characterSheet.savingThrows}
                                icon={SavingThrowsIcon}
                                isEditMode={isEditMode}
                                title="Saving Throws"
                                onItemPress={handleSavingThrowPress}
                            />

                            <ThemedList
                                data={displayedSkills}
                                footerLabel={
                                    isExpanded ? "Show Less" : "View All Skills"
                                }
                                icon="list"
                                isEditMode={isEditMode}
                                title="Skills"
                                onFooterPress={() => setIsExpanded(!isExpanded)}
                                onItemPress={handleSkillPress}
                            />

                            <ThemedHeadline
                                color="text.heading"
                                style={styles.headline}
                            >
                                Your Features
                            </ThemedHeadline>
                            <View style={styles.list}>
                                {(features ?? []).map((feature) => (
                                    <ThemedFeatureContainer
                                        key={feature.feature_name}
                                        feature={feature}
                                    />
                                ))}
                            </View>
                        </ThemedView>
                    )}
                </ScrollView>
            </ThemedView>
        </EditScreenShell>
    );
}
