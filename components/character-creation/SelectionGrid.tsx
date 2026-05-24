import React from "react";
import { View, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/themed";
import { useStyles } from "@/hooks/useStyles";

export interface SelectionOption {
    id: string;
    label: string;
    icon: (color: string) => React.ReactNode;
    description?: string
}

interface SelectionGridProps {
    title?: string; // Updated to be optional
    titleIcon?: React.ReactNode;
    options: SelectionOption[];
    selectedValue: string | null;
    onSelect: (id: string) => void;
    accentColor?: "purple" | "yellow";
}

export const SelectionGrid: React.FC<SelectionGridProps> = ({
    title,
    titleIcon,
    options,
    selectedValue,
    onSelect,
    accentColor = "purple",
}) => {
    const { styles, theme } = useStyles((theme, c) => {
        const activeColor = accentColor === "purple" ? c("buttonPrimary.background") : c("palette.secondary");

        return {
            container: {
                marginBottom: theme.spacing.xl,
            },
            headerRow: {
                flexDirection: "row",
                alignItems: "center",
                gap: theme.spacing.sm,
                marginBottom: theme.spacing.lg,
            },
            grid: {
                flexDirection: "row",
                flexWrap: "wrap",
                gap: theme.spacing.md,
                justifyContent: "space-between",
            },
            card: {
                width: "47%",
                aspectRatio: 1,
                backgroundColor: c("card.background"),
                borderRadius: theme.borderRadius.lg,
                alignItems: "center",
                justifyContent: "center",
                gap: theme.spacing.md,
                borderWidth: 1,
                borderColor: "transparent",
            },
            cardActive: {
                borderColor: activeColor,
                shadowColor: activeColor,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.3,
                shadowRadius: 10,
                elevation: 5,
            },
            iconContainer: {
                width: 64,
                height: 64,
                borderRadius: 9999,
                borderWidth: 1,
                borderColor: c("border.strong"),
                backgroundColor: c("surface.overlay"),
                alignItems: "center",
                justifyContent: "center",
                activeColor: c("palette.tertiary"),
                inactiveColor: c("text.muted")
            },
            label: {
                fontWeight: "600",
            },
        };
    });

    // Evaluate if the header row should be mounted in the DOM
    const hasHeader = title !== undefined || titleIcon !== undefined;

    return (
        <View style={styles.container}>
            {/* Conditionally render header row */}
            {hasHeader && (
                <View style={styles.headerRow}>
                    {titleIcon}
                    {title && (
                        <ThemedText color="text.heading" variant="headline">
                            {title}
                        </ThemedText>
                    )}
                </View>
            )}

            <View style={styles.grid}>
                {options.map((option) => {
                    const isActive = selectedValue === option.id;

                    const iconVectorColor = isActive
                        ? styles.iconContainer.activeColor
                        : styles.iconContainer.inactiveColor;
                        
                    return (
                        <TouchableOpacity
                            key={option.id}
                            activeOpacity={0.7}
                            style={[styles.card, isActive && styles.cardActive]}
                            onPress={() => onSelect(option.id)}
                        >
                            <View style={styles.iconContainer}>
                                {option.icon(iconVectorColor)}
                            </View>

                            <ThemedText
                                color={isActive ? "text.note" : "text.muted"}
                                style={styles.label}
                            >
                                {option.label}
                            </ThemedText>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};