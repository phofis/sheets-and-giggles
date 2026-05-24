import { ListItem} from "./lists";
import { BoxListItem } from "@/components/themed";
import { Database } from "@/types/supabase";
// TODO: modify if necessary
export type AbilityKey = "STR" | "DEX" | "CON" | "INT" | "WIS" | "CHA";

export interface AbilityValue {
    score: number;
    mod: string;
}

export type AbilityScores = Record<AbilityKey, AbilityValue>;

export interface AbilityLabel {
    key: AbilityKey;
    label: string;
}

export interface SavingThrow extends ListItem {
    key: AbilityKey;
    label: string;
    value: string; // formatted string, e.g., +5
    highlight?: boolean; // indicate proficiency
}

export interface ClassFeature extends BoxListItem{
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