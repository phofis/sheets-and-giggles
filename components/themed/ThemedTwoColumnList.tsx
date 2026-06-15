import { EditableField } from "@/components/editing/EditableField";
import { useStyles } from "@/hooks/useStyles";
import type { ListItem } from "@/types/lists";
import { View, type ViewProps } from "react-native";
import { ThemedText } from "./ThemedText";

export type { ListItem };

export interface ThemedTwoColumnListProps extends ViewProps {
    title?: string;
    icon?: React.ElementType;
    data: ListItem[];
    isEditMode?: boolean;
    onItemPress?: (item: ListItem, index: number) => void;
}

export function ThemedTwoColumnList({
    title,
    icon: Icon,
    data,
    isEditMode = false,
    onItemPress,
    style,
    ...rest
}: ThemedTwoColumnListProps) {
    const { styles, color } = useStyles((_, c) => ({
        container: { paddingVertical: 8, width: "100%" },
        header: { flexDirection: "row", alignItems: "center", marginBottom: 13, gap: 8 },
        titleText: { fontSize: 22, lineHeight: 28 },
        grid: { flexDirection: "row", justifyContent: "space-between", gap: 24 },
        column: { flex: 1, gap: 12 },
        itemRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottomWidth: 0.5,
            borderBottomColor: c("border.subtle"),
            paddingBottom: 4,
            width: "100%"
        },
        label: { fontSize: 16, opacity: 0.85, flex: 1 },
        valueGroup: { flexShrink: 0 },
        value: { fontSize: 16 },
    }));

    // Split data into two columns
    const leftColumn = data.filter((_, i) => i % 2 === 0);
    const rightColumn = data.filter((_, i) => i % 2 !== 0);

    const renderItem = (item: ListItem, index: number) => (
        <View key={index} style={styles.itemRow}>
            <ThemedText color="text.heading" style={styles.label} variant="body">
                {item.label}
            </ThemedText>
            <EditableField
                compact
                isEditMode={isEditMode}
                pencilPosition="left"
                style={styles.valueGroup}
                onPress={
                    onItemPress ? () => onItemPress(item, index) : undefined
                }
            >
                <ThemedText
                    color={item.highlight ? "palette.secondary" : "text.lively"}
                    style={styles.value}
                    variant="label"
                >
                    {item.value}
                </ThemedText>
            </EditableField>
        </View>
    );

    return (
        <View style={[styles.container, style]} {...rest}>
            {(Icon || title) && (
                <View style={styles.header}>
                    {Icon && <Icon color={color("palette.tertiary")} size={22} />}

                    {title && (
                        <ThemedText color="text.heading" style={styles.titleText} variant="label">
                            {title}
                        </ThemedText>
                    )}
                </View>
            )}
            <View style={styles.grid}>
                <View style={styles.column}>{leftColumn.map(renderItem)}</View>
                <View style={styles.column}>{rightColumn.map(renderItem)}</View>
            </View>
        </View>
    );
}
