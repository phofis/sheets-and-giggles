import { View } from "react-native";
import { ThemedText, ThemedView } from "@/components/themed";
import { useStyles } from "@/hooks/useStyles";

const attunementItems = [
    { name: "Sunblade"},
    { name: "Amulet of Health"},
];

export function Attunement() {
    const { styles } = useStyles((t, c) => ({
        card: {
            padding: t.spacing.md,
            minHeight: 180,
            justifyContent: "flex-start",
            height: "auto",
            backgroundColor: c("card.background"),
            borderRadius: t.borderRadius.md,
        },
        header: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: t.spacing.md,
        },
        list: {
            gap: t.spacing.sm,
        },
        entry: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: t.spacing.sm,
            paddingHorizontal: t.spacing.md,
            borderRadius: t.borderRadius.md,
            backgroundColor: c("surface.surfaceElevated"),
            width: "80%",
            alignSelf: "flex-start",

        },
        emptySlot: {
            paddingVertical: t.spacing.sm,
            paddingHorizontal: t.spacing.md,
            borderRadius: t.borderRadius.md,
            backgroundColor: c("surface.surfaceElevated"),
        },
    }));

    return (
        <ThemedView style={styles.card}>
            {/* HEADER moved inside elevated area */}
            <View style={styles.header}>
                <ThemedText color="text.muted" variant="label">
                    ATTUNEMENT
                </ThemedText>
                <ThemedText color="text.body" variant="body">
                    2 / 3 Slots
                </ThemedText>
            </View>

            <View style={styles.list}>
                {attunementItems.map((item) => (
                    <View key={item.name} style={styles.entry}>
                        <ThemedText color="text.body" variant="body">
                            {item.name}
                        </ThemedText>
                    </View>
                ))}

                <View style={styles.entry}>
                    <ThemedText color="text.muted" variant="body">
                        Empty Slot
                    </ThemedText>
                </View>
            </View>
        </ThemedView>
    );
}