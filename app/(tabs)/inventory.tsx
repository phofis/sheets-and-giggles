import { ScrollView, View } from "react-native";
import React, { useState } from "react";
import { ThemedHeadline, ThemedText, ThemedView } from "@/components/themed";
import { useStyles } from "@/hooks/useStyles";
import { Treasury } from "@/components/inventory/Treasury";
import { Attunement } from "@/components/inventory/Attunement";
import { InventoryToolbar } from "@/components/inventory/InventoryToolbar";
import { InventoryItemCard } from "@/components/inventory/InventoryItemCard";
import { EditScreenShell } from "@/components/editing/EditScreenShell";
import { useCharacterItems, useCreateCharacterItem } from "@/hooks/data";
import { useCharacterId } from "@/context/CharacterIdContext";
import { useMemo } from "react";

export default function InventoryScreen() {
    const characterId = useCharacterId();
    const [isEditMode, setIsEditMode] = useState(false);
    const createCharacterItem = useCreateCharacterItem(characterId);

    const handleCreateItem = (item: {
        name: string;
        description?: string;
        rarity?: string;
        tag?: string;
        quantity?: number;
        requires_attunement?: boolean;
    }) => {
        createCharacterItem.mutate({
            name: item.name,
            description: item.description ?? "",
            rarity: (item.rarity?.trim() ? item.rarity : "None") as any,
            tag: (item.tag?.trim() ? item.tag : "") as any,
            quantity: item.quantity ?? 1,
            requires_attunement: item.requires_attunement ?? false,
        } as any);
    };

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
        commonSection: {
            marginTop: t.spacing.lg,
            padding: t.spacing.md,
            borderRadius: t.borderRadius.md,
            backgroundColor: c("surface.surfaceElevated"),
        },
        commonItemRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: t.spacing.xs,
        },
        commonItemName: {
            flex: 1,
            fontSize: 14,
        },
        commonItemQuantity: {
            fontSize: 12,
            color: c("text.muted"),
            marginLeft: t.spacing.sm,
        },
    }));

    const { data: items, isLoading } = useCharacterItems(characterId);
    const commonItems = useMemo(
        () => (items ?? []).filter((i) => i.rarity === "None"),
        [items],
    );
    const magicItems = useMemo(
        () => (items ?? []).filter((i) => i.rarity !== "None"),
        [items],
    );
    const attunedItems = useMemo(
        () => (magicItems ?? []).filter((i) => i.attuned),
        [magicItems],
    );

    return (
        <EditScreenShell
            isEditMode={isEditMode}
            style={styles.screen}
            onToggleEditMode={() => setIsEditMode((v) => !v)}
        >
            <ThemedView style={styles.screen}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.sectionSpacing}>
                        <Treasury isEditMode={isEditMode} />
                    </View>

                    <View style={styles.sectionSpacing}>
                        <Attunement
                            attunement_list={attunedItems.map((s) => s.name)}
                        />
                    </View>

                    <View
                        style={[styles.inventoryHeader, styles.sectionSpacing]}
                    >
                        <ThemedHeadline color="text.heading">
                            Inventory
                        </ThemedHeadline>
                    </View>

                    <InventoryToolbar
                        search=""
                        onSearchChange={() => {}}
                        onFilterPress={() => {}}
                        onCreateItem={handleCreateItem}
                    />

                    {!isLoading &&
                        (items ?? []).map((item) => (
                            <InventoryItemCard
                                key={item.id}
                                item={item}
                                isEditMode={isEditMode}
                            />
                        ))}
                </ScrollView>
            </ThemedView>
        </EditScreenShell>
    );
}
