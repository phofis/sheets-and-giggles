import React, { useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";


// Import step components
import CreateHero from "@/components/character-creation/CreateHero";
import PersonalityAndBackground from "@/components/character-creation/PersonalityAndBackground";
import AbilitySheet from "@/components/character-creation/AbilitySheet";
import SpellsSheet from "@/components/character-creation/Spells";
import InventorySheet from "@/components/character-creation/Inventory";

import { useCreateCharacter } from "@/hooks/data/useCreateCharacter";

// ─── Formal Data Structures ──────────────────────────────────────────────────

export interface AbilityScores {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
}

export interface CombatStats {
    hp: number;
    ac: number;
    initiative: number;
    speed: number;
}

export interface Wealth {
    cp: number;
    sp: number;
    gp: number;
}

export interface EquipmentItem {
    name: string;
    description: string;
}

export interface CharacterDraftState {
    // Step 1
    name: string;
    raceId: string;
    classId: string;

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
    knownLanguages: string;
    traits: string[];
    ideals: string[];
    bonds: string[];
    flaws: string[];

    // Step 3
    abilityScores: AbilityScores;
    combatStats: CombatStats;
    skills: string[];

    // Step 4
    spells: string[];

    // Step 5
    equipment: EquipmentItem[];
    wealth: Wealth;
}

export default function CharacterCreationScreen() {
    // TODO: Replace with dynamic UUID extraction from your authentication context
    const currentUserId = "YOUR_TEST_USER_UUID_HERE";
    const router = useRouter();


    const [currentStep, setCurrentStep] = useState<number>(1);
    const [characterData, setCharacterData] = useState<CharacterDraftState>({
        // Step 1
        name: "",
        raceId: null,
        classId: null,

        // Step 2
        background: "",
        alignment: undefined,
        age: "",
        height: "",
        size: "",
        gender: "",
        eyes: "",
        skin: "",
        faith: "",
        knownLanguages: "",
        traits: [],
        ideals: [],
        bonds: [],
        flaws: [],

        // Step 3 
        abilityScores: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
        combatStats: { hp: 10, ac: 10, initiative: 0, speed: 30 },
        skills: [],

        // Step 4
        spells: [],

        // Step 5
        equipment: [],
        gold: 0,
    });

    // ─── Mutation Callbacks ──────────────────────────────────────────────────

    // Merges partial data from a step into the main state, logs the matrix, and advances the wizard
    const handleNextStep = async (partialData: Partial<CharacterDraftState>) => {
        // Compute the integrated state matrix
        const updatedData = { ...characterData, ...partialData };
        setCharacterData(updatedData);

        // Evaluate terminal condition
        if (currentStep === 5) {
            try {
                // Execute the asynchronous database insertion pipeline
                // await useCreateCharacter({
                //     draft: updatedData,
                //     userId: currentUserId
                // });

                // Route to the dashboard upon successful transaction resolution
                router.replace("/(tabs)/my-adventurers");
            } catch (error: any) {
                Error("Transaction Failed", error.message);
            }
        } else {
            // Advance to the next topological node
            setCurrentStep((prev) => prev + 1);
        }
    };

    // Retreats the wizard one step without nullifying accumulated data vectors
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

            {currentStep === 3 && (
                <AbilitySheet
                    initialData={characterData}
                    onNext={handleNextStep}
                    onBack={handlePreviousStep}
                />
            )}

            {currentStep === 4 && (
                <SpellsSheet
                    initialData={characterData}
                    onNext={handleNextStep}
                    onBack={handlePreviousStep}
                />
            )}

            {currentStep === 5 && (
                <InventorySheet
                    initialData={characterData}
                    onNext={handleNextStep}
                    onBack={handlePreviousStep}
                />
            )}

            {/* Finalization logic or subsequent steps go here... */}
        </View>
    );
}