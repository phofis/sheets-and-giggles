import React, { useState } from "react";
import { ScrollView, View, TouchableOpacity, Text } from "react-native";
import { ThemedView, ThemedText } from "@/components/themed";
import { useStyles } from "@/hooks/useStyles";

import { Header } from "./Header";
import { NextStepButton } from "./NextStep";
import { CharacterDraftState, AbilityScores, CombatStats } from "@/app/character-creation";
import { SectionCard } from "./SectionCard";
import { AbilityInputGrid } from "./AbilityInputGrid";
import { CombatStatsGrid } from "./CombatStatsGrid"
import { SkillSelectionList } from "./SkillSelectionList";

interface AbilitySheetProps {
    initialData: CharacterDraftState;
    onNext: (data: Partial<CharacterDraftState>) => void;
    onBack: () => void;
}

const ALL_AVAILABLE_SKILLS = [
    "Acrobatics", "Animal Handling", "Arcana", "Athletics",
    "Deception", "History", "Insight", "Intimidation",
    "Investigation", "Medicine", "Nature", "Perception",
    "Performance", "Persuasion", "Religion", "Sleight of Hand",
    "Stealth", "Survival"
];

export default function AbilitySheet({ initialData, onNext, onBack }: AbilitySheetProps) {
    const { styles } = useStyles((t, c) => ({
        screen: { flex: 1, marginBottom: 20, marginTop: 35 },
        scrollView: { flex: 1, alignSelf: "stretch" },
        scrollContentContainer: { flexGrow: 1 },
        content: { alignSelf: "stretch", paddingHorizontal: t.spacing.lg, paddingTop: t.spacing.xl },
        backButton: { marginBottom: t.spacing.md, paddingVertical: t.spacing.sm },
        abilities: { color: c("palette.tertiary") },
        combat: { color: c("palette.tertiary") },
        skills: {color: c("palette.secondary")},
    }));

    // Isolate state mappings
    const [abilityScores, setAbilityScores] = useState<AbilityScores>(initialData.abilityScores);
    const [combatStats, setCombatStats] = useState<CombatStats>(initialData.combatStats);

    const [skills, setSkills] = useState<string[]>(initialData.skills);

    // 2. Define the selection toggler
    const handleToggleSkill = (skillName: string) => {
        setSkills(prev =>
            prev.includes(skillName)
                ? prev.filter(s => s !== skillName)
                : [...prev, skillName]
        );
    };

    const handleNext = () => {
        onNext({
            abilityScores,
            combatStats,
            skills
        });
    };

    const [savingThrowProficiencies, setSavingThrowProficiencies] = useState<(keyof AbilityScores)[]>([]);

    const handleScoreChange = (key: keyof AbilityScores, value: number) => {
        setAbilityScores(prev => ({ ...prev, [key]: value }));
    };

    const handleToggleProficiency = (key: keyof AbilityScores) => {
        setSavingThrowProficiencies(prev =>
            prev.includes(key)
                ? prev.filter(p => p !== key)
                : [...prev, key]
        );
    };


    const handleCombatStatChange = (key: keyof CombatStats, value: number) => {
        setCombatStats(prev => ({ ...prev, [key]: value }));
    };

    return (
        <ThemedView backgroundColor="surface.background" style={styles.screen}>
            <ScrollView contentContainerStyle={styles.scrollContentContainer} style={styles.scrollView}>
                <ThemedView style={styles.content}>

                    <TouchableOpacity style={styles.backButton} onPress={onBack}>
                        <ThemedText color="text.muted" style={{ fontWeight: "bold" }}>← Back to Personality</ThemedText>
                    </TouchableOpacity>

                    <Header
                        currentStep={3}
                        subtitle={`Determine the numerical statistics for ${initialData.name}.`}
                        title={"Abilities & Combat"}
                        totalSteps={5}
                    />

                    <SectionCard iconColor={styles.abilities.color} iconLigature="shield" title="Combat Stats">
                        <CombatStatsGrid
                            stats={combatStats}
                            onChange={handleCombatStatChange}
                        />
                    </SectionCard>

                    {/* Implement your SectionCards for Ability Scores here */}
                    <SectionCard iconColor={styles.combat.color} iconLigature="fitness_center" title="Ability Scores">
                        <AbilityInputGrid
                            proficiencies={savingThrowProficiencies}
                            scores={abilityScores}
                            onScoreChange={handleScoreChange}
                            onToggleProficiency={handleToggleProficiency}
                        />
                    </SectionCard>

                    <SectionCard iconColor={styles.skills.color} iconLigature="list" title="Skills">
                        <SkillSelectionList
                            availableSkills={ALL_AVAILABLE_SKILLS}
                            initialDisplayCount={6}
                            selectedSkills={skills}
                            onToggleSkill={handleToggleSkill}
                        />
                    </SectionCard>

                    {/* Implement your SectionCards for Combat Stats here */}

                    {/* Implement your DynamicStringListCard for Skills here */}

                    <NextStepButton
                        disabled={false} // Add validation logic if required (e.g., standard array sum verification)
                        onPress={handleNext}
                    />

                </ThemedView>
            </ScrollView>
        </ThemedView>
    );
}