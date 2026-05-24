import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

// ─── Types ───────────────────────────────────────────────────────────────────
export interface RaceProjection {
    id: string;
    name: string;
    shortDescription: string;
}

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

// ─── Mock Data ───────────────────────────────────────────────────────────────
const MOCK_CUSTOM_RACES: RaceProjection[] = [
    {
        id: "d9b2d63d-a233-4123-8478-31584288f6c4",
        name: "Astral Elf",
        shortDescription: "Beings of starlight and cosmic magic who traverse the astral plane.",

    },
    {
        id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        name: "Ironforged Dwarf",
        shortDescription: "Dwarves imbued with mechanical and metallic enhancements from birth.",

    },
    {
        id: "550e8400-e29b-41d4-a716-446655440000",
        name: "Lupine",
        shortDescription: "A fierce, wolf-like humanoid race with deep ties to primal wilderness.",
    }
];

// ─── Hook ────────────────────────────────────────────────────────────────────

const FIVE_MINUTES_MS = 5 * 60 * 1000;

export const useCustomRaces = () => {
    return useQuery<RaceProjection[], Error>({
        queryKey: ["catalog", "custom_races"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("races")
                .select(`
                    id,
                    name,
                    short_description,
                    users:created_by_user_id ( display_name )
                `)
                .eq("is_official", false);

            if (error) {
                throw new Error(`Supabase query failed: ${error.message}`);
            }

            const fetchedRaces = data ? data.map((row: any) => ({
                id: row.id,
                name: row.name,
                shortDescription: row.short_description ?? "",
                displayName: row.users?.display_name ?? "Unknown",
            })) : [];

            return [...fetchedRaces, ...MOCK_CUSTOM_RACES];
        },
        staleTime: FIVE_MINUTES_MS,
    });
};

export const useOfficialRaces = () => {
    return useQuery<RaceProjection[], Error>({
        queryKey: ["catalog", "official_races"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("races")
                .select("id, name, short_description")
                .eq("is_official", true);

            if (error) {
                throw new Error(`Supabase query failed: ${error.message}`);
            }

            if (!data) {
                return [];
            }

            return data.map((row: any) => ({
                id: row.id,
                name: row.name,
                shortDescription: row.short_description ?? "",
            }));
        },
        // Official catalog data is highly deterministic and static; 
        // caching duration is extended to 24 hours to minimize network vectors.
        staleTime: TWENTY_FOUR_HOURS_MS,
    });
};