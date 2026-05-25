import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/auth";
import { BiometricEntry, CharacterHeader } from "@/types/character";
import { BoxListItem } from "@/components/themed";

export type Characteristics = {
    characterHeader: CharacterHeader;
    biometrics: BiometricEntry[];
    background: string;
    traits: BoxListItem[];
    ideals: BoxListItem[];
    bonds: BoxListItem[];
    flaws: BoxListItem[];
};

export function useCharacteristics(character_id: string) {
    const { user } = useAuth();

    return useQuery<Characteristics>({
        queryKey: ["characteristics", character_id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("characters")
                .select("*, classes(name)")
                .eq("user_id", user!.id)
                .eq("id", character_id)
                .single();

            if (error) throw error;

            return {
                characterHeader: {
                    name: data.name,
                    level: data.level,
                    class: data.classes.name,
                    inspiration: data.inspiration
                },
                biometrics: [
                    {value: data.alignment, label: "alignment"},
                    {value: data.gender, label: "gender"},
                    {value: data.eyes, label: "eyes"},
                    {value: data.size, label: "size"},
                    {value: data.height, label: "height"},
                    {value: data.age.toString(), label: "age"},
                    {value: data.faith, label: "faith"},
                    {value: data.skin, label: "skin"}
                ],
                background: data.background,
                traits: data.personality_traits.map(item =>
                    ({
                        title: "",
                        description: item,
                        accentColor: true,
                    })),
                ideals: data.ideals.map(item =>
                    ({
                        title: "",
                        description: item,
                        accentColor: true,
                    })),
                bonds: data.bonds.map(item =>
                    ({
                        title: "",
                        description: item,
                        accentColor: true,
                    })),
                flaws: data.flaws.map(item =>
                ({
                    title: "",
                    description: item,
                    accentColor: true,
                })),
            }
        }
    });
}