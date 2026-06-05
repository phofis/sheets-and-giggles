import { ScrollView, View } from "react-native";
import { useState } from "react";
import { ThemedHeadline, ThemedText, ThemedView } from "@/components/themed";
import { useStyles } from "@/hooks/useStyles";
import { CollapsibleCard } from "@/components/CollapsibleCard";
import { Treasury } from "@/components/inventory/Treasury";
import { Attunement } from "@/components/inventory/Attunement";
import { EditableField } from "@/components/editing/EditableField";
import { EditScreenShell } from "@/components/editing/EditScreenShell";
import { useCharacterItems } from "@/hooks/data";
import { useCharacterId } from "@/context/CharacterIdContext";
import { useCharacterEditor } from "@/hooks/editing/useCharacterEditor";
import { useFieldEditorModals } from "@/hooks/editing/useFieldEditorModals";
import { useMemo } from "react";

export default function InventoryScreen() {
    const characterId = useCharacterId();
    const [isEditMode, setIsEditMode] = useState(false);
    const { updateCharacterItem } = useCharacterEditor(characterId);
    const { openText, modals } = useFieldEditorModals();

    const { styles } = useStyles((t, c) => ({
        screen: {
            flex: 1,
            backgroundColor: c("surface.background"),
        },
        scrollContent: {
            padding: t.spacing.lg,
            paddingBottom: t.spacing.xxl,
        },
        sectionSpacing: {
            marginBottom: t.spacing.lg,
        },
        inventoryHeader: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: t.spacing.sm,
            marginBottom: t.spacing.sm,
        },
        inventorySubtext: {
            letterSpacing: 1,
        },
        searchRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: t.spacing.md,
        },
        filterPill: {
            paddingHorizontal: t.spacing.md,
            paddingVertical: t.spacing.xs,
            borderRadius: t.borderRadius.xl,
            backgroundColor: c("surface.surfaceElevated"),
        },
        itemHeader: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: t.spacing.sm,
        },
        itemMeta: {
            flexDirection: "row",
            gap: t.spacing.sm,
            flexWrap: "wrap",
        },
        itemStatRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: t.spacing.md,
        },
    }));

    const { data: items, isLoading } = useCharacterItems(characterId);
    const attunedItems = useMemo(
        () => (items ?? []).filter((i) => i.attuned),
        [items],
    );

    return (
        <EditScreenShell
            isEditMode={isEditMode}
            style={styles.screen}
            onToggleEditMode={() => setIsEditMode((v) => !v)}
        >
            <ThemedView style={styles.screen}>
                {modals}
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.sectionSpacing}>
                        <Treasury />
                    </View>

                    <View style={styles.sectionSpacing}>
                        <Attunement
                            attunement_list={attunedItems.map((s) => s.name)}
                        />
                    </View>

                    <View style={[styles.inventoryHeader, styles.sectionSpacing]}>
                        <ThemedHeadline color="text.heading">
                            Inventory
                        </ThemedHeadline>
                    </View>

                    <View style={[styles.searchRow, styles.sectionSpacing]}>
                        <View style={styles.filterPill}>
                            <ThemedText color="text.muted" variant="body">
                                All items
                            </ThemedText>
                        </View>
                        <View style={styles.filterPill}>
                            <ThemedText color="text.muted" variant="body">
                                Sort
                            </ThemedText>
                        </View>
                    </View>

                    {!isLoading &&
                        (items ?? []).map((item) => (
                            <CollapsibleCard
                                key={item.id}
                                fullContent={
                                    <View style={styles.itemStatRow}>
                                        <EditableField
                                            isEditMode={isEditMode}
                                            onPress={() =>
                                                openText({
                                                    label: "Item description",
                                                    initialValue: item.description,
                                                    onSubmit: (value) =>
                                                        updateCharacterItem.mutate({
                                                            itemId: item.id,
                                                            patch: { description: value },
                                                        }),
                                                })
                                            }
                                        >
                                            <ThemedText color="text.body" variant="body">
                                                {item.description}
                                            </ThemedText>
                                        </EditableField>
                                    </View>
                                }
                                header={
                                    <View>
                                        <View style={styles.itemHeader}>
                                            <EditableField
                                                isEditMode={isEditMode}
                                                onPress={() =>
                                                    openText({
                                                        label: "Item name",
                                                        initialValue: item.name,
                                                        onSubmit: (value) =>
                                                            updateCharacterItem.mutate({
                                                                itemId: item.id,
                                                                patch: { name: value },
                                                            }),
                                                    })
                                                }
                                            >
                                                <ThemedText
                                                    color="text.heading"
                                                    variant="label"
                                                >
                                                    {item.name}
                                                </ThemedText>
                                            </EditableField>
                                        </View>
                                        <View style={styles.itemMeta}>
                                            {item.attuned && (
                                                <ThemedText
                                                    color="semantic.success"
                                                    variant="body"
                                                >
                                                    Attuned
                                                </ThemedText>
                                            )}
                                        </View>
                                    </View>
                                }
                                shortContent={
                                    <ThemedText color="text.body" variant="body">
                                        {item.description.length > 50
                                            ? item.description.slice(0, 50)
                                            : item.description}
                                    </ThemedText>
                                }
                            />
                        ))}
                </ScrollView>
            </ThemedView>
        </EditScreenShell>
    );
}
