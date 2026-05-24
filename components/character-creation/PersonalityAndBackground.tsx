import React, { useState } from "react";
import { ScrollView, View, TouchableOpacity } from "react-native";
import { ThemedView, ThemedText } from "@/components/themed";
import { useStyles } from "@/hooks/useStyles";
import { getAlignmentOptions } from "@/constants/character-creation-setup";

import { Header } from "./Header";
import { NextStepButton } from "./NextStep";
import { CharacterDraftState } from "@/app/character-creation";
import { SingleAnswerInput } from "./SingleAnswerInput";
import { SectionCard } from "./SectionCard";
import { SelectionSectionCard } from "./SelectionSectionCard";
import { LabeledInput } from "./LabeledInput";
import { DynamicStringListCard } from "./DynamicStringListCard";

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
    }));

    const [age, setAge] = useState<string>("");
    const [height, setHeight] = useState<string>("");
    const [size, setSize] = useState<string>("");
    const [gender, setGender] = useState<string>("");
    const [eyes, setEyes] = useState<string>("");
    const [skin, setSkin] = useState<string>("");
    const [faith, setFaith] = useState<string>("");
    const [alignment, setAlignment] = useState<string | null>(initialData.alignment || null);
    const [charBackground, setCharacterBackground] = useState<string>(initialData.background || "");

    const [traits, setTraits] = useState<string[]>([]);
    const [ideals, setIdeals] = useState<string[]>([]);
    const [bonds, setBonds] = useState<string[]>([]);
    const [flaws, setFlaws] = useState<string[]>([]);

    const handleNext = () => {
        onNext({
            age,
            height,
            size,
            gender,
            eyes,
            skin,
            faith,
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

                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <ThemedText color="text.muted" style={{ fontWeight: "bold" }}>← Back to Origin</ThemedText>
                    </TouchableOpacity>

                    <Header
                        title={"Personality & Background"}
                        subtitle={`Flesh out the history of ${initialData.name}.`}
                        currentStep={2}
                        totalSteps={5}
                    />

                    <SingleAnswerInput
                        value={charBackground}
                        onChangeText={setCharacterBackground}
                        title={"Background Story"}
                        minHeight={150}
                        placeholder={"Tell the tale of your character's origins, their defining moments, and what set them on their current path..."}
                    />

                    <SectionCard title="Physical Characteristics" iconLigature="accessibility_new" iconColor={styles.cardIcon.color}>
                        <View style={{ gap: 16 }}>
                            <View style={{ flexDirection: "row", gap: 16 }}>
                                <LabeledInput flex={1} label="Age" placeholder="e.g. 24" value={age} onChangeText={setAge} />
                                <LabeledInput flex={1} label="Height" placeholder="e.g. 5'10&quot;" value={height} onChangeText={setHeight} />
                            </View>
                            <View style={{ flexDirection: "row", gap: 16 }}>
                                <LabeledInput flex={1} label="Size" placeholder="e.g. Medium" value={size} onChangeText={setSize} />
                                <LabeledInput flex={1} label="Gender" placeholder="e.g. Female" value={gender} onChangeText={setGender} />
                            </View>
                            <View style={{ flexDirection: "row", gap: 16 }}>
                                <LabeledInput flex={1} label="Eyes" placeholder="e.g. Hazel" value={eyes} onChangeText={setEyes} />
                                <LabeledInput flex={1} label="Skin" placeholder="e.g. Fair" value={skin} onChangeText={setSkin} />
                            </View>
                        </View>
                    </SectionCard>

                    <SelectionSectionCard
                        title="Alignment"
                        iconLigature="balance"
                        options={getAlignmentOptions()}
                        selectedValue={alignment}
                        onSelect={setAlignment}
                        iconColor={styles.cardIcon.color}
                    />

                    <SectionCard title="Faith / Deity" iconLigature="account_balance" iconColor={styles.cardIcon.color}>
                        <LabeledInput
                            label=""
                            placeholder="Who do you worship?"
                            value={faith}
                            onChangeText={setFaith}
                        />
                    </SectionCard>

                    <DynamicStringListCard
                        title="Personality Traits"
                        iconLigature="psychology"
                        accentColor={styles.traits.color}
                        emptyIconLigature="person_search"
                        emptyTitle="No personality traits added yet."
                        emptySubtitle="What defines your character's day-to-day behavior?"
                        items={traits}
                        onAddItem={(item) => setTraits(prev => [...prev, item])}
                        onRemove={(index) => setTraits(prev => prev.filter((_, i) => i !== index))}
                    />

                    <DynamicStringListCard
                        title="Ideals"
                        iconLigature="lightbulb"
                        accentColor={styles.ideas.color}
                        emptyIconLigature="wb_incandescent"
                        emptyTitle="No ideals added yet."
                        emptySubtitle="What are the core principles that drive your character?"
                        items={ideals}
                        onAddItem={(item) => setIdeals(prev => [...prev, item])}
                        onRemove={(index) => setIdeals(prev => prev.filter((_, i) => i !== index))}
                    />

                    <DynamicStringListCard
                        title="Bonds"
                        iconLigature="link"
                        accentColor={styles.bonds.color}
                        emptyIconLigature="handshake"
                        emptyTitle="No bonds added yet."
                        emptySubtitle="Who or what is your character deeply tied to?"
                        items={bonds}
                        onAddItem={(item) => setBonds(prev => [...prev, item])}
                        onRemove={(index) => setBonds(prev => prev.filter((_, i) => i !== index))}
                    />

                    <DynamicStringListCard
                        title="Flaws"
                        iconLigature="warning"
                        accentColor={styles.flaws.color}
                        emptyIconLigature="mood_bad"
                        emptyTitle="No flaws added yet."
                        emptySubtitle="What is your character's hidden vice or weakness?"
                        items={flaws}
                        onAddItem={(item) => setFlaws(prev => [...prev, item])}
                        onRemove={(index) => setFlaws(prev => prev.filter((_, i) => i !== index))}
                    />

                    <NextStepButton
                        onPress={handleNext}
                        disabled={false}
                    />

                </ThemedView>
            </ScrollView>
        </ThemedView>
    );
}