import React, { useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";


// Import step components
import CreateHero from "@/components/character-creation/steps/CreateHero";
import PersonalityAndBackground from "@/components/character-creation/steps/PersonalityAndBackground";
import AbilitySheet from "@/components/character-creation/steps/AbilitySheet";
import SpellsSheet from "@/components/character-creation/steps/Spells";
import InventorySheet from "@/components/character-creation/steps/Inventory";

import { DEFAULT_ALIGNMENT } from "@/constants/character-creation-setup";
import { useCreateCharacter } from "@/hooks/data/useCreateCharacter";
import { useAuth } from "@/hooks/auth";
import type { Database } from "@/types/supabase";

type CharacterRow = Database["public"]["Tables"]["characters"]["Row"];
type CharacterItemRow = Database["public"]["Tables"]["character_items"]["Row"];

// ─── Formal Data Structures ──────────────────────────────────────────────────

export interface AbilityScores {
    str: CharacterRow["str_score"];
    dex: CharacterRow["dex_score"];
    con: CharacterRow["con_score"];
    int: CharacterRow["int_score"];
    wis: CharacterRow["wis_score"];
    cha: CharacterRow["cha_score"];
}

export interface CombatStats {
    hp: CharacterRow["hp_max"];
    ac: CharacterRow["armor_class"];
    initiative: CharacterRow["initiative"];
    speed: CharacterRow["speed"];
}

export interface Wealth {
    cp: CharacterRow["copper"];
    sp: CharacterRow["silver"];
    gp: CharacterRow["gold"];
}

export interface EquipmentItem {
    name: CharacterItemRow["name"];
    description: CharacterItemRow["description"];
}

export interface CharacterDraftState {
    // Step 1
    name: CharacterRow["name"];
    raceId: CharacterRow["race_id"];
    classId: CharacterRow["class_id"];

    // Step 2
    background: CharacterRow["background"];
    alignment: CharacterRow["alignment"];
    age: CharacterRow["age"];
    height: CharacterRow["height"];
    size: CharacterRow["size"];
    gender: CharacterRow["gender"];
    eyes: CharacterRow["eyes"];
    skin: CharacterRow["skin"];
    faith: CharacterRow["faith"];
    knownLanguages: string;
    traits: CharacterRow["personality_traits"];
    ideals: CharacterRow["ideals"];
    bonds: CharacterRow["bonds"];
    flaws: CharacterRow["flaws"];

    // Step 3
    abilityScores: AbilityScores;
    combatStats: CombatStats;
    skills: CharacterRow["proficient_skills"];

    // Step 4
    spells: string[];

    // Step 5
    equipment: EquipmentItem[];
    wealth: Wealth;
}

export default function CharacterCreationScreen() {
    // TODO: Replace with dynamic UUID extraction from your authentication context
    const { user } = useAuth();
    const router = useRouter();
    const createCharacter = useCreateCharacter();


    const [currentStep, setCurrentStep] = useState<number>(1);
    const [characterData, setCharacterData] = useState<CharacterDraftState>({
        // Step 1
        name: "",
        raceId: "",
        classId: "",

        // Step 2
        background: "",
        alignment: DEFAULT_ALIGNMENT,
        age: 0,
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
        wealth: { cp: 0, sp: 0, gp: 0 },
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
                if (!user?.id) throw new Error("You must be signed in to create a character.");
                await createCharacter.mutateAsync({
                    draft: updatedData,
                    userId: user.id,
                });

                // Route to the dashboard upon successful transaction resolution
                router.replace("/my-adventurers");
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
                    onBack={handlePreviousStep}
                    onNext={handleNextStep}
                />
            )}

            {currentStep === 3 && (
                <AbilitySheet
                    initialData={characterData}
                    onBack={handlePreviousStep}
                    onNext={handleNextStep}
                />
            )}

            {currentStep === 4 && (
                <SpellsSheet
                    initialData={characterData}
                    onBack={handlePreviousStep}
                    onNext={handleNextStep}
                />
            )}

            {currentStep === 5 && (
                <InventorySheet
                    initialData={characterData}
                    onBack={handlePreviousStep}
                    onNext={handleNextStep}
                />
            )}

            {/* Finalization logic or subsequent steps go here... */}
        </View>
    );
}