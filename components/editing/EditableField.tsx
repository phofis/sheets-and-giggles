import { Pressable, View, type StyleProp, type ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useStyles } from "@/hooks/useStyles";

const PENCIL_SLOT_WIDTH = 18;

type Props = {
    isEditMode: boolean;
    onPress?: () => void;
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    reservePencilSpace?: boolean;
    pencilPosition?: "leading" | "trailing";
};

export function EditableField({
    isEditMode,
    onPress,
    children,
    style,
    reservePencilSpace = false,
    pencilPosition = "trailing",
}: Props) {
    const { styles, color } = useStyles((t) => ({
        row: {
            flexDirection: "row",
            alignItems: "center",
            gap: t.spacing.xs,
        },
        content: { flex: 1, minWidth: 0 },
        contentNoFlex: { minWidth: 0 },
        pencil: {
            padding: 2,
            width: PENCIL_SLOT_WIDTH,
            alignItems: "center",
            justifyContent: "center",
        },
    }));

    const showPencil = isEditMode && onPress;
    const shouldReserveSpace = reservePencilSpace && onPress;

    if (!showPencil && !shouldReserveSpace) {
        return <View style={style}>{children}</View>;
    }

    const pencilSlot = (
        <View style={styles.pencil}>
            {showPencil ? (
                <Ionicons color={color("palette.secondary")} name="pencil" size={14} />
            ) : null}
        </View>
    );

    const contentStyle = reservePencilSpace ? styles.content : styles.contentNoFlex;

    return (
        <Pressable
            accessibilityRole="button"
            disabled={!showPencil}
            style={({ pressed }) => [
                styles.row,
                style,
                showPencil && { opacity: pressed ? 0.85 : 1 },
            ]}
            onPress={showPencil ? onPress : undefined}
        >
            {pencilPosition === "leading" ? pencilSlot : null}
            <View style={contentStyle}>{children}</View>
            {pencilPosition === "trailing" ? pencilSlot : null}
        </Pressable>
    );
}
