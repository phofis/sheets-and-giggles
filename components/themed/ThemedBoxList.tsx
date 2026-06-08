import React from "react";
import { View, Pressable, type ViewProps, type ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { EditableField } from "@/components/editing/EditableField";
import { useStyles } from "@/hooks/useStyles";
import { ThemedText } from "./ThemedText";
import { BoxWithGlow } from "../BoxWithGlow";
import { ThemeColorKey } from "@/constants/themes";

export interface BoxListItem {
    title: string;
    description: string;
    accentColor?: boolean; // Maps to the 'glow' prop of BoxWithGlow
    style?: ViewStyle;
}

export interface ThemedBoxListProps extends ViewProps {
    title: string;
    data: BoxListItem[];
    itemStyle?: ViewStyle;
    glowColor?: ThemeColorKey;
    isEditMode?: boolean;
    onItemPress?: (item: BoxListItem, index: number) => void;
    onAddPress?: () => void;
    onItemDelete?: (index: number) => void;
    addAccessibilityLabel?: string;
    deleteAccessibilityLabel?: string;
}

export function ThemedBoxList({
    title,
    data,
    style,
    itemStyle,
    glowColor = "card.glow",
    isEditMode = false,
    onItemPress,
    onAddPress,
    onItemDelete,
    addAccessibilityLabel = "Add entry",
    deleteAccessibilityLabel = "Delete entry",
    ...rest
}: ThemedBoxListProps) {
    const { styles, color } = useStyles((theme) => ({
        container: { width: "100%", marginVertical: theme.spacing.md },
        titleRow: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: theme.spacing.lg,
            gap: theme.spacing.sm,
        },
        listTitle: { fontSize: 26, flex: 1 },
        addButton: { padding: theme.spacing.xs },
        stack: { gap: theme.spacing.md },
        itemRow: { flexDirection: "row", alignItems: "flex-start", gap: theme.spacing.xs },
        itemBox: { flex: 1, minWidth: 0 },
        deleteButton: { padding: theme.spacing.sm, marginTop: theme.spacing.xs },
        itemContent: { flex: 1, minWidth: 0 },
        editableField: { flex: 1, minWidth: 0 },
        itemTitle: { fontSize: 18, marginBottom: theme.spacing.xs },
        itemDescription: { lineHeight: 20, flexShrink: 1 },
    }));

    const showAdd = isEditMode && onAddPress;
    const showDelete = isEditMode && onItemDelete;

    return (
        <View style={[styles.container, style]} {...rest}>
            <View style={styles.titleRow}>
                <ThemedText color="text.heading" style={styles.listTitle} variant="label">
                    {title}
                </ThemedText>
                {showAdd && (
                    <Pressable
                        accessibilityLabel={addAccessibilityLabel}
                        accessibilityRole="button"
                        style={({ pressed }) => [
                            styles.addButton,
                            { opacity: pressed ? 0.7 : 1 },
                        ]}
                        onPress={onAddPress}
                    >
                        <Ionicons
                            color={color("palette.secondary")}
                            name="add-circle-outline"
                            size={22}
                        />
                    </Pressable>
                )}
            </View>

            <View style={styles.stack}>
                {data.map((item, index) => (
                    <View key={`${item.title}-${index}`} style={styles.itemRow}>
                        <BoxWithGlow
                            glow={glowColor ? true : false}
                            glowColor={glowColor}
                            size="auto"
                            style={[styles.itemBox, itemStyle, item.style]}
                        >
                            <View style={styles.itemContent}>
                                <EditableField
                                    isEditMode={isEditMode}
                                    reservePencilSpace={!!onItemPress}
                                    style={styles.editableField}
                                    onPress={
                                        onItemPress
                                            ? () => onItemPress(item, index)
                                            : undefined
                                    }
                                >
                                    {item.title.trim().length > 0 && (
                                        <ThemedText
                                            color="text.heading"
                                            style={styles.itemTitle}
                                            variant="label"
                                        >
                                            {item.title}
                                        </ThemedText>
                                    )}

                                    <ThemedText
                                        color="text.heading"
                                        style={styles.itemDescription}
                                        variant="body"
                                    >
                                        {item.description}
                                    </ThemedText>
                                </EditableField>
                            </View>
                        </BoxWithGlow>
                        {showDelete && (
                            <Pressable
                                accessibilityLabel={deleteAccessibilityLabel}
                                accessibilityRole="button"
                                style={({ pressed }) => [
                                    styles.deleteButton,
                                    { opacity: pressed ? 0.7 : 1 },
                                ]}
                                onPress={() => onItemDelete(index)}
                            >
                                <Ionicons
                                    color={color("text.muted")}
                                    name="close"
                                    size={20}
                                />
                            </Pressable>
                        )}
                    </View>
                ))}
            </View>
        </View>
    );
}
