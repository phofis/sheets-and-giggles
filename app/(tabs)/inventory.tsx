import { ScrollView, View } from "react-native";
import { ThemedHeadline, ThemedText, ThemedView } from "@/components/themed";
import { useStyles } from "@/hooks/useStyles";
import { CollapsibleCard } from "@/components/CollapsibleCard";
import { Treasury } from "@/components/inventory/Treasury";
import { Attunement } from "@/components/inventory/Attunement";

const inventoryItems = [
    {
        name: "Sunblade",
        rarity: "Rare",
        attuned: true,
        weight: "3.0 lbs",
        value: "5,000 GP",
        description:
            "This magic longsword's blade is made of pure radiance. It deals 1d8 radiant damage instead of slashing damage and sheds bright light in a 15ft radius.",
    },
    {
        name: "Shield of Expression",
        rarity: "Uncommon",
        attuned: false,
        weight: "6.0 lbs",
        value: "150 GP",
        description:
            "While holding this shield, you can use a bonus action to alter the face's expression, making it appear stern, happy, or terrifying.",
    },
    {
        name: "Explorer's Pack",
        rarity: "Common",
        attuned: false,
        weight: "20.0 lbs",
        value: "10 GP",
        description:
            "Includes a backpack, bedroll, mess kit, tinderbox, 10 torches, 10 days of rations, and a waterskin.",
    },
];

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
                    <Attunement />
                </View>

                <View style={[styles.inventoryHeader, styles.sectionSpacing]}>
                    <ThemedHeadline color="text.heading">
                        Inventory
                    </ThemedHeadline>
                    <ThemedText
                        color="text.muted"
                        variant="body"
                        style={styles.inventorySubtext}
                    >
                        64.5 / 150 lbs carried
                    </ThemedText>
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

                {inventoryItems.map((item) => (
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
                                    <View style={styles.rarityTag}>
                                        <ThemedText
                                            color="text.muted"
                                            variant="body"
                                        >
                                            {item.rarity}
                                        </ThemedText>
                                    </View>
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
                            <View style={styles.itemStatRow}>
                                <ThemedText
                                    color="text.muted"
                                    style={styles.itemStat}
                                >
                                    {item.weight}
                                </ThemedText>
                                <ThemedText
                                    color="text.muted"
                                    style={styles.itemStat}
                                >
                                    {item.value}
                                </ThemedText>
                            </View>
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
