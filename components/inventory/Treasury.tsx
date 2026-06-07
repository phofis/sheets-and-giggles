import { View } from "react-native";
import { ThemedText, ThemedView } from "@/components/themed";
import { useStyles } from "@/hooks/useStyles";
import { useCharacter } from "@/hooks/data";
import { Coins } from "lucide-react-native";
import { useCharacterId } from "@/context/CharacterIdContext";
import { EditableField } from "@/components/editing/EditableField";
import { useFieldEditorModals } from "@/hooks/editing/useFieldEditorModals";
import { useCharacterEditor } from "@/hooks/editing/useCharacterEditor";

type TreasuryProps = {
    isEditMode: boolean;
};

export function Treasury({ isEditMode }: TreasuryProps) {
    const characterId = useCharacterId();
    const { openNumeric, modals } = useFieldEditorModals();
    const { updateCharacter } = useCharacterEditor(characterId);
    const { styles, color } = useStyles((t, c) => ({
        card: {
            marginTop: t.spacing.xxl,
            padding: t.spacing.md,
            minHeight: 120,
            justifyContent: "space-between",
            height: "auto",
            backgroundColor: c("card.background"),
            borderRadius: t.borderRadius.md,
        },
        header: {
            marginBottom: t.spacing.sm,
            letterSpacing: 1,
        },
        currencyRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            gap: t.spacing.md,
        },
        currencyIcon: {
            marginBottom: t.spacing.xs,
            size: 24,
        },
        currencyItem: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
        },
        currencyValue: {
            fontSize: 26,
            fontWeight: "700",
        },
        currencyUnit: {
            marginTop: t.spacing.xs,
            letterSpacing: 1,
        },
    }));
    const { data: character, isLoading } = useCharacter(characterId);
    if (isLoading) {
    }
    const money = [
        { key: "gold", label: "GP", color: color("money.gold") },
        { key: "silver", label: "SP", color: color("money.silver") },
        { key: "copper", label: "CP", color: color("money.copper") },
    ] as const;

    return (
        <>
            {modals}
            <ThemedView style={styles.card}>
                {/* header moved inside elevated area */}
                <ThemedText
                    color="text.muted"
                    style={styles.header}
                    variant="label"
                >
                    TREASURY
                </ThemedText>

                <View style={styles.currencyRow}>
                    {money.map((m) => (
                        <View key={m.key} style={styles.currencyItem}>
                            <View style={styles.currencyIcon}>
                                <Coins size={24} color={m.color} />
                            </View>
                            <EditableField
                                isEditMode={isEditMode}
                                onPress={() =>
                                    openNumeric({
                                        label: `${m.label} amount`,
                                        placeholder: `Set ${m.label}`,
                                        initialValue: character?.[m.key] ?? 0,
                                        min: 0,
                                        onSubmit: (value) =>
                                            updateCharacter.mutate({
                                                [m.key]: value,
                                            } as {
                                                gold?: number;
                                                silver?: number;
                                                copper?: number;
                                            }),
                                    })
                                }
                            >
                                <ThemedText
                                    color="text.heading"
                                    style={styles.currencyValue}
                                >
                                    {character?.[m.key] ?? 0}
                                </ThemedText>
                            </EditableField>

                            <ThemedText
                                color="text.muted"
                                style={styles.currencyUnit}
                                variant="body"
                            >
                                {m.label}
                            </ThemedText>
                        </View>
                    ))}
                </View>
            </ThemedView>
        </>
    );
}
