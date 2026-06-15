import { useMemo, useState } from "react";
import { Pressable, ScrollView, useWindowDimensions, View } from "react-native";
import { X } from "lucide-react-native";
import ModalBase from "@/components/ModalBase";
import { Toolbar } from "@/components/Toolbar";
import { ThemedText } from "@/components/themed";
import { HighlightedView } from "@/components/HighlightedView";
import { useStyles } from "@/hooks/useStyles";
import { useAppTheme } from "@/hooks/useAppTheme";
import type { FeatureRow } from "@/hooks/data/useCharacterFeatures";
import type { ItemRow } from "@/hooks/data/useCharacterItems";
import type { CharacterSpellWithDetails } from "@/hooks/data/useCharacterSpells";
import type {
    CharacterCombatActionRow,
    CombatActionSourceType,
} from "@/hooks/data/useCharacterCombatActions";

type PickerOption = {
    sourceType: CombatActionSourceType;
    sourceId: string;
    name: string;
    subtitle: string;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onPick: (input: {
        source_type: CombatActionSourceType;
        source_id: string;
    }) => void;
    features: FeatureRow[];
    items: ItemRow[];
    spells: CharacterSpellWithDetails[];
    pinned: CharacterCombatActionRow[];
};

const SECTION_LABEL: Record<CombatActionSourceType, string> = {
    feature: "Features",
    item: "Items",
    spell: "Spells",
};

export function CombatActionPickerModal({
    isOpen,
    onClose,
    onPick,
    features,
    items,
    spells,
    pinned,
}: Props) {
    const { color } = useAppTheme();
    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const [search, setSearch] = useState("");

    const { styles } = useStyles((t, c) => ({
        sheet: {
            width: Math.min(360, windowWidth * 0.92),
            maxHeight: windowHeight * 0.85,
            backgroundColor: c("surface.background"),
            borderRadius: t.borderRadius.lg,
            padding: t.spacing.lg,
            gap: t.spacing.md,
        },
        header: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
        },
        closeButton: {
            padding: t.spacing.xs,
        },
        scroll: { flexShrink: 1, minHeight: 0 },
        scrollContent: { gap: t.spacing.md },
        section: { gap: t.spacing.xs },
        sectionLabel: {
            fontSize: 11,
            letterSpacing: 2,
        },
        row: {
            backgroundColor: c("card.background"),
            borderRadius: t.borderRadius.md,
            padding: t.spacing.md,
            gap: t.spacing.xxs,
        },
        empty: {
            paddingVertical: t.spacing.xl,
            alignItems: "center",
        },
    }));

    const pinnedSet = useMemo(
        () =>
            new Set(pinned.map((row) => `${row.source_type}:${row.source_id}`)),
        [pinned],
    );

    const options = useMemo<PickerOption[]>(() => {
        const out: PickerOption[] = [];

        for (const f of features) {
            if (!f.feature_id) continue;
            out.push({
                sourceType: "feature",
                sourceId: f.feature_id,
                name: f.feature_name ?? "Unknown",
                subtitle: f.feature_description ?? "",
            });
        }
        for (const item of items) {
            out.push({
                sourceType: "item",
                sourceId: item.id,
                name: item.name,
                subtitle: item.description ?? "",
            });
        }
        for (const s of spells) {
            if (!s.spells) continue;
            out.push({
                sourceType: "spell",
                sourceId: s.spell_id,
                name: s.spells.name,
                subtitle: s.spells.description ?? "",
            });
        }

        return out.filter(
            (o) => !pinnedSet.has(`${o.sourceType}:${o.sourceId}`),
        );
    }, [features, items, spells, pinnedSet]);

    const query = search.trim().toLowerCase();
    const filtered = query
        ? options.filter(
              (o) =>
                  o.name.toLowerCase().includes(query) ||
                  o.subtitle.toLowerCase().includes(query),
          )
        : options;

    const grouped: Record<CombatActionSourceType, PickerOption[]> = {
        feature: [],
        item: [],
        spell: [],
    };
    for (const o of filtered) grouped[o.sourceType].push(o);

    const handleClose = () => {
        setSearch("");
        onClose();
    };

    return (
        <ModalBase isOpen={isOpen} setIsOpen={(open) => !open && handleClose()}>
            <HighlightedView style={styles.sheet}>
                <View style={styles.header}>
                    <ThemedText color="text.heading" variant="headline">
                        Add combat action
                    </ThemedText>
                    <Pressable
                        accessibilityLabel="Close picker"
                        accessibilityRole="button"
                        style={styles.closeButton}
                        onPress={handleClose}
                    >
                        <X color={color("text.muted")} size={20} />
                    </Pressable>
                </View>

                <Toolbar
                    placeholder="Search features, items, spells..."
                    search={search}
                    onSearchChange={setSearch}
                />

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    style={styles.scroll}
                >
                    {filtered.length === 0 && (
                        <View style={styles.empty}>
                            <ThemedText color="text.muted">
                                Nothing to add.
                            </ThemedText>
                        </View>
                    )}

                    {(Object.keys(grouped) as CombatActionSourceType[]).map(
                        (sectionKey) => {
                            const rows = grouped[sectionKey];
                            if (rows.length === 0) return null;
                            return (
                                <View key={sectionKey} style={styles.section}>
                                    <ThemedText
                                        color="text.muted"
                                        style={styles.sectionLabel}
                                    >
                                        {SECTION_LABEL[
                                            sectionKey
                                        ].toUpperCase()}
                                    </ThemedText>
                                    {rows.map((o) => (
                                        <Pressable
                                            key={`${o.sourceType}:${o.sourceId}`}
                                            style={styles.row}
                                            onPress={() => {
                                                onPick({
                                                    source_type: o.sourceType,
                                                    source_id: o.sourceId,
                                                });
                                                handleClose();
                                            }}
                                        >
                                            <ThemedText
                                                color="text.heading"
                                                variant="label"
                                            >
                                                {o.name}
                                            </ThemedText>
                                            {!!o.subtitle && (
                                                <ThemedText
                                                    color="text.muted"
                                                    numberOfLines={2}
                                                    variant="body"
                                                >
                                                    {o.subtitle}
                                                </ThemedText>
                                            )}
                                        </Pressable>
                                    ))}
                                </View>
                            );
                        },
                    )}
                </ScrollView>
            </HighlightedView>
        </ModalBase>
    );
}
