import { Database } from "@/types/supabase";
export type AbilityKey = Database["public"]["Enums"]["ability_score"]

export interface AbilityValue {
    score: number;
    mod: string;
}

export type AbilityScores = Record<AbilityKey, AbilityValue>;

export const ABILITY_LABELS: { key: AbilityKey; label: string }[] = [
    { key: "STR", label: "Strength" },
    { key: "DEX", label: "Dexterity" },
    { key: "CON", label: "Constitution" },
    { key: "INT", label: "Intelligence" },
    { key: "WIS", label: "Wisdom" },
    { key: "CHA", label: "Charisma" },
];

// export interface SavingThrow extends ListItem {
//     key: AbilityKey;
//     label: string;
//     value: string; // formatted string, e.g., +5
//     highlight?: boolean; // indicate proficiency
// }

// export interface ClassFeature extends BoxListItem {
//     id: string;
//     requiredLevel: number;
// }

export interface CharacterInfo {
    id: string;
    name: string;
    photoUri: string;
    level: number;
    class: string;
    race: string;
    inspiration: number;
    ac: number;
    hp: {
        current: number;
        max: number;
    };
    abilityScores: AbilityScores
    proficientSaves: AbilityKey[];
}
export interface BiometricEntry {
    label: string;
    value: string;
}
export interface CharacterHeader {
    name: Database["public"]["Tables"]["characters"]["Row"]["name"],
    level: Database["public"]["Tables"]["characters"]["Row"]["level"],
    class: Database["public"]["Tables"]["classes"]["Row"]["name"],
    inspiration: Database["public"]["Tables"]["characters"]["Row"]["inspiration"]
}
export interface CharacterBiometrics {
    alignment: string,
    gender: string,
    eyes: string,
    size: string,
    height: string,
    age: string,
    faith: string,
    skin: string,
};

// export interface CharacterValues {
//     background: string,
//     personalityTraits: string[],
//     ideals: string[],
//     bonds: string[],
//     flaws: string[]

// }

// import type { Database } from "./supabase";
// import { CharacterDraftState } from "@/app/character-creation";

// export type CharacterInsertDTO = Database["public"]["Tables"]["characters"]["Insert"];

// // /**
// //  * Transforms the local frontend state matrix into the formalized relational schema.
// //  * Complexity: O(1) attribute mapping with scalar type enforcement.
// //  */
// // export function mapDraftToDTO(draft: CharacterDraftState, userId: string): CharacterInsertDTO {
// //     return {
// //         user_id: userId,
// //         race_id: draft.raceId,
// //         class_id: draft.classId,
// //         subclass_id: null, // Assign if your wizard captures this
// //         name: draft.name,

// //         // ─── Flattened Ability Scores (int2) ───
// //         str_score: draft.abilityScores.str,
// //         dex_score: draft.abilityScores.dex,
// //         con_score: draft.abilityScores.con,
// //         int_score: draft.abilityScores.int,
// //         wis_score: draft.abilityScores.wis,
// //         cha_score: draft.abilityScores.cha,

// //         // ─── Flattened Combat Stats (int2/int4) ───
// //         hp_current: draft.combatStats.hp,
// //         hp_max: draft.combatStats.hp,
// //         hp_temp: 0,
// //         armor_class: draft.combatStats.ac,
// //         initiative: draft.combatStats.initiative,
// //         speed: draft.combatStats.speed,

// //         // Base numerical constants for initialization
// //         level: 1,
// //         experience: 0,
// //         inspiration: 0,
// //         proficiency_bonus: 2,

// //         // ─── Arrays and Enums ───
// //         // proficient_skills: draft.skills, // Maps to _skill_name array

// //         // ─── Biographical Scalars (text/int4) ───
// //         alignment: draft.alignment as any, // Cast to exact enum
// //         gender: draft.gender,
// //         eyes: draft.eyes,
// //         size: draft.size,
// //         height: draft.height,
// //         age: parseInt(draft.age), // Formal cast from string to int4
// //         faith: draft.faith,
// //         skin: draft.skin,
// //         background: draft.background,

// //         // ─── Trait Arrays (_text) ───
// //         personality_traits: draft.traits,
// //         bonds: draft.bonds,
// //         ideals: draft.ideals,
// //         flaws: draft.flaws,

// //         // ─── Wealth Scalars (int4) ───
// //         gold: draft.wealth.gp,
// //         silver: draft.wealth.sp,
// //         copper: draft.wealth.cp,
// //     };

import { CharacterDraftState } from "@/app/character-creation";

// ─── Formal Domain Restrictions ──────────────────────────────────────────────

export type Alignment =
    | "lawful_good" | "neutral_good" | "chaotic_good"
    | "lawful_neutral" | "true_neutral" | "chaotic_neutral"
    | "lawful_evil" | "neutral_evil" | "chaotic_evil";

export type AbilityScoreEnum = "STR" | "DEX" | "CON" | "INT" | "WIS" | "CHA";

// Note: Ensure these perfectly match your Postgres _skill_name enum
export type SkillEnum =
    | "Acrobatics"
    | "Animal Handling"
    | "Arcana"
    | "Athletics"
    | "Deception"
    | "History"
    | "Insight"
    | "Intimidation"
    | "Investigation"
    | "Medicine"
    | "Nature"
    | "Perception"
    | "Performance"
    | "Persuasion"
    | "Religion"
    | "Sleight of Hand"
    | "Stealth"
    | "Survival";
// ─── Data Transfer Object ────────────────────────────────────────────────────

export interface CharacterDTO {
    user_id: string;
    race_id: string;
    class_id: string;
    subclass_id?: string;

    name: string;
    photo_url?: string | null;

    // Core Attributes
    str_score: number;
    dex_score: number;
    con_score: number;
    int_score: number;
    wis_score: number;
    cha_score: number;

    // ─── Vector Subsets (The Error Origin) ───
    proficient_saves: AbilityScoreEnum[]; // Formally restricted from string[]
    proficient_skills: SkillEnum[];       // Formally restricted from string[]
    // ─────────────────────────────────────────

    // Combat Matrix
    hp_current: number;
    hp_max: number;
    hp_temp: number;
    proficiency_bonus: number;
    armor_class: number;
    inspiration: number;
    initiative: number;
    speed: number;

    // Progression 
    level: number;
    experience: number;

    // Biographical Geometry
    alignment: Alignment
    gender: string;
    eyes: string;
    size: string;
    height: string;
    age: number;
    faith: string;
    skin: string;
    background: string;

    // Personality Vectors
    personality_traits: string[];
    bonds: string[];
    ideals: string[];
    flaws: string[];

    // Economic State
    gold: number;
    silver: number;
    copper: number;
}

// ─── Transformation Matrix ───────────────────────────────────────────────────

export function mapDraftToDTO(draft: CharacterDraftState, userId: string): CharacterDTO {
    // Structural invariant checks
    if (!draft.classId) throw new Error("Validation Fault: classId is required.");
    if (!draft.raceId) throw new Error("Validation Fault: raceId is required.");

    return {
        user_id: userId,
        race_id: draft.raceId,
        class_id: draft.classId,
        name: draft.name,

        str_score: draft.abilityScores.str,
        dex_score: draft.abilityScores.dex,
        con_score: draft.abilityScores.con,
        int_score: draft.abilityScores.int,
        wis_score: draft.abilityScores.wis,
        cha_score: draft.abilityScores.cha,

        hp_max: draft.combatStats.hp,
        hp_current: draft.combatStats.hp,
        hp_temp: 0,
        armor_class: draft.combatStats.ac,
        initiative: draft.combatStats.initiative,
        speed: draft.combatStats.speed,

        level: 1,
        experience: 0,
        proficiency_bonus: 2,
        inspiration: 0,

        age: parseInt(draft.age, 10) || 0,
        alignment: (draft.alignment as Alignment) || "true_neutral",
        gender: draft.gender,
        eyes: draft.eyes,
        size: draft.size,
        height: draft.height,
        faith: draft.faith,
        skin: draft.skin,
        background: draft.background,

        // ─── Downcasting vectors to strict domain sets ───
        proficient_skills: draft.skills as SkillEnum[],
        proficient_saves: [] as AbilityScoreEnum[],
        // ─────────────────────────────────────────────────

        personality_traits: draft.traits,
        bonds: draft.bonds,
        ideals: draft.ideals,
        flaws: draft.flaws,

        gold: draft.wealth.gp,
        silver: draft.wealth.sp,
        copper: draft.wealth.cp,
    };
}