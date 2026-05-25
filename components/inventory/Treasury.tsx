import { View } from "react-native";
import { ThemedText, ThemedView } from "@/components/themed";
import { useStyles } from "@/hooks/useStyles";
import { useCharacter } from "@/hooks/data";
const characterId = "a1b2c3d4-e5f6-4789-a012-3456789abcde"; //get from context instead

export function Treasury() {
    const { styles } = useStyles((t, c) => ({
        card: {
            marginTop: t.spacing.xxl,
            padding: t.spacing.md,
            minHeight: 120,
            justifyContent: "space-between",
            height: "auto",
            backgroundColor: c("card.background"),
            borderRadius: t.borderRadius.md,
        },
        header: {
            marginBottom: t.spacing.sm,
            letterSpacing: 1,
        },
        currencyRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            gap: t.spacing.md,
        },
        currencyItem: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
        },
        currencyValue: {
            fontSize: 26,
            fontWeight: "700",
        },
        currencyUnit: {
            marginTop: t.spacing.xs,
            letterSpacing: 1,
        },
    }));
    const { data: character, isLoading } = useCharacter(characterId);
    if (isLoading) {
    }
    const money = [
        { key: "gold", label: "GP" },
        { key: "silver", label: "SP" },
        { key: "copper", label: "CP" },
    ] as const;

    return (
        <ThemedView style={styles.card}>
            {/* header moved inside elevated area */}
            <ThemedText
                color="text.muted"
                style={styles.header}
                variant="label"
            >
                TREASURY
            </ThemedText>

            <View style={styles.currencyRow}>
                {money.map((c) => (
                    <View key={c.key} style={styles.currencyItem}>
                        <ThemedText
                            color="text.heading"
                            style={styles.currencyValue}
                        >
                            {character?.[c.key] ?? 0}
                        </ThemedText>

                        <ThemedText
                            color="text.muted"
                            style={styles.currencyUnit}
                            variant="body"
                        >
                            {c.label}
                        </ThemedText>
                    </View>
                ))}
            </View>
        </ThemedView>
    );
}
