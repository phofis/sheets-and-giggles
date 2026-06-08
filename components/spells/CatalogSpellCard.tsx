import { Pressable } from "react-native";
import { Plus } from "lucide-react-native";
import { useStyles } from "@/hooks/useStyles";
import { ThemedText } from "../themed/ThemedText";
import { ThemedView } from "../themed/ThemedView";
import { CollapsibleCard } from "@/components/CollapsibleCard";
import { ShortSpellCard } from "./ShortSpellCard";
import { LongSpellCard } from "./LongSpellCard";
import type { CharacterSpellWithDetails } from "@/hooks/data/useCharacterSpells";
import type { Database } from "@/types/supabase";

type SpellRow = Database["public"]["Tables"]["spells"]["Row"];

function toDisplaySpell(spell: SpellRow, characterId: string): CharacterSpellWithDetails {
    return {
        character_id: characterId,
        spell_id: spell.id,
        prepared: false,
        always_prepared: false,
        created_at: "",
        updated_at: "",
        spells: spell,
    };
}

type CatalogSpellCardProps = {
    spell: SpellRow;
    characterId: string;
    isLearned: boolean;
    onAdd: () => void;
};

export function CatalogSpellCard({
    spell,
    characterId,
    isLearned,
    onAdd,
}: CatalogSpellCardProps) {
    const displaySpell = toDisplaySpell(spell, characterId);
    const { styles, color } = useStyles((t, c) => ({
        card: {
            marginBottom: t.spacing.xs,
            width: "95%",
            alignSelf: "center",
        },
        titleRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: t.spacing.sm,
            marginBottom: t.spacing.sm,
        },
        titleBlock: {
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: t.spacing.sm,
        },
        title: {
            flex: 1,
            fontSize: 18,
        },
        level: {
            fontSize: 12,
        },
        addButton: {
            width: 36,
            height: 36,
            borderRadius: t.borderRadius.xl,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: c("surface.surfaceElevated"),
        },
        addButtonDisabled: {
            opacity: 0.45,
        },
    }));

    const header = (
        <ThemedView style={styles.titleRow}>
            <ThemedView style={styles.titleBlock}>
                <ThemedText color="text.heading" style={styles.title} variant="label">
                    {spell.name}
                </ThemedText>
                <ThemedText color="text.muted" style={styles.level} variant="body">
                    Level {spell.level}
                </ThemedText>
            </ThemedView>
            <Pressable
                disabled={isLearned}
                style={[styles.addButton, isLearned && styles.addButtonDisabled]}
                onPress={(event) => {
                    event.stopPropagation();
                    onAdd();
                }}
            >
                <Plus
                    color={color(isLearned ? "text.muted" : "text.body")}
                    size={18}
                />
            </Pressable>
        </ThemedView>
    );

    return (
        <CollapsibleCard
            fullContent={<LongSpellCard spell={displaySpell} />}
            glowColor="card.softGlow"
            header={header}
            shortContent={<ShortSpellCard spell={displaySpell} />}
            style={styles.card}
        />
    );
}
