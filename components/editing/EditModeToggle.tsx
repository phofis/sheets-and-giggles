import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStyles } from "@/hooks/useStyles";

type Props = {
    isEditMode: boolean;
    onToggle: () => void;
};

export function EditModeToggle({ isEditMode, onToggle }: Props) {
    const insets = useSafeAreaInsets();
    const { styles, color } = useStyles((t) => ({
        button: {
            position: "absolute",
            top: insets.top + t.spacing.xs,
            right: t.spacing.lg,
            zIndex: 100,
            elevation: 8,
            padding: t.spacing.sm,
            borderRadius: t.borderRadius.full,
        },
    }));

    return (
        <Pressable
            accessibilityLabel={isEditMode ? "Exit edit mode" : "Enter edit mode"}
            accessibilityRole="button"
            style={({ pressed }) => [styles.button, { opacity: pressed ? 0.7 : 1 }]}
            onPress={onToggle}
        >
            <Ionicons
                color={color(isEditMode ? "palette.secondary" : "text.muted")}
                name={isEditMode ? "pencil" : "pencil-outline"}
                size={22}
            />
        </Pressable>
    );
}
