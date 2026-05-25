import { ThemedHeadline, ThemedView, SpellCard } from "@/components/themed";
import { SpellSlots } from "@/components/spells/SpellSlots";
import { useStyles } from "@/hooks/useStyles";
import { useCharacterSpells } from "@/hooks/data/useCharacterSpells";
import { ScrollView } from "react-native";
//TODO: get from context instead
const characterId = "a1b2c3d4-e5f6-4789-a012-3456789abcde";
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

    const { data: spells, isLoading } = useCharacterSpells(characterId); 
    if (isLoading) {
    }
    //TODO: add toolbar and button definition 
    
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
