import React, { useState } from "react";
import { ScrollView, View, TouchableOpacity } from "react-native";
import { ThemedView, ThemedText } from "@/components/themed";
import { useStyles } from "@/hooks/useStyles";
import { getAlignmentOptions } from "@/constants/character-creation-setup";

import { Header } from ".././Header";
import { NextStepButton } from ".././NextStep";
import { CharacterDraftState } from "@/app/character-creation";
import { SingleAnswerInput } from ".././SingleAnswerInput";
import { SectionCard } from ".././SectionCard";
import { SelectionSectionCard } from ".././SelectionSectionCard";
import { LabeledInput } from ".././LabeledInput";
import { DynamicStringListCard } from ".././DynamicStringListCard";

interface PersonalityAndBackgroundProps {
    initialData: CharacterDraftState;
    onNext: (data: Partial<CharacterDraftState>) => void;
    onBack: () => void;
}

export default function PersonalityAndBackground({ initialData, onNext, onBack }: PersonalityAndBackgroundProps) {
    const { styles } = useStyles((t, c) => ({
        screen: { flex: 1, marginBottom: 20, marginTop: 35 },
        scrollView: { flex: 1, alignSelf: "stretch" },
        scrollContentContainer: { flexGrow: 1 },
        content: { alignSelf: "stretch", paddingHorizontal: t.spacing.lg, paddingTop: t.spacing.xl },
        backButton: { marginBottom: t.spacing.md, paddingVertical: t.spacing.sm },
        cardIcon: { color: c("card.glow") },
        traits: { color: c("palette.primary") },
        ideas: { color: c("palette.secondary") },
        bonds: { color: c("semantic.success") },
        flaws: { color: c("semantic.error") },
        // ─── Added Validation Warning Style ───
        validationWarning: {
            color: c("semantic.error") || "#ff4444",
            textAlign: "center",
            marginBottom: t.spacing.sm,
            fontFamily: t.typography.bodyFont
        }
    }));

    // State Initialization
    const [age, setAge] = useState<string>(initialData.age || "");
    const [height, setHeight] = useState<string>(initialData.height || "");
    const [size, setSize] = useState<string>(initialData.size || "");
    const [gender, setGender] = useState<string>(initialData.gender || "");
    const [eyes, setEyes] = useState<string>(initialData.eyes || "");
    const [skin, setSkin] = useState<string>(initialData.skin || "");
    const [faith, setFaith] = useState<string>(initialData.faith || "");
    const [knownLanguages, setKnownLanguages] = useState<string>(initialData.knownLanguages || "");
    const [alignment, setAlignment] = useState<string | null>(initialData.alignment || null);
    const [charBackground, setCharacterBackground] = useState<string>(initialData.background || "");

    const [traits, setTraits] = useState<string[]>(initialData.traits || []);
    const [ideals, setIdeals] = useState<string[]>(initialData.ideals || []);
    const [bonds, setBonds] = useState<string[]>(initialData.bonds || []);
    const [flaws, setFlaws] = useState<string[]>(initialData.flaws || []);

    // ─── Validation Logic Matrix ─────────────────────────────────────────────
    // Evaluates to true strictly if all required nodes contain non-whitespace data.
    // Note: 'faith' and array properties are excluded to allow for narrative flexibility.
    const isFormValid =
        charBackground.trim() !== "" &&
        age.trim() !== "" &&
        height.trim() !== "" &&
        size.trim() !== "" &&
        gender.trim() !== "" &&
        eyes.trim() !== "" &&
        skin.trim() !== "" &&
        knownLanguages.trim() !== "" &&
        alignment !== null;
    // ─────────────────────────────────────────────────────────────────────────

    const handleNext = () => {
        // Redundant gate to prevent execution if bypassed
        if (!isFormValid) return;

        onNext({
            age,
            height,
            size,
            gender,
            eyes,
            skin,
            faith,
            knownLanguages,
            alignment: alignment ?? undefined,
            background: charBackground,
            traits,
            ideals,
            bonds,
            flaws
        });
    };

    return (
        <ThemedView backgroundColor="surface.background" style={styles.screen}>
            <ScrollView contentContainerStyle={styles.scrollContentContainer} style={styles.scrollView}>
                <ThemedView style={styles.content}>

                    <TouchableOpacity style={styles.backButton} onPress={onBack}>
                        <ThemedText color="text.muted" style={{ fontWeight: "bold" }}>← Back to Origin</ThemedText>
                    </TouchableOpacity>

                    <Header
                        currentStep={2}
                        subtitle={`Flesh out the history of ${initialData.name}.`}
                        title={"Personality & Background"}
                        totalSteps={5}
                    />

                    <SingleAnswerInput
                        minHeight={150}
                        placeholder={"Tell the tale of your character's origins, their defining moments, and what set them on their current path..."}
                        title={"Background Story"}
                        value={charBackground}
                        onChangeText={setCharacterBackground}
                    />

                    <SectionCard iconColor={styles.cardIcon.color} iconLigature="accessibility_new" title="Physical Characteristics">
                        <View style={{ gap: 16 }}>
                            <View style={{ flexDirection: "row", gap: 16 }}>
                                <LabeledInput flex={1} label="Age *" placeholder="e.g. 24" value={age} onChangeText={setAge} />
                                <LabeledInput flex={1} label="Height *" placeholder="e.g. 5'10&quot;" value={height} onChangeText={setHeight} />
                            </View>
                            <View style={{ flexDirection: "row", gap: 16 }}>
                                <LabeledInput flex={1} label="Size *" placeholder="e.g. Medium" value={size} onChangeText={setSize} />
                                <LabeledInput flex={1} label="Gender *" placeholder="e.g. Female" value={gender} onChangeText={setGender} />
                            </View>
                            <View style={{ flexDirection: "row", gap: 16 }}>
                                <LabeledInput flex={1} label="Eyes *" placeholder="e.g. Hazel" value={eyes} onChangeText={setEyes} />
                                <LabeledInput flex={1} label="Skin *" placeholder="e.g. Fair" value={skin} onChangeText={setSkin} />
                            </View>
                        </View>
                    </SectionCard>

                    <SelectionSectionCard
                        iconColor={styles.cardIcon.color}
                        iconLigature="balance"
                        options={getAlignmentOptions()}
                        selectedValue={alignment}
                        title="Alignment *"
                        onSelect={setAlignment}
                    />

                    {/* Faith is deliberately left un-asterisked as an optional parameter */}
                    <SectionCard iconColor={styles.cardIcon.color} iconLigature="account_balance" title="Faith / Deity">
                        <LabeledInput
                            label=""
                            placeholder="Who do you worship? (Optional)"
                            value={faith}
                            onChangeText={setFaith}
                        />
                    </SectionCard>

                    <SectionCard iconColor={styles.cardIcon.color} iconLigature="language" title="Known Languages *">
                        <LabeledInput
                            label=""
                            placeholder="e.g. Common, Elvish, Dwarvish"
                            value={knownLanguages}
                            onChangeText={setKnownLanguages}
                        />
                    </SectionCard>


                    <DynamicStringListCard
                        accentColor={styles.traits.color}
                        emptyIconLigature="person_search"
                        emptySubtitle="What defines your character's day-to-day behavior?"
                        emptyTitle="No personality traits added yet."
                        iconLigature="psychology"
                        items={traits}
                        title="Personality Traits"
                        onAddItem={(item) => setTraits(prev => [...prev, item])}
                        onRemove={(index) => setTraits(prev => prev.filter((_, i) => i !== index))}
                    />

                    <DynamicStringListCard
                        accentColor={styles.ideas.color}
                        emptyIconLigature="wb_incandescent"
                        emptySubtitle="What are the core principles that drive your character?"
                        emptyTitle="No ideals added yet."
                        iconLigature="lightbulb"
                        items={ideals}
                        title="Ideals"
                        onAddItem={(item) => setIdeals(prev => [...prev, item])}
                        onRemove={(index) => setIdeals(prev => prev.filter((_, i) => i !== index))}
                    />

                    <DynamicStringListCard
                        accentColor={styles.bonds.color}
                        emptyIconLigature="handshake"
                        emptySubtitle="Who or what is your character deeply tied to?"
                        emptyTitle="No bonds added yet."
                        iconLigature="link"
                        items={bonds}
                        title="Bonds"
                        onAddItem={(item) => setBonds(prev => [...prev, item])}
                        onRemove={(index) => setBonds(prev => prev.filter((_, i) => i !== index))}
                    />

                    <DynamicStringListCard
                        accentColor={styles.flaws.color}
                        emptyIconLigature="mood_bad"
                        emptySubtitle="What is your character's hidden vice or weakness?"
                        emptyTitle="No flaws added yet."
                        iconLigature="warning"
                        items={flaws}
                        title="Flaws"
                        onAddItem={(item) => setFlaws(prev => [...prev, item])}
                        onRemove={(index) => setFlaws(prev => prev.filter((_, i) => i !== index))}
                    />

                    {/* ─── UI Feedback & Progression Gate ─── */}
                    {!isFormValid && (
                        <ThemedText style={styles.validationWarning}>
                            Please fill out all required fields (*) to continue.
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