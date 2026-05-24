import React, { useState } from "react";
import { View, type ViewProps, Pressable, LayoutAnimation, Platform, UIManager } from "react-native";
import { useStyles } from "@/hooks/useStyles";
import { ThemedText } from "@/components/themed"; // Adjust path as necessary
import { Ionicons } from "@expo/vector-icons";

// Enable LayoutAnimation for Android smooth expansion
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export interface SkillSelectionListProps extends ViewProps {
    title?: string;
    icon?: string;
    availableSkills: string[];
    selectedSkills: string[];
    onToggleSkill: (skill: string) => void;
    initialDisplayCount?: number;
}

export function SkillSelectionList({
    title,
    icon = "list",
    availableSkills,
    selectedSkills,
    onToggleSkill,
    initialDisplayCount = 5,
    style,
    ...rest
}: SkillSelectionListProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const { styles, color } = useStyles((_, c) => ({
        container: { width: "100%", marginVertical: 8 },
        header: { flexDirection: "row", alignItems: "flex-start", gap: 8, marginBottom: 16 },
        titleText: { fontSize: 24 },
        listBody: { gap: 20 },
        row: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 4 // Added padding for better touch targets
        },
        labelContainer: { flexDirection: "row", alignItems: "center", gap: 12 },
        bullet: { width: 12, height: 12, borderRadius: 6, borderWidth: 2 },
        bulletActive: {
            backgroundColor: c("palette.tertiary"),
            borderColor:c("palette.tertiary")
        },
        bulletInactive: {
            backgroundColor: "transparent",
            borderColor: c("border.subtle")
        },
        bulletGlow: {
            shadowColor: c("palette.tertiary"),
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 1,
            shadowRadius: 6,
            elevation: 5,
        },
        skillLabel: { fontSize: 18, opacity: 0.9 },
        skillLabelActive: { fontWeight: "bold", opacity: 1 },
        footer: { marginTop: 24, alignItems: "center" },
        footerText: { letterSpacing: 1.5, fontWeight: "700", fontSize: 12 },
    }));

    const displayedSkills = isExpanded
        ? availableSkills
        : availableSkills.slice(0, initialDisplayCount);

    const handleToggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsExpanded(!isExpanded);
    };

    return (
        <View style={[styles.container, style]} {...rest}>
            {title && (
                <View style={styles.header}>
                    {icon && (
                        <Ionicons color={color("palette.tertiary")} name={icon as any} size={20} />
                    )}
                    <ThemedText color="text.heading" style={styles.titleText}>
                        {title}
                    </ThemedText>
                </View>
            )}

            <View style={styles.listBody}>
                {displayedSkills.map((skill, index) => {
                    const isSelected = selectedSkills.includes(skill);

                    return (
                        <Pressable
                            key={index}
                            style={styles.row}
                            onPress={() => onToggleSkill(skill)}
                        >
                            <View style={styles.labelContainer}>
                                <View
                                    style={[
                                        styles.bullet,
                                        isSelected ? styles.bulletActive : styles.bulletInactive,
                                        isSelected && styles.bulletGlow,
                                    ]}
                                />
                                <ThemedText
                                    color="text.heading"
                                    style={[
                                        styles.skillLabel,
                                        isSelected && styles.skillLabelActive
                                    ]}
                                >
                                    {skill}
                                </ThemedText>
                            </View>
                        </Pressable>
                    );
                })}
            </View>

            {availableSkills.length > initialDisplayCount && (
                <Pressable style={styles.footer} onPress={handleToggleExpand}>
                    <ThemedText color="text.lively" style={styles.footerText}>
                        {isExpanded ? "SHOW LESS" : "VIEW ALL SKILLS"}
                    </ThemedText>
                </Pressable>
            )}
        </View>
    );
}