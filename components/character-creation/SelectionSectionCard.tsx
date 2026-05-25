import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useStyles } from "@/hooks/useStyles";

interface SelectionOption {
    id: string;
    label: string;
}

interface SelectionSectionCardProps {
    title: string;
    iconLigature: string;
    options: SelectionOption[];
    selectedValue: string | null;
    onSelect: (id: string) => void;
    iconColor: string;
}

export const SelectionSectionCard: React.FC<SelectionSectionCardProps> = ({
    title,
    iconLigature,
    options,
    selectedValue,
    onSelect,
    iconColor,
}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const { styles } = useStyles((t, c) => ({
        card: {
            backgroundColor: "transparent",
            borderWidth: 1,
            borderColor: c("border.default"),
            padding: t.spacing.lg,
            marginBottom: t.spacing.lg,
            borderRadius: 12,
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
        },
        // ─── Dropdown Specific Styles ───
        trigger: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: t.spacing.md,
            borderWidth: 1,
            borderColor: c("border.default"),
            backgroundColor: c("surface.background"),
            borderRadius: t.borderRadius?.md || 8,
        },
        triggerText: {
            fontSize: 16,
            fontFamily: t.typography.bodyFont,
            color: c("text.muted"),
        },
        triggerTextPlaceholder: {
            fontSize: 16,
            fontFamily: t.typography.bodyFont,
            color: c("text.muted"),
        },
        chevron: {
            fontFamily: "Material Icons",
            fontSize: 24,
            color: c("text.muted"),
        },
        menu: {
            marginTop: t.spacing.sm,
            borderWidth: 1,
            borderColor: c("border.default"),
            backgroundColor: c("card.background"),
            borderRadius: t.borderRadius?.md || 8,
            overflow: "hidden",
        },
        menuItem: {
            padding: t.spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: c("border.default"),
        },
        menuItemActive: {
            backgroundColor: c("surface.overlay") || c("card.softGlow") || "rgba(180, 136, 255, 0.15)",
        },
        menuItemText: {
            fontSize: 16,
            color: c("text.muted"),
        },
        menuItemTextActive: {
            fontSize: 16,
            fontWeight: "bold",
            color: iconColor,
        }
    }));

    const selectedOption = options.find(opt => opt.id === selectedValue);

    return (
        <View style={styles.card}>
            {/* Header */}
            <View style={styles.headerRow}>
                <Text style={styles.icon}>{iconLigature}</Text>
                <Text style={styles.title}>{title}</Text>
            </View>

            {/* Dropdown Trigger */}
            <TouchableOpacity
                activeOpacity={0.7}
                style={styles.trigger}
                onPress={() => setIsOpen(!isOpen)}
            >
                <Text
                    style={selectedOption ? styles.triggerText : styles.triggerTextPlaceholder}
                >
                    {selectedOption ? selectedOption.label : "Select an option..."}
                </Text>
                <Text style={styles.chevron}>
                    {isOpen ? "expand_less" : "expand_more"}
                </Text>
            </TouchableOpacity>

            {/* Dropdown Menu (Conditionally Rendered) */}
            {isOpen && (
                <View style={styles.menu}>
                    {options.map((option, index) => {
                        const isSelected = selectedValue === option.id;
                        const isLast = index === options.length - 1;

                        return (
                            <TouchableOpacity
                                key={option.id}
                                activeOpacity={0.7}
                                style={[
                                    styles.menuItem,
                                    isLast && { borderBottomWidth: 0 },
                                    isSelected && styles.menuItemActive
                                ]}
                                onPress={() => {
                                    onSelect(option.id);
                                    setIsOpen(false);
                                }}
                            >
                                <Text
                                    style={isSelected ? styles.menuItemTextActive : styles.menuItemText}
                                >
                                    {option.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            )}
        </View>
    );
};