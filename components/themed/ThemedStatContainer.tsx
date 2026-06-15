import type { ThemeColorKey } from "@/constants/themes";
import { Pressable, StyleSheet, View, type ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useStyles } from "@/hooks/useStyles";
import { ThemedText } from "./ThemedText";
import { ThemedTextBox } from "./ThemedTextBox";

const PENCIL_SIZE = 14;
const PENCIL_SLOT_WIDTH = PENCIL_SIZE + 4;

export interface ThemedStatContainerProps {
    label: string;
    value?: string | number;
    style?: ViewStyle | ViewStyle[];
    size?: "regular" | "compact";
    mode?: "stacked" | "pill";
    backgroundColor?: ThemeColorKey;
    labelColor?: ThemeColorKey;
    valueColor?: ThemeColorKey;
    isEditMode?: boolean;
    onPress?: () => void;
}

export function ThemedStatContainer({
    label,
    value = "",
    style,
    size = "regular",
    mode = "stacked",
    backgroundColor = "surface.background",
    labelColor = "palette.tertiary",
    valueColor = "palette.secondary",
    isEditMode = false,
    onPress,
}: ThemedStatContainerProps) {
    const { color } = useStyles(() => ({}));
    const isCompact = size === "compact";
    const isPill = mode === "pill";
    const showPencil = isEditMode && !!onPress && isPill;
    const showSlot = (showPencil || (isPill && !!onPress)) && isPill;

    const textContent = (
        <ThemedText
            color={labelColor}
            style={[
                styles.label,
                isCompact ? styles.labelCompact : null,
                isPill ? styles.pillText : null,
            ]}
            variant="body"
        >
            {isPill ? `${label} ${value}` : label.toUpperCase()}
        </ThemedText>
    );

    const pillContent = isPill ? (
        <View style={styles.pillRow}>
            <View style={styles.pillTextContainer}>{textContent}</View>
            {showSlot && (
                <View style={styles.pencilSlot}>
                    {showPencil && (
                        <Ionicons
                            color={color("palette.secondary")}
                            name="pencil"
                            size={PENCIL_SIZE}
                        />
                    )}
                </View>
            )}
        </View>
    ) : (
        <>
            {textContent}
            <ThemedText
                color={valueColor}
                style={[styles.value, isCompact ? styles.valueCompact : null]}
                variant="label"
            >
                {value}
            </ThemedText>
        </>
    );

    const boxStyle = [styles.container, isPill ? styles.pillContainer : null, style];

    if (showPencil) {
        return (
            <Pressable
                accessibilityRole="button"
                style={({ pressed }) => [pressed ? { opacity: 0.85 } : undefined]}
                onPress={onPress}
            >
                <ThemedTextBox
                    backgroundColor={backgroundColor}
                    borderRadius={isPill ? "full" : "sm"}
                    style={boxStyle}
                >
                    {pillContent}
                </ThemedTextBox>
            </Pressable>
        );
    }

    return (
        <ThemedTextBox
            backgroundColor={backgroundColor}
            borderRadius={isPill ? "full" : "sm"}
            style={boxStyle}
        >
            {pillContent}
        </ThemedTextBox>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "flex-start",
        justifyContent: "flex-start",
        paddingHorizontal: 0,
        paddingTop: 0,
        paddingBottom: 0,
    },
    pillContainer: {
        justifyContent: "center",
        alignItems: "center",
        minHeight: 44,
        paddingHorizontal: 22,
        paddingVertical: 8,
    },
    pillRow: {
        flexDirection: "row",
        alignItems: "stretch",
        alignSelf: "stretch",
    },
    pillTextContainer: {
        flex: 1,
        justifyContent: "center",
    },
    pencilSlot: {
        width: PENCIL_SLOT_WIDTH,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "stretch",
        marginLeft: 4,
    },
    pillText: {
        fontSize: 14,
        lineHeight: 18,
        fontWeight: "600",
        opacity: 1,
        textTransform: "none",
    },
    label: {
        fontSize: 12,
        lineHeight: 16,
        fontWeight: "600",
        opacity: 0.85,
    },
    value: {
        marginTop: 4,
        fontSize: 12,
        lineHeight: 16,
        textAlign: "left",
    },
    labelCompact: {
        fontSize: 8,
        lineHeight: 14,
    },
    valueCompact: {
        marginTop: 3,
        fontSize: 8,
        lineHeight: 14,
    },
});
