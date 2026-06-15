import { Pressable, View, type StyleProp, type ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useStyles } from "@/hooks/useStyles";

const PENCIL_SIZE = 14;
const PENCIL_SLOT_WIDTH = PENCIL_SIZE + 4;

type Props = {
    isEditMode: boolean;
    onPress?: () => void;
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    pencilPosition?: "left" | "right";
    reserveSpace?: boolean;
    stretch?: boolean;
    overlay?: boolean;
    overlayPosition?: "top-right" | "right";
    compact?: boolean;
};

export function EditableField({
    isEditMode,
    onPress,
    children,
    style,
    pencilPosition = "right",
    reserveSpace = true,
    stretch = false,
    overlay = false,
    overlayPosition = "top-right",
    compact = false,
}: Props) {
    const { styles, color } = useStyles((t) => ({
        row: {
            flexDirection: "row",
            alignItems: stretch ? "stretch" : "center",
            gap: t.spacing.xs,
        },
        content: compact ? {} : { flex: 1, minWidth: 0 },
        pencilSlot: {
            width: PENCIL_SLOT_WIDTH,
            alignItems: "center",
            justifyContent: "center",
            padding: 2,
        },
        pencilSlotStretch: {
            alignSelf: "stretch",
        },
        overlayContainer: {
            position: "relative",
        },
        overlayPencilTopRight: {
            position: "absolute",
            top: 0,
            right: 0,
            padding: 2,
        },
        overlayPencilRight: {
            position: "absolute",
            top: "50%",
            right: -PENCIL_SLOT_WIDTH,
            marginTop: -(PENCIL_SIZE / 2) - 2,
            padding: 2,
        },
    }));

    const showPencil = isEditMode && !!onPress;
    const showSlot = showPencil || (reserveSpace && !!onPress);

    const pencilIcon = showPencil ? (
        <Ionicons color={color("palette.secondary")} name="pencil" size={PENCIL_SIZE} />
    ) : null;

    const pencilSlot = showSlot ? (
        <View style={[styles.pencilSlot, stretch && styles.pencilSlotStretch]}>
            {pencilIcon}
        </View>
    ) : null;

    if (overlay) {
        if (showPencil) {
            return (
                <Pressable
                    accessibilityRole="button"
                    style={({ pressed }) => [
                        styles.overlayContainer,
                        style,
                        pressed ? { opacity: 0.85 } : undefined,
                    ]}
                    onPress={onPress}
                >
                    {children}
                    <View
                        style={
                            overlayPosition === "right"
                                ? styles.overlayPencilRight
                                : styles.overlayPencilTopRight
                        }
                    >
                        <Ionicons
                            color={color("palette.secondary")}
                            name="pencil"
                            size={PENCIL_SIZE}
                        />
                    </View>
                </Pressable>
            );
        }

        return <View style={[styles.overlayContainer, style]}>{children}</View>;
    }

    const rowContent = (
        <>
            {pencilPosition === "left" && pencilSlot}
            <View style={styles.content}>{children}</View>
            {pencilPosition === "right" && pencilSlot}
        </>
    );

    if (showPencil) {
        return (
            <Pressable
                accessibilityRole="button"
                style={({ pressed }) => [
                    styles.row,
                    style,
                    pressed ? { opacity: 0.85 } : undefined,
                ]}
                onPress={onPress}
            >
                {rowContent}
            </Pressable>
        );
    }

    return <View style={[styles.row, style]}>{rowContent}</View>;
}
