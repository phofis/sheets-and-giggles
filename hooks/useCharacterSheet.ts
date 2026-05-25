import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/auth";
import { AbilityKey, AbilityScores, CharacterHeader } from "@/types/character";
import { ListItem, ListEntry } from "@/types/lists";
import { Enums } from "@/types/supabase";

type SkillName = Enums<"skill_name">;

const ABILITY_SCORE_COLUMNS: { key: AbilityKey; column: string; label: string }[] = [
    { key: "STR", column: "str_score", label: "Strength" },
    { key: "DEX", column: "dex_score", label: "Dexterity" },
    { key: "CON", column: "con_score", label: "Constitution" },
    { key: "INT", column: "int_score", label: "Intelligence" },
    { key: "WIS", column: "wis_score", label: "Wisdom" },
    { key: "CHA", column: "cha_score", label: "Charisma" },
];

const SKILL_ABILITY_MAP: { skill: SkillName; ability: AbilityKey }[] = [
    { skill: "Acrobatics", ability: "DEX" },
    { skill: "Animal Handling", ability: "WIS" },
    { skill: "Arcana", ability: "INT" },
    { skill: "Athletics", ability: "STR" },
    { skill: "Deception", ability: "CHA" },
    { skill: "History", ability: "INT" },
    { skill: "Insight", ability: "WIS" },
    { skill: "Intimidation", ability: "CHA" },
    { skill: "Investigation", ability: "INT" },
    { skill: "Medicine", ability: "WIS" },
    { skill: "Nature", ability: "INT" },
    { skill: "Perception", ability: "WIS" },
    { skill: "Performance", ability: "CHA" },
    { skill: "Persuasion", ability: "CHA" },
    { skill: "Religion", ability: "INT" },
    { skill: "Sleight of Hand", ability: "DEX" },
    { skill: "Stealth", ability: "DEX" },
    { skill: "Survival", ability: "WIS" },
];

function modValue(score: number): number {
    return Math.floor((score - 10) / 2);
}

function formatMod(val: number): string {
    return val >= 0 ? `+${val}` : `${val}`;
}

export type CharacterSheet = {
    characterHeader: CharacterHeader;
    abilities: AbilityScores;
    savingThrows: ListItem[];
    allSkills: ListEntry[];
    proficientSkills: ListEntry[];
};

export function useCharacterSheet(character_id: string) {
    const { user } = useAuth();

    return useQuery<CharacterSheet>({
        queryKey: ["characterSheet", character_id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("characters")
                .select("*, classes(name)")
                .eq("user_id", user!.id)
                .eq("id", character_id)
                .single();

            if (error) throw error;

            const scoreRow: Record<string, number> = {
                str_score: data.str_score,
                dex_score: data.dex_score,
                con_score: data.con_score,
                int_score: data.int_score,
                wis_score: data.wis_score,
                cha_score: data.cha_score,
            };

            const abilities = ABILITY_SCORE_COLUMNS.reduce((acc, { key, column }) => {
                const score = scoreRow[column];
                acc[key] = { score, mod: formatMod(modValue(score)) };
                return acc;
            }, {} as AbilityScores);

            const pb = data.proficiency_bonus;

            const savingThrows: ListItem[] = ABILITY_SCORE_COLUMNS.map(({ key, label }) => {
                const baseMod = modValue(scoreRow[`${key.toLowerCase()}_score`]);
                const isProficient = data.proficient_saves.includes(key);
                return {
                    label,
                    value: formatMod(baseMod + (isProficient ? pb : 0)),
                    highlight: isProficient,
                };
            });

            const allSkills: ListEntry[] = SKILL_ABILITY_MAP.map(({ skill, ability }) => {
                const baseMod = modValue(scoreRow[`${ability.toLowerCase()}_score`]);
                const isProficient = data.proficient_skills.includes(skill);
                return {
                    label: skill,
                    value: formatMod(baseMod + (isProficient ? pb : 0)),
                    state: isProficient ? "active" : "inactive",
                };
            });

            const proficientSkills = allSkills.filter((s) => s.state === "active");

            return {
                characterHeader: {
                    name: data.name,
                    level: data.level,
                    class: data.classes.name,
                    inspiration: data.inspiration,
                },
                abilities,
                savingThrows,
                allSkills,
                proficientSkills,
            };
        },
    });
}