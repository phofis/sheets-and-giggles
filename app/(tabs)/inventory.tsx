import { Pressable, ScrollView, View, ActivityIndicator } from "react-native";
import React, { useState, useMemo } from "react";
import { ThemedHeadline, ThemedText, ThemedView } from "@/components/themed";
import { useStyles } from "@/hooks/useStyles";
import { Treasury } from "@/components/inventory/Treasury";
import { Attunement } from "@/components/inventory/Attunement";
import { InventoryToolbar } from "@/components/inventory/InventoryToolbar";
import { InventoryItemCard } from "@/components/inventory/InventoryItemCard";
import { ItemScannerModal } from "@/components/inventory/ItemScannerModal";
import {
    itemFilterFormFields,
    matchesItemFilters,
    parseItemFilterValues,
    type ItemFilters,
} from "@/components/inventory/itemFilters";
import { EditScreenShell } from "@/components/editing/EditScreenShell";
import { useCharacterItems, useCreateCharacterItem } from "@/hooks/data";
import { useCharacterId } from "@/context/CharacterIdContext";
import { useFieldEditorModals } from "@/hooks/editing/useFieldEditorModals";

export default function InventoryScreen() {
    const characterId = useCharacterId();
    const [isEditMode, setIsEditMode] = useState(false);
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState<ItemFilters>({});
    const { openForm, modals: filterModals } = useFieldEditorModals();
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
        empty: {
            marginTop: t.spacing.xl,
            textAlign: "center",
        },
        loading: {
            marginTop: t.spacing.xl,
            alignItems: "center",
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
        scanButton: {
            flexDirection: "row",
            alignItems: "center",
            gap: t.spacing.xs,
            paddingHorizontal: t.spacing.md,
            paddingVertical: t.spacing.xs,
            borderRadius: t.borderRadius.md,
            backgroundColor: c("surface.surfaceElevated"),
        },
        scanButtonText: {
            fontSize: 13,
            fontWeight: "600",
        },
    }));

    const { data: items, isLoading } = useCharacterItems(characterId);

    const filteredItems = useMemo(
        () =>
            (items ?? []).filter((item) =>
                matchesItemFilters(item, search, filters),
            ),
        [items, search, filters],
    );

    // Merge rows that represent the exact same item so the user sees one card
    // with a combined quantity (e.g. arrows received via QR transfer).
    const clusteredItems = useMemo(() => {
        const groups = new Map<
            string,
            { representative: (typeof filteredItems)[number]; total: number }
        >();
        for (const item of filteredItems) {
            const key = [
                item.name.trim().toLowerCase(),
                (item.description ?? "").trim().toLowerCase(),
                item.rarity ?? "",
                item.tag ?? "",
                item.requires_attunement ? "1" : "0",
                item.attuned ? "1" : "0",
            ].join("|");
            const existing = groups.get(key);
            if (existing) {
                existing.total += item.quantity ?? 1;
            } else {
                groups.set(key, {
                    representative: item,
                    total: item.quantity ?? 1,
                });
            }
        }
        return Array.from(groups.values()).map(({ representative, total }) => ({
            ...representative,
            quantity: total,
        }));
    }, [filteredItems]);

    const attunedItems = useMemo(
        () => (items ?? []).filter((i) => i.attuned),
        [items],
    );

    const openFilterModal = () => {
        openForm({
            title: "Filter items",
            submitLabel: "Apply filters",
            fields: itemFilterFormFields.map((field) => ({
                ...field,
                initialValue:
                    field.name === "rarity"
                        ? (filters.rarity ?? "")
                        : field.name === "tag"
                          ? (filters.tag ?? "")
                          : filters.requires_attunement === undefined
                            ? ""
                            : String(filters.requires_attunement),
            })),
            onSubmit: (values) => setFilters(parseItemFilterValues(values)),
        });
    };

    return (
        <EditScreenShell
            isEditMode={isEditMode}
            style={styles.screen}
            onToggleEditMode={() => setIsEditMode((v) => !v)}
        >
            <ItemScannerModal
                isOpen={isScannerOpen}
                onClose={() => setIsScannerOpen(false)}
            />
            <ThemedView style={styles.screen}>
                {filterModals}
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
                        <Pressable
                            style={styles.scanButton}
                            onPress={() => setIsScannerOpen(true)}
                        >
                            <ThemedText
                                color="text.body"
                                style={styles.scanButtonText}
                                variant="body"
                            >
                                Claim Item
                            </ThemedText>
                        </Pressable>
                    </View>

                    <InventoryToolbar
                        search={search}
                        onCreateItem={handleCreateItem}
                        onFilterPress={openFilterModal}
                        onSearchChange={setSearch}
                    />

                    {isLoading ? (
                        <ThemedView style={styles.loading}>
                            <ActivityIndicator size="large" />
                            <ThemedText color="text.muted" variant="body">
                                Loading inventory...
                            </ThemedText>
                        </ThemedView>
                    ) : filteredItems.length === 0 ? (
                        <ThemedView style={styles.empty}>
                            <ThemedText color="text.muted" variant="body">
                                {items?.length
                                    ? "No items match your search."
                                    : "No items yet. Tap + to add one."}
                            </ThemedText>
                        </ThemedView>
                    ) : (
                        clusteredItems.map((item) => (
                            <InventoryItemCard
                                key={item.id}
                                isEditMode={isEditMode}
                                item={item}
                            />
                        ))
                    )}
                </ScrollView>
            </ThemedView>
        </EditScreenShell>
    );
}
