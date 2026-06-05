import { ThemedHeadline, ThemedStatContainer, ThemedText, ThemedView } from "@/components/themed";
import { EditableField } from "@/components/editing/EditableField";
import { View } from "react-native";
import { useStyles } from "@/hooks/useStyles";
import { CharacterHeader } from "@/types/character";

type Props = {
    characterHeader: CharacterHeader;
    isEditMode?: boolean;
    onEditName?: () => void;
    onEditLevel?: () => void;
    onEditInspiration?: () => void;
};

export const Header = ({
    characterHeader,
    isEditMode = false,
    onEditName,
    onEditLevel,
    onEditInspiration,
}: Props) => {
    const { styles } = useStyles((theme, c) => ({
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
            fontSize: 48,
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
        labelContainer: {
            alignSelf: "flex-start",
            paddingHorizontal: 6,
            paddingVertical: 2,
            marginBottom: 8,
        },
        labelText: { fontSize: 12, fontWeight: "bold", textTransform: "uppercase" },
    }));

    return (
        <ThemedView>
            <ThemedView style={styles.labelContainer}>
                <ThemedText color="text.muted" style={styles.labelText}>
                    IDENTITY PROFILE
                </ThemedText>
            </ThemedView>

            <ThemedView style={styles.heading}>
                <EditableField isEditMode={isEditMode} onPress={onEditName}>
                    <ThemedHeadline color="text.heading" style={styles.headingTitle}>
                        {characterHeader.name}
                    </ThemedHeadline>
                </EditableField>
            </ThemedView>

            <View style={styles.headerPills}>
                <EditableField isEditMode={isEditMode} onPress={onEditLevel}>
                    <ThemedStatContainer
                        backgroundColor="buttonPrimary.background"
                        label="Level"
                        labelColor="buttonPrimary.text"
                        mode="pill"
                        value={`${characterHeader.level} ${characterHeader.class}`}
                    />
                </EditableField>
                <EditableField isEditMode={isEditMode} onPress={onEditInspiration}>
                    <ThemedStatContainer
                        backgroundColor="buttonSecondary.background"
                        label="Inspiration:"
                        labelColor="buttonSecondary.text"
                        mode="pill"
                        value={characterHeader.inspiration}
                    />
                </EditableField>
            </View>
        </ThemedView>
    );
};
