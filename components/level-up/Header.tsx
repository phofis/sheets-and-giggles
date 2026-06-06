import React from "react";
import { TouchableOpacity, View } from "react-native";
import { ThemedText } from "@/components/themed";
import { useStyles } from "@/hooks/useStyles";

interface HeaderProps {
    onBack: () => void;
    title?: string;
}

export function Header({ onBack, title = "Level Up" }: HeaderProps) {
    const { styles } = useStyles((t, c) => ({
        headerContainer: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: t.spacing.md,
            position: "relative",
        },
        backButton: {
            position: "absolute",
            left: 0,
            padding: t.spacing.sm,
            zIndex: 1,
        },
        title: {
            fontSize: 24,
            fontWeight: "bold",
            color: c("palette.tertiary"),
        }
    }));

    return (
        <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
                <ThemedText color="text.muted" style={{ fontSize: 20 }}>←</ThemedText>
            </TouchableOpacity>
            <ThemedText style={styles.title}>{title}</ThemedText>
        </View>
    );
}