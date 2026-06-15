import React, { useState, useEffect, useMemo } from "react";
import {
    ScrollView,
    View,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
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

import {
    useCharacter,
    useClasses,
    useClassSpells,
    useLevelUpAvailableFeatures,
    useAssignFeature,
    useCharacterSpells,
    useLearnSpell,
    type CharacterPatch,
} from "@/hooks/data";

// Assume these imports map to your component repository
import { SelectionSectionCard } from "@/components/character-creation/SelectionSectionCard";
import { DynamicStringListCard } from "@/components/character-creation/DynamicStringListCard";

// ─── Formal Type Boundaries ──────────────────────────────────────────────────
export type StrictAbilityScores = Record<keyof AbilityScores, number>;

// Core Parameters
const TOTAL_ASI_POINTS = 2;
const SCORE_CAP = 20;

export default function LevelUpScreen() {
    const router = useRouter();
    const characterId = useCharacterId();

    const goToCharacterSheet = () => router.push("/character-sheet");


    const { data: characterSheet, isLoading: isLoadingSheet } =
        useCharacterSheet(characterId);
    const { data: character, isLoading: isLoadingCharacter } =
        useCharacter(characterId);
    const { data: classes, isLoading: isLoadingClasses } = useClasses();
    const { updateCharacter } = useCharacterEditor(characterId);
    const assignFeature = useAssignFeature(characterId);
    const learnSpell = useLearnSpell(characterId);

    const { data: classSpells, isLoading: isLoadingClassSpells } =
        useClassSpells(character?.class_id);
    const { data: knownSpells } = useCharacterSpells(characterId);

    const currentClass = useMemo(
        () => classes?.find((c) => c.id === character?.class_id),
        [classes, character?.class_id],
    );

    const targetLevel = character ? character.level + 1 : undefined;

    const needsSubclass =
        !!character &&
        !!currentClass &&
        !character.subclass_id &&
        targetLevel === currentClass.subclass_level;

    const [selectedSubclassId, setSelectedSubclassId] = useState<string | null>(
        null,
    );
    const effectiveSubclassId = character?.subclass_id ?? selectedSubclassId;

    const { data: availableFeatures, isLoading: isLoadingFeatures } =
        useLevelUpAvailableFeatures(
            characterId,
            character?.class_id,
            effectiveSubclassId,
            targetLevel,
        );

    const { styles } = useStyles((theme, c) => ({
        screen: {
            flex: 1,
            backgroundColor: c("surface.background") || "#11111b",
        },
        centered: { flex: 1, justifyContent: "center", alignItems: "center" },
        scrollContentContainer: {
            paddingHorizontal: theme.spacing.lg,
            paddingTop: theme.spacing.xl,
            paddingBottom: 90,
        },
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

    const [baseScores, setBaseScores] = useState<StrictAbilityScores | null>(
        null,
    );
    const [abilityScores, setAbilityScores] =
        useState<StrictAbilityScores | null>(null);
    const [hpIncrease, setHpIncrease] = useState<number>(1);
    const [savingThrowProficiencies, setSavingThrowProficiencies] = useState<
        (keyof AbilityScores)[]
    >(["dex"]);

    const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(
        null,
    );
    const [spells, setSpells] = useState<string[]>([]);

    useEffect(() => {
        if (characterSheet && !baseScores) {
            const initialScalars = {} as StrictAbilityScores;
            const keys: (keyof AbilityScores)[] = [
                "str",
                "dex",
                "con",
                "int",
                "wis",
                "cha",
            ];

            keys.forEach((k) => {
                const uppercaseKey =
                    k.toUpperCase() as keyof typeof characterSheet.abilities;
                const node = characterSheet.abilities?.[uppercaseKey];
                initialScalars[k] = node?.score ?? 10;
            });

            setBaseScores(initialScalars);
            setAbilityScores(initialScalars);
        }
    }, [characterSheet, baseScores]);

    // Default HP bump to 1 + CON modifier (the bare-minimum convention).
    useEffect(() => {
        if (character) {
            const conMod = Math.floor((character.con_score - 10) / 2);
            setHpIncrease(Math.max(1, 1 + conMod));
        }
    }, [character]);

    const spentPoints =
        abilityScores && baseScores
            ? (Object.keys(abilityScores) as (keyof AbilityScores)[]).reduce(
                  (sum, k) => sum + (abilityScores[k] - baseScores[k]),
                  0,
              )
            : 0;

    const availablePoints = TOTAL_ASI_POINTS - spentPoints;

    const hasInvalidReductions =
        abilityScores && baseScores
            ? (Object.keys(abilityScores) as (keyof AbilityScores)[]).some(
                  (k) => abilityScores[k] < baseScores[k],
              )
            : false;

    const featureItems: SelectableItem[] = useMemo(
        () =>
            (availableFeatures ?? []).map((f) => ({
                id: f.id,
                name: f.name,
                description: f.description,
            })),
        [availableFeatures],
    );

    const subclassItems: SelectableItem[] = useMemo(
        () =>
            (currentClass?.subclasses ?? []).map((s) => ({
                id: s.subclass_id,
                name: s.name,
                description: s.short_description,
            })),
        [currentClass?.subclasses],
    );

    const featureSelectionValid =
        featureItems.length === 0 || selectedFeatureId !== null;
    const subclassSelectionValid =
        !needsSubclass || selectedSubclassId !== null;

    const isFormValid =
        availablePoints === 0 &&
        !hasInvalidReductions &&
        featureSelectionValid &&
        subclassSelectionValid;

    let badgeText = `${availablePoints} Points Available`;
    let badgeType: "warning" | "error" | "default" = "default";

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
        const knownIds = new Set((knownSpells ?? []).map((s) => s.spell_id));
        return (classSpells ?? [])
            .filter(
                (spell) =>
                    !knownIds.has(spell.id) && !spells.includes(spell.id),
            )
            .map((spell) => ({
                id: spell.id,
                label: spell.name,
                value: spell.id,
            }));
    }, [classSpells, knownSpells, spells]);

    const selectedSpellNames = useMemo(
        () =>
            spells.map((spellId) => {
                const found = (classSpells ?? []).find((s) => s.id === spellId);
                return found ? found.name : spellId;
            }),
        [spells, classSpells],
    );

    const handleScoreChange = <K extends keyof AbilityScores>(
        key: K,
        proposedValue: number,
    ) => {
        setAbilityScores((prev) => {
            if (!prev) return prev;
            const clampedValue = Math.min(proposedValue, SCORE_CAP);
            return { ...prev, [key]: clampedValue };
        });
    };

    const handleToggleProficiency = (key: keyof AbilityScores) => {
        setSavingThrowProficiencies((prev) =>
            prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key],
        );
    };

    const handleHpChange = (delta: number) => {
        setHpIncrease((prev) => Math.max(0, prev + delta));
    };

    const handleFeatureSelect = (id: string) => {
        setSelectedFeatureId(id);
    };

    const handleSubclassSelect = (id: string) => {
        setSelectedSubclassId(id);
        // Clear feature pick when subclass changes since the catalog shifts.
        setSelectedFeatureId(null);
    };

    const handleAddSpell = (spellId: string) => {
        setSpells((prev) => [...prev, spellId]);
    };

    const handleRemoveSpell = (index: number) => {
        setSpells((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!characterId || !character || !abilityScores || !targetLevel) {
            console.error(
                "Invariant Violation: Identity or state vector undefined.",
            );
            return;
        }

        const patch: CharacterPatch = {
            level: targetLevel,
            hp_max: character.hp_max + hpIncrease,
            hp_current: character.hp_current + hpIncrease,
            str_score: abilityScores.str,
            dex_score: abilityScores.dex,
            con_score: abilityScores.con,
            int_score: abilityScores.int,
            wis_score: abilityScores.wis,
            cha_score: abilityScores.cha,
        };
        if (needsSubclass && selectedSubclassId) {
            patch.subclass_id = selectedSubclassId;
        }

        try {
            await updateCharacter.mutateAsync(patch);
            if (selectedFeatureId) {
                await assignFeature.mutateAsync({
                    feature_id: selectedFeatureId,
                    assigned_source: "level_up",
                });
            }
            for (const spellId of spells) {
                await learnSpell.mutateAsync({ spell_id: spellId });
            }
            router.back();
        } catch (e) {
            console.error("Level up failed", e);
        }
    };

    const isLoading =
        isLoadingSheet ||
        isLoadingCharacter ||
        isLoadingClasses ||
        !abilityScores ||
        !character;

    if (isLoading) {
        return (
            <ThemedView style={styles.screen}>
                <View style={styles.centered}>
                    <ActivityIndicator
                        color={styles.fabNext.backgroundColor as string}
                        size="large"
                    />
                </View>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.screen}>
            <ScrollView
                contentContainerStyle={styles.scrollContentContainer}
                showsVerticalScrollIndicator={false}
            >
                <Header
                    title={`Level Up → ${targetLevel}`}
                    onBack={goToCharacterSheet}
                />

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
                    value={hpIncrease}
                    onDecrease={() => handleHpChange(-1)}
                    onIncrease={() => handleHpChange(1)}
                />

                {needsSubclass && (
                    <SelectionList
                        isRequired
                        items={subclassItems}
                        selectedId={selectedSubclassId}
                        title="Pick Subclass"
                        onSelect={handleSubclassSelect}
                    />
                )}

                {isLoadingFeatures ? (
                    <View style={{ paddingVertical: 24 }}>
                        <ActivityIndicator />
                    </View>
                ) : featureItems.length > 0 ? (
                    <SelectionList
                        isRequired
                        items={featureItems}
                        selectedId={selectedFeatureId}
                        title={`Pick 1 Feature (Level ${targetLevel})`}
                        onSelect={handleFeatureSelect}
                    />
                ) : (
                    <>
                        <SectionHeader
                            title={`Features (Level ${targetLevel})`}
                        />
                        <ThemedText color="text.muted">
                            No new class features unlock at this level.
                        </ThemedText>
                    </>
                )}

                <SectionHeader title="Pick Spells" />

                {isLoadingClassSpells ? (
                    <View style={{ paddingVertical: 16 }}>
                        <ActivityIndicator />
                    </View>
                ) : (classSpells ?? []).length === 0 ? (
                    <ThemedText color="text.muted">
                        No class spells are available for this class.
                    </ThemedText>
                ) : (
                    <SelectionSectionCard
                        iconColor={styles.cardIcon.color}
                        iconLigature="menu_book"
                        options={availableSpellOptions}
                        selectedValue={null}
                        title="Available Spells to Learn"
                        onSelect={handleAddSpell}
                    />
                )}

                <DynamicStringListCard
                    accentColor={styles.spellsAccent.color}
                    addButton={false}
                    emptyIconLigature="hourglass_empty"
                    emptySubtitle="Select a spell from the catalog above to add it to your spellbook."
                    emptyTitle="No spells selected."
                    iconLigature="auto_awesome"
                    items={selectedSpellNames}
                    title="Selected Spells"
                    onAddItem={(item) => setSpells((prev) => [...prev, item])}
                    onRemove={handleRemoveSpell}
                />

                {/* ─── Terminal Action Node ─── */}
                <View style={styles.fabContainer}>
                    <TouchableOpacity
                        disabled={
                            !isFormValid ||
                            updateCharacter.isPending ||
                            assignFeature.isPending ||
                            learnSpell.isPending
                        }
                        style={[
                            styles.fabNext,
                            // Increase padding for a wider, more prominent "Save" button
                            { paddingHorizontal: 24 },
                            (!isFormValid ||
                                updateCharacter.isPending ||
                                assignFeature.isPending ||
                                learnSpell.isPending) && { opacity: 0.5 },
                        ]}
                        onPress={handleSubmit}
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
