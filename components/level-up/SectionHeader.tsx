import React from "react";
import { View } from "react-native";
import { ThemedText } from "@/components/themed";
import { useStyles } from "@/hooks/useStyles";

interface SectionHeaderProps {
    title: string;
    badgeText?: string;
    badgeType?: "warning" | "error" | "default";
}

export function SectionHeader({ title, badgeText, badgeType = "default" }: SectionHeaderProps) {
    const { styles } = useStyles((t, c) => ({
        container: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: t.spacing.xl,
            marginBottom: t.spacing.md,
        },
        title: {
            fontSize: 18,
            fontWeight: "bold",
            color: c("palette.tertiary") || "#cba6f7",
        },
        badge: {
            borderWidth: 1,
            borderColor: badgeType === "warning" ? c("semantic.warning") : badgeType === "error" ? c("semantic.error") : c("text.muted"),
            borderRadius: 16,
            paddingHorizontal: 10,
            paddingVertical: 2,
        },
        badgeText: {
            fontSize: 12,
            color: badgeType === "warning" ? "#f9e2af" : badgeType === "error" ? "#f38ba8" : "#a6adc8",
        }
    }));

    return (
        <View style={styles.container}>
            <ThemedText style={styles.title}>{title}</ThemedText>
            {badgeText && (
                <View style={styles.badge}>
                    <ThemedText style={styles.badgeText}>{badgeText}</ThemedText>
                </View>
            )}
        </View>
    );
}