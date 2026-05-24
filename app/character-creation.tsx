import React, { useState } from "react";
import { View } from "react-native";

// Import your step components
import CreateHero from "@/components/character-creation/CreateHero"; // Adjust path as needed
import PersonalityAndBackground from "@/components/character-creation/PersonalityAndBackground"; // Adjust path as needed

// ─── Global State Interface ──────────────────────────────────────────────────
export interface CharacterDraftState {
    // Step 1
    name: string;
    raceId: string | null;
    classId: string | null;

    // Step 2
    // Step 2
    background: string;
    alignment?: string;
    age: string;
    height: string;
    size: string;
    gender: string;
    eyes: string;
    skin: string;
    faith: string;
    traits: string[];
    ideals: string[];
    bonds: string[];
    flaws: string[];

    // ... future steps
}

export default function CharacterCreationScreen() {
    // 1. Wizard Topology State
    const [currentStep, setCurrentStep] = useState<number>(1);

    // 2. Accumulated Character Data State
    const [characterData, setCharacterData] = useState<CharacterDraftState>({
        name: "",
        raceId: null,
        classId: null,

        background: "",
        alignment: undefined,
        age: "",
        height: "",
        size: "",
        gender: "",
        eyes: "",
        skin: "",
        faith: "",
        traits: [],
        ideals: [],
        bonds: [],
        flaws: [],
    });

    // ─── Mutation Callbacks ──────────────────────────────────────────────────

    // Merges partial data from a step into the main state and advances the wizard
    const handleNextStep = (partialData: Partial<CharacterDraftState>) => {
        setCharacterData((prev) => ({ ...prev, ...partialData }));
        setCurrentStep((prev) => prev + 1);
    };

    // Retreats the wizard one step without deleting accumulated data
    const handlePreviousStep = () => {
        setCurrentStep((prev) => prev - 1);
    };

    // ─── Render Pipeline (The Switch) ────────────────────────────────────────
    return (
        <View style={{ flex: 1, backgroundColor: "#121212" }}>
            {currentStep === 1 && (
                <CreateHero
                    initialData={characterData}
                    onNext={handleNextStep}
                />
            )}

            {currentStep === 2 && (
                <PersonalityAndBackground
                    initialData={characterData}
                    onNext={handleNextStep}
                    onBack={handlePreviousStep}
                />
            )}

            {/* Future steps go here... */}
        </View>
    );
}