import { View } from "react-native";
import { ThemedText, ThemedView } from "@/components/themed";
import { useStyles } from "@/hooks/useStyles";

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

    return (
        <ThemedView style={styles.card}>
            {/* header moved inside elevated area */}
            <ThemedText
                color="text.muted"
                variant="label"
                style={styles.header}
            >
                TREASURY
            </ThemedText>

            <View style={styles.currencyRow}>
                <View style={styles.currencyItem}>
                    <ThemedText
                        color="text.heading"
                        style={styles.currencyValue}
                    >
                        1,240
                    </ThemedText>
                    <ThemedText
                        color="text.muted"
                        variant="body"
                        style={styles.currencyUnit}
                    >
                        GP
                    </ThemedText>
                </View>

                <View style={styles.currencyItem}>
                    <ThemedText
                        color="text.heading"
                        style={styles.currencyValue}
                    >
                        85
                    </ThemedText>
                    <ThemedText
                        color="text.muted"
                        variant="body"
                        style={styles.currencyUnit}
                    >
                        SP
                    </ThemedText>
                </View>

                <View style={styles.currencyItem}>
                    <ThemedText
                        color="text.heading"
                        style={styles.currencyValue}
                    >
                        12
                    </ThemedText>
                    <ThemedText
                        color="text.muted"
                        variant="body"
                        style={styles.currencyUnit}
                    >
                        CP
                    </ThemedText>
                </View>
            </View>
        </ThemedView>
    );
}