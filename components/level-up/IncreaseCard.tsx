import React from "react";
import { View, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/themed";
import { useStyles } from "@/hooks/useStyles";

interface IncreaseCardProps {
    value: number;
    onIncrease: () => void;
    onDecrease: () => void;
}

export function IncreaseCard({ value, onIncrease, onDecrease }: IncreaseCardProps) {
    const { styles } = useStyles((t, c) => ({
        card: {
            backgroundColor: c("card.background") || "#1e1e2e",
            borderRadius: t.spacing.md,
            padding: t.spacing.lg,
            borderWidth: 1,
            borderColor: c("card.note") || "#313244",
        },
        title: {
            fontSize: 16,
            fontWeight: "bold",
            marginBottom: t.spacing.xs,
            color: c("card.header") || "#cdd6f4",
        },
        description: {
            fontSize: 14,
            color: c("text.muted") || "#a6adc8",
            marginBottom: t.spacing.lg,
            lineHeight: 20,
        },
        controlsContainer: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: c("surface.surfaceElevated") || "#181825",
            borderRadius: 8,
            alignSelf: "flex-start",
            padding: 4,
            width: 140,
        },
        button: {
            padding: t.spacing.sm,
            backgroundColor: c("surface.overlay") || "#11111b",
            borderRadius: 6,
            width: 36,
            alignItems: "center",
            justifyContent: "center",
        },
        buttonText: {
            color: c("text.onPrimary") || "#cdd6f4",
            fontSize: 16,
            fontWeight: "bold",
        },
        valueText: {
            fontSize: 20,
            fontWeight: "bold",
            color: c("text.muted") || "#cdd6f4",
        }
    }));

    return (
        <View style={styles.card}>
            <ThemedText style={styles.title}>Max HP Increase</ThemedText>
            <ThemedText style={styles.description}>
                Adjust your new maximum hit points manually or accept the average.
            </ThemedText>
            <View style={styles.controlsContainer}>
                <TouchableOpacity style={styles.button} onPress={onDecrease}>
                    <ThemedText style={styles.buttonText}>-</ThemedText>
                </TouchableOpacity>
                <ThemedText style={styles.valueText}>{value}</ThemedText>
                <TouchableOpacity style={styles.button} onPress={onIncrease}>
                    <ThemedText style={styles.buttonText}>+</ThemedText>
                </TouchableOpacity>
            </View>
        </View>
    );
}