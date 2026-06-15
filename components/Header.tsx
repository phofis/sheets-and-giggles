import { ThemedHeadline, ThemedStatContainer, ThemedText, ThemedView } from "@/components/themed";
import { EditableField } from "@/components/editing/EditableField";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import { useStyles } from "@/hooks/useStyles";
import { CharacterHeader } from "@/types/character";

type Props = {
    characterHeader: CharacterHeader;
    isEditMode?: boolean;
    onEditName?: () => void;
    onEditLevel?: () => void;
    onEditInspiration?: () => void;
    onLevelUp?: () => void;
};

export const Header = ({
    characterHeader,
    isEditMode = false,
    onEditName,
    onEditLevel,
    onEditInspiration,
    onLevelUp,
}: Props) => {
    const { styles, color } = useStyles((theme, c) => ({
        screen: { flex: 1, marginBottom: 20, marginTop: 35 },
        scrollView: { flex: 1, alignSelf: "stretch" },
        scrollContentContainer: { flexGrow: 1 },
        content: { alignSelf: "stretch", paddingHorizontal: 16, paddingTop: 24, gap: 16 },
        heading: {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            alignSelf: "stretch",
        },
        headerPills: { flexDirection: "row", gap: 8, alignSelf: "flex-start" },
        headingTitle: {
            fontSize: 40,
            lineHeight: 60,
            fontFamily: theme.typography.headlineFont,
            fontWeight: "bold",
        },
        topStats: { alignSelf: "stretch", flexDirection: "row", gap: 8, marginTop: -4 },
        topStatPill: { flexShrink: 1, flexGrow: 1 },
        card: {
            height: 85,
            justifyContent: "flex-start",
            alignItems: "flex-start",
            paddingTop: 8,
            paddingBottom: 10,
            borderBottomWidth: 1,
            borderBottomColor: c("border.default"),
        },
        cardMetaLabel: { fontSize: 11, lineHeight: 16, fontWeight: "600", opacity: 0.85 },
        cardValue: { marginTop: 4, fontSize: 18, lineHeight: 26, textAlign: "left" },
        labelRow: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            alignSelf: "stretch",
            marginBottom: 8,
        },
        labelContainer: {
            alignSelf: "flex-start",
            paddingHorizontal: 6,
            paddingVertical: 2,
        },
        labelText: { fontSize: 12, fontWeight: "bold", textTransform: "uppercase" },
        levelUpButton: {
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            paddingHorizontal: theme.spacing.sm,
            paddingVertical: theme.spacing.xs,
            borderRadius: theme.borderRadius.full,
            backgroundColor: c("buttonPrimary.background"),
        },
        levelUpText: {
            fontSize: 12,
            fontWeight: "bold",
        },
    }));

    return (
        <ThemedView>
            <ThemedView style={styles.labelRow}>
                <ThemedView style={styles.labelContainer}>
                    <ThemedText color="text.muted" style={styles.labelText}>
                        IDENTITY PROFILE
                    </ThemedText>
                </ThemedView>
                {onLevelUp ? (
                    <Pressable
                        accessibilityLabel="Level Up"
                        accessibilityRole="button"
                        style={({ pressed }) => [
                            styles.levelUpButton,
                            { opacity: pressed ? 0.7 : 1 },
                        ]}
                        onPress={onLevelUp}
                    >
                        <Ionicons
                            color={color("buttonPrimary.text")}
                            name="arrow-up"
                            size={14}
                        />
                        <ThemedText color="buttonPrimary.text" style={styles.levelUpText}>
                            Level Up
                        </ThemedText>
                    </Pressable>
                ) : null}
            </ThemedView>

            <ThemedView style={styles.heading}>
                <EditableField isEditMode={isEditMode} onPress={onEditName}>
                    <ThemedHeadline color="text.heading" style={styles.headingTitle}>
                        {characterHeader.name}
                    </ThemedHeadline>
                </EditableField>
            </ThemedView>

            <View style={styles.headerPills}>
                <ThemedStatContainer
                    backgroundColor="buttonPrimary.background"
                    isEditMode={isEditMode}
                    label="Level"
                    labelColor="buttonPrimary.text"
                    mode="pill"
                    value={`${characterHeader.level} ${characterHeader.class}`}
                    onPress={onEditLevel}
                />
                <ThemedStatContainer
                    backgroundColor="buttonSecondary.background"
                    isEditMode={isEditMode}
                    label="Inspiration:"
                    labelColor="buttonSecondary.text"
                    mode="pill"
                    value={characterHeader.inspiration}
                    onPress={onEditInspiration}
                />
            </View>
        </ThemedView>
    );
};
