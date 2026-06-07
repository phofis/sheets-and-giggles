import { ScrollView, View, ActivityIndicator } from "react-native";
import React, { useMemo, useState } from "react";
import { ThemedHeadline, ThemedText, ThemedView } from "@/components/themed";
import { useStyles } from "@/hooks/useStyles";
import { Treasury } from "@/components/inventory/Treasury";
import { Attunement } from "@/components/inventory/Attunement";
import { InventoryToolbar } from "@/components/inventory/InventoryToolbar";
import { InventoryItemCard } from "@/components/inventory/InventoryItemCard";
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
        },
    }));

    const { data: items, isLoading } = useCharacterItems(characterId);

    const filteredItems = useMemo(
        () => (items ?? []).filter((item) => matchesItemFilters(item, search, filters)),
        [items, search, filters],
    );

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
                        ? filters.rarity ?? ""
                        : field.name === "tag"
                          ? filters.tag ?? ""
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
                    </View>

                    <InventoryToolbar
                        search={search}
                        onFilterPress={openFilterModal}
                        onCreateItem={handleCreateItem}
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
                        filteredItems.map((item) => (
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
