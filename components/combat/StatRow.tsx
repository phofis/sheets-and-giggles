import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useStyles } from "@/hooks/useStyles";
import { ThemedText } from "../themed";
import { ACIcon, InitiativeIcon, SpeedIcon } from "../icons";

type Props = {
    armorClass: number;
    initiative: number;
    speed: number;
    isEditMode?: boolean;
    onEditArmorClass?: () => void;
    onEditInitiative?: () => void;
    onEditSpeed?: () => void;
};

export default function StatRow({
    armorClass,
    initiative,
    speed,
    isEditMode = false,
    onEditArmorClass,
    onEditInitiative,
    onEditSpeed,
}: Props) {
    const { styles, color } = useStyles((t, c) => ({
        row: {
            flexDirection: "row",
            justifyContent: "space-between",
            gap: t.spacing.md,
        },
        statBox: {
            flex: 1,
            alignItems: "center",
            backgroundColor: c("card.background"),
            borderRadius: t.borderRadius.md,
            paddingVertical: t.spacing.lg,
            gap: t.spacing.xs,
        },
        statBoxHighlighted: {
            backgroundColor: c("surface.surfaceElevated"),
        },
        valueSlot: {
            alignSelf: "stretch",
            alignItems: "center",
        },
        valueAnchor: {
            position: "relative",
        },
        pencil: {
            position: "absolute",
            left: "100%",
            top: "50%",
            marginLeft: 2,
            marginTop: -9,
            padding: 2,
        },
        statValue: {
            fontSize: 24,
            lineHeight: 30,
        },
        statLabel: {
            fontSize: 10,
            letterSpacing: 1,
        },
    }));

    const speedLabel = `${speed}ft`;

    const renderCenteredValue = (value: string | number, onPress?: () => void) => {
        const showPencil = isEditMode && onPress;

        return (
            <View style={styles.valueSlot}>
                <Pressable
                    accessibilityRole="button"
                    disabled={!showPencil}
                    style={({ pressed }) => [
                        styles.valueAnchor,
                        showPencil && { opacity: pressed ? 0.85 : 1 },
                    ]}
                    onPress={showPencil ? onPress : undefined}
                >
                    <ThemedText
                        color="text.heading"
                        style={styles.statValue}
                        variant="headline"
                    >
                        {value}
                    </ThemedText>
                    {showPencil && (
                        <View style={styles.pencil}>
                            <Ionicons
                                color={color("palette.secondary")}
                                name="pencil"
                                size={14}
                            />
                        </View>
                    )}
                </Pressable>
            </View>
        );
    };

    return (
        <View style={styles.row}>
            <View style={styles.statBox}>
                <ACIcon color="palette.tertiary" size={16} />
                {renderCenteredValue(armorClass, onEditArmorClass)}
                <ThemedText color="text.muted" style={styles.statLabel}>
                    ARMOR CLASS
                </ThemedText>
            </View>
            <View style={[styles.statBox, styles.statBoxHighlighted]}>
                <InitiativeIcon />
                {renderCenteredValue(
                    initiative >= 0 ? `+${initiative}` : initiative,
                    onEditInitiative,
                )}
                <ThemedText color="text.muted" style={styles.statLabel}>
                    INITIATIVE
                </ThemedText>
            </View>
            <View style={styles.statBox}>
                <SpeedIcon />
                {renderCenteredValue(speedLabel, onEditSpeed)}
                <ThemedText color="text.muted" style={styles.statLabel}>
                    SPEED
                </ThemedText>
            </View>
        </View>
    );
}
