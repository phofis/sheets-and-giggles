import type { CharacterPatch } from "@/hooks/data/useUpdateCharacter";
import type { AbilityKey } from "@/types/character";
import type { Database } from "@/types/supabase";

type SkillName = Database["public"]["Enums"]["skill_name"];

const ABILITY_SCORE_COLUMN: Record<AbilityKey, keyof CharacterPatch> = {
    STR: "str_score",
    DEX: "dex_score",
    CON: "con_score",
    INT: "int_score",
    WIS: "wis_score",
    CHA: "cha_score",
};

const BIOMETRIC_COLUMN: Record<string, keyof CharacterPatch> = {
    alignment: "alignment",
    gender: "gender",
    eyes: "eyes",
    size: "size",
    height: "height",
    age: "age",
    faith: "faith",
    skin: "skin",
};

export type TraitArrayField =
    | "personality_traits"
    | "ideals"
    | "bonds"
    | "flaws";

export function abilityScorePatch(key: AbilityKey, score: number): CharacterPatch {
    return { [ABILITY_SCORE_COLUMN[key]]: score };
}

export function biometricPatch(label: string, value: string): CharacterPatch {
    const column = BIOMETRIC_COLUMN[label.toLowerCase()];
    if (!column) {
        throw new Error(`Unknown biometric field: ${label}`);
    }
    if (column === "age") {
        const parsed = parseInt(value, 10);
        if (Number.isNaN(parsed)) {
            throw new Error("Age must be a number");
        }
        return { age: parsed };
    }
    return { [column]: value };
}

export function traitArrayPatch(
    field: TraitArrayField,
    items: string[],
    index: number,
    text: string,
): CharacterPatch {
    const next = [...items];
    next[index] = text;
    return { [field]: next };
}

export function toggleProficientSave(
    current: AbilityKey[],
    key: AbilityKey,
): CharacterPatch {
    const next = current.includes(key)
        ? current.filter((k) => k !== key)
        : [...current, key];
    return { proficient_saves: next };
}

export function toggleProficientSkill(
    current: SkillName[],
    skill: SkillName,
): CharacterPatch {
    const next = current.includes(skill)
        ? current.filter((s) => s !== skill)
        : [...current, skill];
    return { proficient_skills: next };
}
