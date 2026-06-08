import { Pressable, View, type StyleProp, type ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useStyles } from "@/hooks/useStyles";

type Props = {
    isEditMode: boolean;
    onPress?: () => void;
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
};

export function EditableField({ isEditMode, onPress, children, style }: Props) {
    const { styles, color } = useStyles((t) => ({
        row: {
            flexDirection: "row",
            alignItems: "center",
            gap: t.spacing.xs,
        },
        content: { flex: 1, minWidth: 0 },
        pencil: { padding: 2 },
    }));

    if (!isEditMode || !onPress) {
        return <View style={style}>{children}</View>;
    }

    return (
        <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [
                styles.row,
                style,
                { opacity: pressed ? 0.85 : 1 },
            ]}
            onPress={onPress}
        >
            <View style={styles.content}>{children}</View>
            <View style={styles.pencil}>
                <Ionicons color={color("palette.secondary")} name="pencil" size={14} />
            </View>
        </Pressable>
    );
}
