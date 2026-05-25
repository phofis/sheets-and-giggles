import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/auth";
import { CharacterHeader } from "@/types/character";

export type CharacterSheet = {
    characterHeader: CharacterHeader;
    
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

            return {
                characterHeader: {
                    name: data.name,
                    level: data.level,
                    class: data.classes.name,
                    inspiration: data.inspiration
                },
                
            }
        }
    });
}