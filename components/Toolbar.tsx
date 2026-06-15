import { View, Pressable, TextInput } from "react-native";
import { Search, Filter, Plus, Trash2 } from "lucide-react-native";

import { ThemedText } from "@/components/themed";
import { useStyles } from "@/hooks/useStyles";

type ToolbarProps = {
    search: string;
    onSearchChange: (value: string) => void;
    onAddPress?: () => void;
    onFilterPress?: () => void;
    placeholder?: string;
};

export function Toolbar({
    search,
    onSearchChange,
    onAddPress,
    onFilterPress,
    placeholder = "Search items...",
}: ToolbarProps) {
    const { styles, color } = useStyles((t, c) => ({
        container: {
            flexDirection: "row",
            alignItems: "center",
            gap: t.spacing.sm,
            marginBottom: t.spacing.lg,
        },

        searchContainer: {
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: c("surface.surfaceElevated"),
            borderRadius: t.borderRadius.xl,
            paddingHorizontal: t.spacing.md,
            paddingVertical: t.spacing.sm,
            gap: t.spacing.sm,
        },

        input: {
            flex: 1,
            color: c("text.body"),
            fontSize: 14,
        },

        actionButton: {
            width: 42,
            height: 42,
            borderRadius: t.borderRadius.xl,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: c("surface.surfaceElevated"),
        },
    }));

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Search size={18} color={color("text.muted")} />

                <TextInput
                    value={search}
                    onChangeText={onSearchChange}
                    placeholder={placeholder}
                    placeholderTextColor={color("text.muted")}
                    style={styles.input}
                />
            </View>

            {onFilterPress && (
                <Pressable style={styles.actionButton} onPress={onFilterPress}>
                    <Filter size={18} color={color("text.body")} />
                </Pressable>
            )}

            {onAddPress && (
                <Pressable style={styles.actionButton} onPress={onAddPress}>
                    <Plus size={18} color={color("text.body")} />
                </Pressable>
            )}
        </View>
    );
}
