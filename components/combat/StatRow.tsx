import { View } from "react-native";
import { useStyles } from "@/hooks/useStyles";
import { ThemedText } from "../themed";
import { EditableField } from "@/components/editing/EditableField";
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
    const { styles } = useStyles((t, c) => ({
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

    return (
        <View style={styles.row}>
            <EditableField
                isEditMode={isEditMode}
                overlay
                overlayPosition="top-right"
                style={{ flex: 1 }}
                onPress={onEditArmorClass}
            >
                <View style={styles.statBox}>
                    <ACIcon color="palette.tertiary" size={16} />
                    <ThemedText
                        color="text.heading"
                        style={styles.statValue}
                        variant="headline"
                    >
                        {armorClass}
                    </ThemedText>
                    <ThemedText color="text.muted" style={styles.statLabel}>
                        ARMOR CLASS
                    </ThemedText>
                </View>
            </EditableField>
            <EditableField
                isEditMode={isEditMode}
                overlay
                overlayPosition="top-right"
                style={{ flex: 1 }}
                onPress={onEditInitiative}
            >
                <View style={[styles.statBox, styles.statBoxHighlighted]}>
                    <InitiativeIcon />
                    <ThemedText
                        color="text.heading"
                        style={styles.statValue}
                        variant="headline"
                    >
                        {initiative >= 0 ? `+${initiative}` : initiative}
                    </ThemedText>
                    <ThemedText color="text.muted" style={styles.statLabel}>
                        INITIATIVE
                    </ThemedText>
                </View>
            </EditableField>
            <EditableField
                isEditMode={isEditMode}
                overlay
                overlayPosition="top-right"
                style={{ flex: 1 }}
                onPress={onEditSpeed}
            >
                <View style={styles.statBox}>
                    <SpeedIcon />
                    <ThemedText
                        color="text.heading"
                        style={styles.statValue}
                        variant="headline"
                    >
                        {speedLabel}
                    </ThemedText>
                    <ThemedText color="text.muted" style={styles.statLabel}>
                        SPEED
                    </ThemedText>
                </View>
            </EditableField>
        </View>
    );
}
