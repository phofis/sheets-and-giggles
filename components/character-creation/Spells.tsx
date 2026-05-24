import React, { useState, useMemo } from "react";
import { ScrollView, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { ThemedView, ThemedText } from "@/components/themed";
import { useStyles } from "@/hooks/useStyles";

import { Header } from "./Header";
import { NextStepButton } from "./NextStep";
import { CharacterDraftState } from "@/app/character-creation";
import { SelectionSectionCard } from "./SelectionSectionCard";
import { DynamicStringListCard } from "./DynamicStringListCard";

// Adjust this import path based on your exact file structure for the query factory
import { useSpellsCatalog } from "@/hooks/data/useCatalog";

interface SpellsSheetProps {
    initialData: CharacterDraftState;
    onNext: (data: Partial<CharacterDraftState>) => void;
    onBack: () => void;
}


export default function SpellsSheet({ initialData, onNext, onBack }: SpellsSheetProps) {
    const { styles } = useStyles((t, c) => ({
        screen: { flex: 1, marginBottom: 20, marginTop: 35 },
        scrollView: { flex: 1, alignSelf: "stretch" },
        scrollContentContainer: { flexGrow: 1 },
        content: { alignSelf: "stretch", paddingHorizontal: t.spacing.lg, paddingTop: t.spacing.xl },
        backButton: { marginBottom: t.spacing.md, paddingVertical: t.spacing.sm },
        cardIcon: { color: c("card.glow") },
        spellsAccent: { color: c("palette.tertiary") },
    }));

    // S: The state vector of selected spells
    const [spells, setSpells] = useState<string[]>(initialData.spells || []);

    // C: The master catalog fetched via Tanstack Query
    const { data: spellsCatalog, isLoading, error } = useSpellsCatalog();

    // A = C \ S: Compute the relative complement for the dropdown options
    const availableSpellOptions = useMemo(() => {
        if (!spellsCatalog) return [];

        return spellsCatalog
            .filter(spell => !spells.includes(spell.id))
            .map(spell => ({
                id: spell.id,
                label: spell.name,
                value: spell.name,
            }));
    }, [spellsCatalog, spells]);

    // Mutation Callbacks
    const handleAddSpellFromCatalog = (spellName: string) => {
        setSpells(prev => [...prev, spellName]);
    };

    const handleRemoveSpell = (index: number) => {
        setSpells(prev => prev.filter((_, i) => i !== index));
    };

    const handleNext = () => {
        onNext({ spells });
    };





    return (
        <ThemedView backgroundColor="surface.background" style={styles.screen}>
            <ScrollView contentContainerStyle={styles.scrollContentContainer} style={styles.scrollView}>
                <ThemedView style={styles.content}>

                    <TouchableOpacity style={styles.backButton} onPress={onBack}>
                        <ThemedText color="text.muted" style={{ fontWeight: "bold" }}>← Back to Abilities</ThemedText>
                    </TouchableOpacity>

                    <Header
                        currentStep={4}
                        subtitle={`Determine the magical repertoire for ${initialData.name}.`}
                        title={"Spells & Magic"}
                        totalSteps={5}
                    />

                    {/* Network State Handling */}
                    {isLoading ? (
                        <View style={{ padding: 20, alignItems: "center" }}>
                            <ActivityIndicator color={styles.spellsAccent.color} size="large" />
                            <ThemedText style={{ marginTop: 10 }}>Accessing arcane archives...</ThemedText>
                        </View>
                    ) : error ? (
                        <ThemedText color="semantic.error" style={{ padding: 20 }}>
                            Failed to load spells: {error.message}
                        </ThemedText>
                    ) : (
                        <>
                            {/* Catalog Selection Interface */}
                            <SelectionSectionCard
                                iconColor={styles.cardIcon.color}
                                iconLigature="menu_book"
                                options={availableSpellOptions}
                                selectedValue={null} // Null enforces it acts as a trigger rather than a persistent static state
                                title="Discover Spells"
                                onSelect={handleAddSpellFromCatalog}
                            />

                            {/* Known Spells Display & Deletion Interface */}
                            <DynamicStringListCard
                                accentColor={styles.spellsAccent.color}
                                addButton={false}
                                emptyIconLigature="hourglass_empty"
                                emptySubtitle="Select a spell from the catalog above to add it to your spellbook."
                                emptyTitle="No spells learned yet."
                                iconLigature="auto_awesome"
                                items={spells.map(spellId => {
                                    const foundSpell = spellsCatalog?.find(s => s.id === spellId);
                                    // Fallback to the raw string if for some reason the catalog lookup fails
                                    return foundSpell ? foundSpell.name : spellId;
                                })}
                                // Preserves manual entry fallback if your DynamicStringListCard has a text input
                                title="Known Spells"
                                onAddItem={(item) => setSpells(prev => [...prev, item])}
                                onRemove={handleRemoveSpell}
                            />
                        </>
                    )}

                    <NextStepButton
                        disabled={false}
                        onPress={handleNext}
                    />

                </ThemedView>
            </ScrollView>
        </ThemedView>
    );
}