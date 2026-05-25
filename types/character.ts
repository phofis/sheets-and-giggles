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