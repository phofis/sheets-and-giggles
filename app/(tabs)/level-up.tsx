import React, { useState, useEffect, useMemo } from "react";
import { ScrollView, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";

import { ThemedView, ThemedText } from "@/components/themed";
import { useStyles } from "@/hooks/useStyles";

import { AbilityInputGrid } from "@/components/character-creation/AbilityInputGrid";
import { Header } from "@/components/level-up/Header";
import { SectionHeader } from "@/components/level-up/SectionHeader";
import { IncreaseCard } from "@/components/level-up/IncreaseCard";

import { useCharacterId } from "@/context/CharacterIdContext";
import { useCharacterSheet } from "@/hooks/useCharacterSheet";
import { useCharacterEditor } from "@/hooks/editing/useCharacterEditor";
import type { AbilityScores } from "@/app/character-creation";

import { SelectionList } from "@/components/level-up/SelectionList";
import type { SelectableItem } from "@/components/level-up/SelectableItemCard";

// Assume these imports map to your component repository
import { SelectionSectionCard } from "@/components/character-creation/SelectionSectionCard";
import { DynamicStringListCard } from "@/components/character-creation/DynamicStringListCard";

// ─── Static Mock Vectors ─────────────────────────────────────────────────────

const MOCK_FEATURES: SelectableItem[] = [
    {
        id: "feat_sentinel",
        name: "Sentinel",
        description: "You have mastered techniques to take advantage of every drop in any enemy's guard..."
    },
    {
        id: "feat_tough",
        name: "Tough",
        description: "Your hit point maximum increases by an amount equal to twice your level..."
    }
];

const MOCK_SUBCLASSES: SelectableItem[] = [
    {
        id: "sub_hunter",
        name: "Hunter",
        description: "You have mastered techniques to take advantage of every drop in any enemy's guard..."
    },
    {
        id: "sub_gloom",
        name: "Gloom Stalker",
        description: "Your hit point maximum increases by an amount equal to twice your level..."
    }
];

// C: The local mocked spell catalog
const MOCK_SPELLS_CATALOG = [
    { id: "spell_fireball", name: "Fireball" },
    { id: "spell_shield", name: "Shield" },
    { id: "spell_magic_missile", name: "Magic Missile" },
    { id: "spell_cure_wounds", name: "Cure Wounds" },
    { id: "spell_invisibility", name: "Invisibility" },
];

// ─── Formal Type Boundaries ──────────────────────────────────────────────────
export type StrictAbilityScores = Record<keyof AbilityScores, number>;

// Core Parameters
const TOTAL_ASI_POINTS = 2;
const SCORE_CAP = 20;

export default function LevelUpScreen() {
    const router = useRouter();
    const characterId = useCharacterId();

    const goToCharacterSheet = () => router.push("/character-sheet");

    const { data: characterSheet, isLoading } = useCharacterSheet(characterId);
    const { updateCharacter } = useCharacterEditor(characterId);

    const { styles } = useStyles((theme, c) => ({
        screen: { flex: 1, backgroundColor: c("surface.background") || "#11111b" },
        centered: { flex: 1, justifyContent: "center", alignItems: "center" },
        scrollContentContainer: { paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.xl, paddingBottom: 90 },
        fabContainer: {
            position: "absolute",
            bottom: theme.spacing.xl,
            left: 0,
            right: 0,
            flexDirection: "row",
            gap: theme.spacing.md,
            justifyContent: "center",
            alignItems: "center",
        },
        fabEdit: {
            backgroundColor: c("surface.background") || "#1e1e2e",
            padding: theme.spacing.md,
            borderRadius: 12,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            borderColor: c("surface.note") || "#313244",
        },
        fabNext: {
            backgroundColor: c("card.glow") || "#a6e3a1",
            padding: theme.spacing.md,
            borderRadius: 12,
            justifyContent: "center",
            alignItems: "center",
        },

        cardIcon: { color: c("card.glow") || "#f9e2af" },
        spellsAccent: { color: c("palette.tertiary") || "#cba6f7" },
    }));

    const [baseScores, setBaseScores] = useState<StrictAbilityScores | null>(null);
    const [abilityScores, setAbilityScores] = useState<StrictAbilityScores | null>(null);
    const [hpIncrease, setHpIncrease] = useState<number>(9);
    const [savingThrowProficiencies, setSavingThrowProficiencies] = useState<(keyof AbilityScores)[]>(["dex"]);

    const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(null);
    const [selectedSubclassId, setSelectedSubclassId] = useState<string | null>(null);
    const [spells, setSpells] = useState<string[]>([]);

    useEffect(() => {
        if (characterSheet && !baseScores) {
            const initialScalars = {} as StrictAbilityScores;
            const keys: Array<keyof AbilityScores> = ["str", "dex", "con", "int", "wis", "cha"];

            keys.forEach((k) => {
                const uppercaseKey = k.toUpperCase() as keyof typeof characterSheet.abilities;
                const node = characterSheet.abilities?.[uppercaseKey];
                initialScalars[k] = node?.score ?? 10;
            });

            setBaseScores(initialScalars);
            setAbilityScores(initialScalars);
        }
    }, [characterSheet, baseScores]);

    const spentPoints = abilityScores && baseScores
        ? (Object.keys(abilityScores) as Array<keyof AbilityScores>).reduce(
            (sum, k) => sum + (abilityScores[k] - baseScores[k]),
            0
        )
        : 0;

    const availablePoints = TOTAL_ASI_POINTS - spentPoints;

    const hasInvalidReductions = abilityScores && baseScores
        ? (Object.keys(abilityScores) as Array<keyof AbilityScores>).some(k => abilityScores[k] < baseScores[k])
        : false;

    const isFormValid = availablePoints === 0 && !hasInvalidReductions && selectedFeatureId !== null && selectedSubclassId !== null;

    let badgeText = `${availablePoints} Points Available`;
    let badgeType: "warning" | "error" | "default" | "default" = "default";

    if (hasInvalidReductions) {
        badgeText = "Cannot reduce base scores";
        badgeType = "error";
    } else if (availablePoints < 0) {
        badgeText = "Over point limit";
        badgeType = "error";
    } else if (availablePoints === 0) {
        badgeText = "Points allocated";
        badgeType = "default";
    }


    const availableSpellOptions = useMemo(() => {
        return MOCK_SPELLS_CATALOG
            .filter(spell => !spells.includes(spell.id))
            .map(spell => ({
                id: spell.id,
                label: spell.name,
                value: spell.id,
            }));
    }, [spells]);

    const handleScoreChange = <K extends keyof AbilityScores>(key: K, proposedValue: number) => {
        setAbilityScores((prev) => {
            if (!prev) return prev;
            const clampedValue = Math.min(proposedValue, SCORE_CAP);
            return { ...prev, [key]: clampedValue };
        });
    };

    const handleToggleProficiency = (key: keyof AbilityScores) => {
        setSavingThrowProficiencies((prev) =>
            prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
        );
    };

    const handleHpChange = (delta: number) => {
        setHpIncrease((prev) => Math.max(0, prev + delta));
    };

    const handleFeatureSelect = (id: string) => {
        // console.log(`[LevelUp Routing] Feature Selected: ${id}`);
        setSelectedFeatureId(id);
    };

    const handleSubclassSelect = (id: string) => {
        // console.log(`[LevelUp Routing] Subclass Selected: ${id}`);
        setSelectedSubclassId(id);
    };

    const handleAddSpell = (spellId: string) => {
        console.log(`[LevelUp Routing] Spell Added: ${spellId}`);
        setSpells(prev => [...prev, spellId]);
    };

    const handleRemoveSpell = (index: number) => {
        setSpells(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        if (!characterId || !abilityScores || !characterSheet) {
            console.error("Invariant Violation: Identity or state vector undefined.");
            return;
        }

        updateCharacter.mutate(
            {
                str_score: abilityScores.str,
                dex_score: abilityScores.dex,
                con_score: abilityScores.con,
                int_score: abilityScores.int,
                wis_score: abilityScores.wis,
                cha_score: abilityScores.cha,
            } as any,
            {
                onSuccess: () => {
                    goToCharacterSheet();
                }
            }
        );
    };

    if (isLoading || !abilityScores) {
        return (
            <ThemedView style={styles.screen}>
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={styles.fabNext.backgroundColor as string} />
                </View>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.screen}>
            <ScrollView contentContainerStyle={styles.scrollContentContainer} showsVerticalScrollIndicator={false}>

                <Header onBack={goToCharacterSheet} title="Level Up" />

                <SectionHeader
                    badgeText={badgeText}
                    badgeType={badgeType}
                    title="Ability Scores"
                />

                <AbilityInputGrid
                    proficiencies={savingThrowProficiencies}
                    scores={abilityScores}
                    onScoreChange={handleScoreChange}
                    onToggleProficiency={handleToggleProficiency}
                />

                <SectionHeader title="Hit Points" />

                <IncreaseCard
                    onDecrease={() => handleHpChange(-1)}
                    onIncrease={() => handleHpChange(1)}
                    value={hpIncrease}
                />

                <SelectionList
                    isRequired={true}
                    items={MOCK_FEATURES}
                    selectedId={selectedFeatureId}
                    title="Pick 1 Feature"
                    onSelect={handleFeatureSelect}
                />

                <SelectionList
                    isRequired={true}
                    items={MOCK_SUBCLASSES}
                    selectedId={selectedSubclassId}
                    title="Pick Subclass"
                    onSelect={handleSubclassSelect}
                />
    
                <SectionHeader title="Pick Spells" />

                <SelectionSectionCard
                    iconColor={styles.cardIcon.color}
                    iconLigature="menu_book"
                    options={availableSpellOptions}
                    selectedValue={null}
                    title="Available Spells to Learn"
                    onSelect={handleAddSpell}
                />

                <DynamicStringListCard
                    accentColor={styles.spellsAccent.color}
                    addButton={false}
                    emptyIconLigature="hourglass_empty"
                    emptySubtitle="Select a spell from the catalog above to add it to your spellbook."
                    emptyTitle="No spells selected."
                    iconLigature="auto_awesome"
                    items={spells.map(spellId => {
                        const foundSpell = MOCK_SPELLS_CATALOG.find(s => s.id === spellId);
                        return foundSpell ? foundSpell.name : spellId;
                    })}
                    title="Selected Spells"
                    onAddItem={(item) => setSpells(prev => [...prev, item])}
                    onRemove={handleRemoveSpell}
                />

                {/* ─── Terminal Action Node ─── */}
                <View style={styles.fabContainer}>
                    <TouchableOpacity
                        disabled={!isFormValid}
                        onPress={handleSubmit}
                        style={[
                            styles.fabNext,
                            // Increase padding for a wider, more prominent "Save" button
                            { paddingHorizontal: 24 },
                            (!isFormValid) && { opacity: 0.5 }
                        ]}
                    >

                        <ThemedText style={{ fontWeight: "900", fontSize: 16 }}>
                            ✓ Level Up
                        </ThemedText>

                    </TouchableOpacity>
                </View>

            </ScrollView>



        </ThemedView>
    );
}