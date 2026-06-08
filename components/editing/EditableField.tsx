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
        container: {
            position: "relative",
            alignSelf: "stretch",
        },
        content: { minWidth: 0, flex: 1 },
        contentPaddedTrailing: {
            paddingRight: PENCIL_SLOT_WIDTH + t.spacing.xs,
        },
        contentPaddedLeading: {
            paddingLeft: PENCIL_SLOT_WIDTH + t.spacing.xs,
        },
        pencilTrailing: {
            position: "absolute",
            right: 0,
            top: 0,
            width: PENCIL_SLOT_WIDTH,
            alignItems: "center",
            justifyContent: "center",
            padding: 2,
        },
        pencilLeading: {
            position: "absolute",
            left: 0,
            top: 0,
            width: PENCIL_SLOT_WIDTH,
            alignItems: "center",
            justifyContent: "center",
            padding: 2,
        },
    }));

    const showPencil = isEditMode && onPress;
    const shouldReserveSpace = reservePencilSpace && onPress;

    if (!showPencil && !shouldReserveSpace) {
        return <View style={style}>{children}</View>;
    }

    const isTrailing = pencilPosition === "trailing";
    const contentPaddingStyle = shouldReserveSpace
        ? isTrailing
            ? styles.contentPaddedTrailing
            : styles.contentPaddedLeading
        : null;
    const pencilStyle = isTrailing ? styles.pencilTrailing : styles.pencilLeading;

    return (
        <Pressable
            accessibilityRole="button"
            disabled={!showPencil}
            style={({ pressed }) => [
                styles.container,
                style,
                showPencil && { opacity: pressed ? 0.85 : 1 },
            ]}
            onPress={showPencil ? onPress : undefined}
        >
            <View style={[styles.content, contentPaddingStyle]}>{children}</View>
            {(showPencil || shouldReserveSpace) && (
                <View pointerEvents={showPencil ? "auto" : "none"} style={pencilStyle}>
                    {showPencil ? (
                        <Ionicons color={color("palette.secondary")} name="pencil" size={14} />
                    ) : null}
                </View>
            )}
        </Pressable>
    );
}
