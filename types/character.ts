import { Database } from "@/types/supabase";
import { ListItem } from "@/types/lists";
import { BoxListItem } from "@/components/themed";
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

export interface SavingThrow extends ListItem {
    key: AbilityKey;
    label: string;
    value: string; // formatted string, e.g., +5
    highlight?: boolean; // indicate proficiency
}

export interface ClassFeature extends BoxListItem {
    id: string;
    requiredLevel: number;
}

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

export interface CharacterValues {
    background: string,
    personalityTraits: string[],
    ideals: string[],
    bonds: string[],
    flaws: string[]

}

import { CharacterDraftState } from "@/app/character-creation";

export type CharacterInsertDTO = Database["public"]["Tables"]["characters"]["Insert"];

/**
 * Transforms the local frontend state matrix into the formalized relational schema.
 * Complexity: O(1) attribute mapping with scalar type enforcement.
 */
export function mapDraftToDTO(draft: CharacterDraftState, userId: string): CharacterInsertDTO {
    return {
        user_id: userId,
        race_id: draft.raceId,
        class_id: draft.classId,
        subclass_id: null, // Assign if your wizard captures this
        name: draft.name,

        // ─── Flattened Ability Scores (int2) ───
        str_score: draft.abilityScores.str,
        dex_score: draft.abilityScores.dex,
        con_score: draft.abilityScores.con,
        int_score: draft.abilityScores.int,
        wis_score: draft.abilityScores.wis,
        cha_score: draft.abilityScores.cha,

        // ─── Flattened Combat Stats (int2/int4) ───
        hp_current: draft.combatStats.hp,
        hp_max: draft.combatStats.hp,
        hp_temp: 0,
        armor_class: draft.combatStats.ac,
        initiative: draft.combatStats.initiative,
        speed: draft.combatStats.speed,

        // Base numerical constants for initialization
        level: 1,
        experience: 0,
        inspiration: 0,
        proficiency_bonus: 2,

        // ─── Arrays and Enums ───
        // proficient_skills: draft.skills, // Maps to _skill_name array

        // ─── Biographical Scalars (text/int4) ───
        alignment: draft.alignment as any, // Cast to exact enum
        gender: draft.gender,
        eyes: draft.eyes,
        size: draft.size,
        height: draft.height,
        age: parseInt(draft.age), // Formal cast from string to int4
        faith: draft.faith,
        skin: draft.skin,
        background: draft.background,

        // ─── Trait Arrays (_text) ───
        personality_traits: draft.traits,
        bonds: draft.bonds,
        ideals: draft.ideals,
        flaws: draft.flaws,

        // ─── Wealth Scalars (int4) ───
        gold: draft.wealth.gp,
        silver: draft.wealth.sp,
        copper: draft.wealth.cp,
    };
}