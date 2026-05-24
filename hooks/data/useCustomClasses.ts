import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

// ─── Types ───────────────────────────────────────────────────────────────────
export interface ClassProjection {
    id: string;
    name: string;
    shortDescription: string;
}

// ─── Mock Data ───────────────────────────────────────────────────────────────
const MOCK_CUSTOM_CLASSES: ClassProjection[] = [
    {
        id: "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
        name: "Blood Hunter",
        shortDescription: "A martial specialist who harnesses forbidden blood magic to hunt evil.",
    },
    {
        id: "b2c3d4e5-f6a7-8901-2345-6789abcdef01",
        name: "Mystic",
        shortDescription: "A complex savant of psionic power and mental manipulation.",
    },
    {
        id: "c3d4e5f6-a7b8-9012-3456-789abcdef012",
        name: "Warlord",
        shortDescription: "A tactical commander who empowers allies through battlefield strategy.",

    }
];

// ─── Hook ────────────────────────────────────────────────────────────────────

const FIVE_MINUTES_MS = 5 * 60 * 1000;
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

export const useCustomClasses = () => {
    return useQuery<ClassProjection[], Error>({
        queryKey: ["catalog", "custom_classes"],
        queryFn: async () => {
            // Added short_description to the selection tensor
            const { data, error } = await supabase
                .from("classes")
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

            // Project the SQL row into the TypeScript interface mapping
            const fetchedClasses = data ? data.map((row: any) => ({
                id: row.id,
                name: row.name,
                shortDescription: row.short_description ?? "",
                displayName: row.users?.display_name ?? "Unknown",
            })) : [];

            return [...fetchedClasses, ...MOCK_CUSTOM_CLASSES];
        },
        staleTime: FIVE_MINUTES_MS,
    });
};

export const useOfficialClasses = () => {
    return useQuery<ClassProjection[], Error>({
        queryKey: ["catalog", "official_classes"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("classes")
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
        staleTime: TWENTY_FOUR_HOURS_MS,
    });
};