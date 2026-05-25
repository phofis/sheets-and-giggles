import { ScrollView, View } from "react-native";
import { ThemedHeadline, ThemedText, ThemedView } from "@/components/themed";
import { useStyles } from "@/hooks/useStyles";
import { CollapsibleCard } from "@/components/CollapsibleCard";
import { Treasury } from "@/components/inventory/Treasury";
import { Attunement } from "@/components/inventory/Attunement";
import { InventoryToolbar } from "@/components/inventory/NavigationBar";
import { useCharacterItems } from "@/hooks/data";
import { useMemo } from "react";
import { useState } from "react";
const characterId = "a1b2c3d4-e5f6-4789-a012-3456789abcde";

export default function InventoryScreen() {
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
        rarityTag: {
            paddingHorizontal: t.spacing.sm,
            paddingVertical: t.spacing.xs,
            borderRadius: t.borderRadius.xl,
            backgroundColor: c("surface.surfaceElevated"),
        },
        itemStatRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: t.spacing.md,
        },
        itemStat: {
            fontSize: 12,
            letterSpacing: 1,
            color: c("text.muted"),
        },
    }));
    const { data: items, isLoading } = useCharacterItems(characterId);
    const attunedItems = useMemo(
        () => (items ?? []).filter((i) => i.attuned),
        [items],
    );
    const [search, setSearch] = useState("");
    //TODO: add onPress to buttons. -filtering, removing searching...
    //TODO: add Attuned button on every item card
    //TODO: add writable field for misc items
    //TODO: move itemCard to separate component

    return (
        <ThemedView style={styles.screen}>
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
                
                <InventoryToolbar
                    search={search}
                    onSearchChange={setSearch}
                    onAddPress={() => {}}
                    onDeletePress={() => {}}
                    onFilterPress={() => {}}
                />
                {(items ?? []).map((item) => (
                    <CollapsibleCard
                        key={item.name}
                        header={
                            <View>
                                <View style={styles.itemHeader}>
                                    <ThemedText
                                        color="text.heading"
                                        variant="label"
                                    >
                                        {item.name}
                                    </ThemedText>
                                    {/* <View style={styles.rarityTag}>
                                        <ThemedText
                                            color="text.muted"
                                            variant="body"
                                        >
                                            {item.rarity}
                                        </ThemedText>
                                    </View> */}
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
                        fullContent={
                            <View style={styles.itemStatRow}>
                                <ThemedText color="text.body" variant="body">
                                    {item.description}
                                </ThemedText>
                            </View>
                        }
                    />
                ))}
            </ScrollView>
        </ThemedView>
    );
}
