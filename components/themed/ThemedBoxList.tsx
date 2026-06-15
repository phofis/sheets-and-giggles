import React from "react";
import { View, Pressable, type ViewProps, type ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useStyles } from "@/hooks/useStyles";
import { ThemedText } from "./ThemedText";
import { BoxWithGlow } from "../BoxWithGlow";
import { ThemeColorKey } from "@/constants/themes";

export interface BoxListItem {
    title: string;
    description: string;
    accentColor?: boolean;
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

const ACTION_COLUMN_WIDTH = 28;
const ADD_BUTTON_WIDTH = 30;

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
            minHeight: 34,
        },
        listTitle: { fontSize: 26, flex: 1, lineHeight: 34 },
        addButtonSlot: {
            width: ADD_BUTTON_WIDTH,
            height: 30,
            alignItems: "center",
            justifyContent: "center",
        },
        addButton: { padding: theme.spacing.xs },
        stack: { gap: theme.spacing.md },
        itemRow: { flexDirection: "row", alignItems: "center", gap: theme.spacing.xs },
        actionColumn: {
            width: ACTION_COLUMN_WIDTH,
            alignItems: "center",
            justifyContent: "center",
            gap: theme.spacing.xs,
            alignSelf: "stretch",
        },
        actionButton: { padding: 2 },
        itemBox: {
            flex: 1,
            minWidth: 0,
            height: "auto",
            minHeight: 80,
            paddingVertical: theme.spacing.md,
            alignItems: "center",
        },
        textContainer: { flex: 1, justifyContent: "center", alignSelf: "stretch" },
        itemTitle: { fontSize: 18, marginBottom: theme.spacing.xs },
        itemDescription: { lineHeight: 20 },
    }));

    const showAdd = isEditMode && onAddPress;
    const showDelete = isEditMode && onItemDelete;
    const reserveAddSlot = !!onAddPress;
    const reserveActionColumn = !!onItemPress || !!onItemDelete;

    return (
        <View style={[styles.container, style]} {...rest}>
            <View style={styles.titleRow}>
                <ThemedText color="text.heading" style={styles.listTitle} variant="label">
                    {title}
                </ThemedText>
                {reserveAddSlot && (
                    <View style={styles.addButtonSlot}>
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
                )}
            </View>

            <View style={styles.stack}>
                {data.map((item, index) => (
                    <View key={`${item.title}-${index}`} style={styles.itemRow}>
                        <BoxWithGlow
                            glow={!!glowColor}
                            glowColor={glowColor}
                            style={[styles.itemBox, itemStyle, item.style]}
                        >
                            <View style={styles.textContainer}>
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
                            </View>
                        </BoxWithGlow>
                        {reserveActionColumn && (
                            <View style={styles.actionColumn}>
                                {onItemPress && (
                                    <Pressable
                                        accessibilityLabel="Edit entry"
                                        accessibilityRole="button"
                                        style={({ pressed }) => [
                                            styles.actionButton,
                                            { opacity: pressed ? 0.7 : 1 },
                                        ]}
                                        onPress={
                                            isEditMode
                                                ? () => onItemPress(item, index)
                                                : undefined
                                        }
                                    >
                                        {isEditMode && (
                                            <Ionicons
                                                color={color("palette.secondary")}
                                                name="pencil"
                                                size={16}
                                            />
                                        )}
                                    </Pressable>
                                )}
                                {onItemDelete && (
                                    <Pressable
                                        accessibilityLabel={deleteAccessibilityLabel}
                                        accessibilityRole="button"
                                        style={({ pressed }) => [
                                            styles.actionButton,
                                            { opacity: pressed ? 0.7 : 1 },
                                        ]}
                                        onPress={
                                            showDelete
                                                ? () => onItemDelete(index)
                                                : undefined
                                        }
                                    >
                                        {showDelete && (
                                            <Ionicons
                                                color={color("text.muted")}
                                                name="close"
                                                size={20}
                                            />
                                        )}
                                    </Pressable>
                                )}
                            </View>
                        )}
                    </View>
                ))}
            </View>
        </View>
    );
}
