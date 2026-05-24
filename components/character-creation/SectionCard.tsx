import React from "react";
import { View, Text } from "react-native";
import { ThemedText } from "@/components/themed";
import { useStyles } from "@/hooks/useStyles";

interface SectionCardProps {
    title: string;
    iconLigature: string;
    children: React.ReactNode;
    iconColor: string;
}

export const SectionCard: React.FC<SectionCardProps> = ({
    title,
    iconLigature,
    children,
    iconColor
}) => {
    const { styles } = useStyles((t, c) => ({
        card: {
            backgroundColor: "transparent", // Appears transparent/dark in the screenshot
            // borderRadius: t.radii.lg,
            borderWidth: 1,
            borderColor: "rgba(255, 255, 255, 0.15)", // Subtle border
            padding: t.spacing.lg,
            marginBottom: t.spacing.lg,
        },
        headerRow: {
            flexDirection: "row",
            alignItems: "center",
            gap: t.spacing.sm,
            marginBottom: t.spacing.lg,
        },
        icon: {
            fontFamily: "Material Icons",
            fontSize: 24,
            color: iconColor,
        },
        title: {
            fontSize: 18,
            fontWeight: "bold",
            color: c("text.heading"),
        }
    }));

    return (
        <View style={styles.card}>
            <View style={styles.headerRow}>
                <Text style={styles.icon}>{iconLigature}</Text>
                <Text style={styles.title}>{title}</Text>
            </View>
            {children}
        </View>
    );
};