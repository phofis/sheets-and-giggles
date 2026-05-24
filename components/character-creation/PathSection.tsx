import React, { useState } from "react";
import { View, TouchableOpacity, Text, LayoutAnimation, UIManager, Platform } from "react-native";
import { ThemedView, ThemedText } from "@/components/themed";
import { useStyles } from "@/hooks/useStyles";
import { SelectionOption } from "./SelectionGrid";

// Enable LayoutAnimation for Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ─── Material Icon Helper ────────────────────────────────────────────────────
const MATERIAL_ICON_STYLE = {
    textAlign: "center",
    fontFamily: "Material Icons",
    fontSize: 20,
    fontStyle: "normal",
    fontWeight: "400",
} as const;

interface PathSectionProps {
    title: string;
    description: string;
    iconRenderer: (color?: string) => React.ReactNode;
    accentColor?: string;
}

export const PathSection: React.FC<PathSectionProps> = ({
    title,
    description,
    iconRenderer,
    accentColor = "#E0E0E0"
}) => {
    const [isOpen, setIsOpen] = useState<boolean>(true);

    const { styles } = useStyles((t, c) => ({
        container: {
            marginBottom: t.spacing.md,
        },
        headerRow: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: t.spacing.sm,
        },
        titleContainer: {
            flexDirection: "row",
            alignItems: "center",
            gap: t.spacing.sm,
        },
        descriptionContainer: {
            paddingLeft: t.spacing.xl,
            paddingRight: t.spacing.sm,
            paddingBottom: t.spacing.sm,
        },
        text: {
            color: c("text.muted")
        },
    }));

    const toggleSection = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsOpen((prev) => !prev);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.headerRow}
                onPress={toggleSection}
                activeOpacity={0.7}
            >
                <View style={styles.titleContainer}>
                    {iconRenderer(accentColor)}
                    <ThemedText style={{ color: accentColor, fontWeight: "600", fontSize: 16 }}>
                        {title}
                    </ThemedText>
                </View>
                <Text style={[{ color: styles.text.color }, MATERIAL_ICON_STYLE]}>
                    {isOpen ? "expand_less" : "expand_more"}
                </Text>
            </TouchableOpacity>

            {isOpen && (
                <View style={styles.descriptionContainer}>
                    <ThemedText color="text.muted" style={{ lineHeight: 22 }}>
                        {description}
                    </ThemedText>
                </View>
            )}
        </View>
    );
};