import React from "react";
import { TouchableOpacity, View } from "react-native";
import { ThemedText } from "@/components/themed";
import { useStyles } from "@/hooks/useStyles";

// ─── Formal Type Boundaries ──────────────────────────────────────────────────
export interface SelectableItem {
    id: string;
    name: string;
    description: string;
}

interface SelectableItemCardProps {
    item: SelectableItem;
    isSelected: boolean;
    onPress: () => void;
}

export function SelectableItemCard({ item, isSelected, onPress }: SelectableItemCardProps) {
    // 1. Static Dictionary: Zero state-dependent logic (no `isSelected` checks here)
    const { styles } = useStyles((t, c) => ({
        // Color definitions mapped to explicit style properties for inline extraction
        activeColor: { color: c("palette.secondary") || "#f9e2af" },
        inactiveBorder: { color: c("surface.surface") || "#313244" },
        inactiveText: { color: c("text.muted") || "#a6adc8" },
        defaultTitle: { color: c("text.onPrimary") || "#cdd6f4" },

        // Base structural definitions
        cardBase: {
            padding: t.spacing.lg,
            borderRadius: t.spacing.md,
            backgroundColor: c("surface.surface") || "#1e1e2e",
            marginBottom: t.spacing.md,
            flexDirection: "row",
            borderWidth: 1, // Explicitly defined so borderColor application works
        },
        cardActiveShadow: {
            shadowColor: c("palette.secondary") || "#f9e2af",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 6,
        },
        contentContainer: {
            flex: 1,
            paddingRight: t.spacing.md,
        },
        titleBase: {
            fontSize: 16,
            fontWeight: "bold",
            marginBottom: t.spacing.xs,
        },
        description: {
            fontSize: 14,
            color: c("text.muted") || "#a6adc8",
            lineHeight: 20,
        },
        indicatorContainer: {
            justifyContent: "flex-start",
            paddingTop: t.spacing.xs,
        },
        radioOuterBase: {
            height: 20,
            width: 20,
            borderRadius: 10,
            borderWidth: 2,
            justifyContent: "center",
            alignItems: "center",
        },
        radioInner: {
            color: c("surface.surface") || "#1e1e2e",
            fontSize: 12,
            fontWeight: "bold",
            lineHeight: 14,
        }
    }));

    // 2. Render Pipeline: Dynamic state resolution via array-style composition
    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPress}
            style={[
                styles.cardBase,
                isSelected && styles.cardActiveShadow,
                {
                    borderColor: isSelected
                        ? styles.activeColor.color
                        : styles.inactiveBorder.color,
                },
            ]}
        >
            <View style={styles.contentContainer}>
                <ThemedText
                    style={[
                        styles.titleBase,
                        {
                            color: isSelected
                                ? styles.activeColor.color
                                : styles.defaultTitle.color
                        }
                    ]}
                >
                    {item.name}
                </ThemedText>

                <ThemedText style={styles.description}>
                    {item.description}
                </ThemedText>
            </View>

            <View style={styles.indicatorContainer}>
                <View
                    style={[
                        styles.radioOuterBase,
                        {
                            borderColor: isSelected
                                ? styles.activeColor.color
                                : styles.inactiveText.color,
                            backgroundColor: isSelected
                                ? styles.activeColor.color
                                : "transparent",
                        }
                    ]}
                >
                    {isSelected && <ThemedText style={styles.radioInner}>✓</ThemedText>}
                </View>
            </View>
        </TouchableOpacity>
    );
}