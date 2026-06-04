import React, { useState } from "react";
import { ScrollView, View, TouchableOpacity, Text } from "react-native";
import { ThemedView, ThemedText } from "@/components/themed";
import { useStyles } from "@/hooks/useStyles";

import { Header } from "../Header";
import { NextStepButton } from "../NextStep";
import { CharacterDraftState, AbilityScores, CombatStats } from "@/app/character-creation";
import type { Database } from "@/types/supabase";
import { SectionCard } from "../SectionCard";
import { AbilityInputGrid } from "../AbilityInputGrid";
import { CombatStatsGrid } from "../CombatStatsGrid";
import { SkillSelectionList } from "../SkillSelectionList";

type DbSkillName = Database["public"]["Enums"]["skill_name"];

interface AbilitySheetProps {
    initialData: CharacterDraftState;
    onNext: (data: Partial<CharacterDraftState>) => void;
    onBack: () => void;
}

const ALL_AVAILABLE_SKILLS: readonly DbSkillName[] = [
    "Acrobatics", "Animal Handling", "Arcana", "Athletics",
    "Deception", "History", "Insight", "Intimidation",
    "Investigation", "Medicine", "Nature", "Perception",
    "Performance", "Persuasion", "Religion", "Sleight of Hand",
    "Stealth", "Survival",
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
        skills: { color: c("palette.secondary") },
        // ─── Added Validation Warning Style ───
        validationWarning: {
            color: c("semantic.error") || "#ff4444",
            textAlign: "center",
            marginBottom: t.spacing.sm,
            fontFamily: t.typography.bodyFont
        }
    }));

    const [abilityScores, setAbilityScores] = useState<AbilityScores>(initialData.abilityScores);
    const [combatStats, setCombatStats] = useState<CombatStats>(initialData.combatStats);
    const [skills, setSkills] = useState<CharacterDraftState["skills"]>(initialData.skills);
    const [savingThrowProficiencies, setSavingThrowProficiencies] = useState<(keyof AbilityScores)[]>([]);

    const areAbilitiesValid = Object.values(abilityScores).every(
        (score) => typeof score === "number" && !isNaN(score) && score > 0
    );

    const areCombatStatsValid =
        typeof combatStats.hp === "number" && combatStats.hp > 0 &&
        typeof combatStats.ac === "number" && combatStats.ac > 0 &&
        typeof combatStats.speed === "number" && combatStats.speed >= 0 &&
        typeof combatStats.initiative === "number" && !isNaN(combatStats.initiative);


    const isFormValid = areAbilitiesValid && areCombatStatsValid;
    // ─────────────────────────────────────────────────────────────────────────

    const handleToggleSkill = (skillName: DbSkillName) => {
        setSkills((prev) =>
            prev.includes(skillName)
                ? prev.filter((s) => s !== skillName)
                : [...prev, skillName],
        );
    };

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

    const handleNext = () => {
        if (!isFormValid) return;

        onNext({
            abilityScores,
            combatStats,
            skills,
        });
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

                    <SectionCard iconColor={styles.abilities.color} iconLigature="shield" title="Combat Stats *">
                        <CombatStatsGrid
                            stats={combatStats}
                            onChange={handleCombatStatChange}
                        />
                    </SectionCard>

                    <SectionCard iconColor={styles.combat.color} iconLigature="fitness_center" title="Ability Scores *">
                        <AbilityInputGrid
                            proficiencies={savingThrowProficiencies}
                            scores={abilityScores}
                            onScoreChange={handleScoreChange}
                            onToggleProficiency={handleToggleProficiency}
                        />
                    </SectionCard>

                    {/* Skills are intentionally left without an asterisk to allow 0 selections if necessary */}
                    <SectionCard iconColor={styles.skills.color} iconLigature="list" title="Skills">
                        <SkillSelectionList
                            availableSkills={[...ALL_AVAILABLE_SKILLS]}
                            initialDisplayCount={6}
                            selectedSkills={skills}
                            onToggleSkill={(skill) => handleToggleSkill(skill as DbSkillName)}
                        />
                    </SectionCard>

                    {/* ─── UI Feedback & Progression Gate ─── */}
                    {!isFormValid && (
                        <ThemedText style={styles.validationWarning}>
                            Please ensure all core abilities and combat stats (*) contain valid numbers above zero.
                        </ThemedText>
                    )}

                    <NextStepButton
                        disabled={!isFormValid}
                        onPress={handleNext}
                    />

                </ThemedView>
            </ScrollView>
        </ThemedView>
    );
}