import { View, TouchableOpacity } from "react-native";
import { ThemedText, ThemedView } from "@/components/themed";
import { useStyles } from "@/hooks/useStyles";

const MAX_SLOTS = 3;

interface attunementProps {
    attunement_list?: string[];
}

export function Attunement({ attunement_list = [] }: attunementProps) {
    const { styles } = useStyles((t, c) => ({
        card: {
            padding: t.spacing.md,
            minHeight: 180,
            justifyContent: "flex-start",
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
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: t.spacing.sm,
            paddingHorizontal: t.spacing.md,
            borderRadius: t.borderRadius.md,
            backgroundColor: c("surface.surfaceElevated"),
            width: "80%",
            alignSelf: "center",
        },

        emptySlot: {
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: t.spacing.sm,
            paddingHorizontal: t.spacing.md,
            borderRadius: t.borderRadius.md,
            backgroundColor: c("surface.surfaceElevated"),
            width: "10%",
            alignSelf: "center",
            opacity: 0.6,
        },
        plus: {
            fontSize: 20,
            fontWeight: "700",
            alignSelf: "center",
        },
    }));

    const slots = Array.from(
        { length: MAX_SLOTS },
        (_, i) => attunement_list[i],
    );

    return (
        <ThemedView style={styles.card}>
            <View style={styles.header}>
                <ThemedText color="text.muted" variant="label">
                    ATTUNEMENT
                </ThemedText>
                <ThemedText color="text.body" variant="body">
                    {attunement_list.length} / {MAX_SLOTS} Slots
                </ThemedText>
            </View>

            <View style={styles.list}>
                {slots.map((item, index) =>
                    item ? (
                        <View key={index} style={styles.entry}>
                            <ThemedText color="text.body" variant="body">
                                {item}
                            </ThemedText>
                        </View>
                    ) : (
                        <View key={index} style={styles.emptySlot}>
                            <ThemedText color="text.muted" style={styles.plus}>
                                +
                            </ThemedText>
                        </View>
                    ),
                )}
            </View>
        </ThemedView>
    );
}
