import { ThemedHeadline, ThemedView, SpellCard } from "@/components/themed";
import { SpellSlots } from "@/components/spells/SpellSlots";
import { useStyles } from "@/hooks/useStyles";
import { useCharacterSpells } from "@/hooks/data/useCharacterSpells";
import { useCharacterId } from "@/context/CharacterIdContext";
import { ScrollView } from "react-native";

// Spells tab intentionally has no page-level edit mode (v1).
export default function SpellsScreen() {
    const { styles } = useStyles((t, c) => ({
        container: { flex: 1, padding: t.spacing.lg },
        scrollContent: { paddingBottom: t.spacing.xxl },
        headline: {
            marginBottom: t.spacing.lg,
            textAlign: "center",
        },
        list: { width: "100%" },
        empty: {
            marginTop: t.spacing.xxxl,
            textAlign: "center",
        },
    }));

    const characterId = useCharacterId();
    const { data: spells, isLoading } = useCharacterSpells(characterId); 
    if (isLoading) {
    }

    return (
        <ThemedView
            backgroundColor="surface.background"
            style={styles.container}
        >
            {/* {isLoading ? (
                <ThemedView style={styles.empty}>
                    <ThemedText color="text.muted" variant="body">
                        Loading spells...
                    </ThemedText>
                </ThemedView>
            ) : spells.length === 0 ? (
                <ThemedView style={styles.empty}>
                    <ThemedText color="text.muted" variant="body">
                        No spells available.
                    </ThemedText>
                </ThemedView>
            ) : ( */}
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <ThemedView style={styles.list}>
                    <SpellSlots />
                    <ThemedHeadline
                        color="text.heading"
                        style={styles.headline}
                    >
                        Your Spells
                    </ThemedHeadline>
                    {(spells ?? []).map((spell) => (
                        <SpellCard key={spell.spell_id} spell={spell} />
                    ))}
                </ThemedView>
            </ScrollView>
            {/* )} } */}
        </ThemedView>
    );
}
