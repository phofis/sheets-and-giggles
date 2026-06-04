import React from "react";
import { View, type ViewProps, type ViewStyle } from "react-native";
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
}

export function ThemedBoxList({
    title,
    data,
    style,
    itemStyle,
    glowColor = "card.glow",
    isEditMode = false,
    onItemPress,
    ...rest
}: ThemedBoxListProps) {
    const { styles } = useStyles((theme) => ({
        container: { width: "100%", marginVertical: theme.spacing.md },
        listTitle: { fontSize: 26, marginBottom: theme.spacing.lg },
        stack: { gap: theme.spacing.md },
        itemBox: { width: "100%" },
        textContainer: { flex: 1, justifyContent: "center" },
        itemTitle: { fontSize: 18, marginBottom: theme.spacing.xs },
        itemDescription: { lineHeight: 20 },
    }));

    return (
        <View style={[styles.container, style]} {...rest}>
            <ThemedText color="text.heading" style={styles.listTitle} variant="label">
                {title}
            </ThemedText>

            <View style={styles.stack}>
                {data.map((item, index) => (
                    <BoxWithGlow
                        key={`${item.title}-${index}`}
                        glow={glowColor ? true : false}
                        glowColor={glowColor}
                        style={[styles.itemBox, itemStyle, item.style]}
                    >
                        <EditableField
                            isEditMode={isEditMode}
                            onPress={
                                onItemPress ? () => onItemPress(item, index) : undefined
                            }
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
                        </EditableField>
                    </BoxWithGlow>
                ))}
            </View>
        </View>
    );
}
