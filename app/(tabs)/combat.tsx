import { ScrollView, View, Pressable } from "react-native";
import { useMemo, useState } from "react";
import { Plus, X } from "lucide-react-native";
import { ThemedView, ThemedText } from "@/components/themed";
import { useStyles } from "@/hooks/useStyles";
import { useAppTheme } from "@/hooks/useAppTheme";
import HealthBar from "@/components/combat/HealthBar";
import StatRow from "@/components/combat/StatRow";
import DeathSaves from "@/components/combat/DeathSaves";
import CombatActionCard, {
    CombatAction,
} from "@/components/combat/CombatActionCard";
import { CombatActionPickerModal } from "@/components/combat/CombatActionPickerModal";
import { InventoryItemCard } from "@/components/inventory/InventoryItemCard";
import { SpellCard } from "@/components/spells/SpellCard";
import { EditScreenShell } from "@/components/editing/EditScreenShell";
import { useCharacterId } from "@/context/CharacterIdContext";
import {
    useAddCombatAction,
    useCharacter,
    useCharacterCombatActions,
    useCharacterFeatures,
    useCharacterItems,
    useCharacterSpells,
    useCharacterSpellSlots,
    useClasses,
    useRemoveCombatAction,
} from "@/hooks/data";
import { useCharacterEditor } from "@/hooks/editing/useCharacterEditor";
import { useFieldEditorModals } from "@/hooks/editing/useFieldEditorModals";
import type { FeatureRow } from "@/hooks/data/useCharacterFeatures";
import type { ItemRow } from "@/hooks/data/useCharacterItems";
import type { CharacterSpellWithDetails } from "@/hooks/data/useCharacterSpells";

const ORIGIN_TYPE_LABELS: Record<
    NonNullable<FeatureRow["origin_type"]>,
    string
> = {
    class: "Class Feature",
    subclass: "Subclass Feature",
    race: "Racial Feature",
    character: "Character Trait",
    background: "Background Feature",
    feat: "Feat",
    other: "Feature",
};

function featureToAction(feature: FeatureRow): CombatAction {
    return {
        id: feature.feature_id ?? "",
        name: feature.feature_name ?? "Unknown",
        type: feature.origin_type
            ? ORIGIN_TYPE_LABELS[feature.origin_type]
            : "Feature",
        range: "—",
        effect: feature.feature_description ?? "",
    };
}

type ResolvedCombatAction =
    | {
          sourceType: "feature";
          sourceId: string;
          feature: FeatureRow;
      }
    | {
          sourceType: "item";
          sourceId: string;
          item: ItemRow;
      }
    | {
          sourceType: "spell";
          sourceId: string;
          spell: CharacterSpellWithDetails;
      };

export default function CombatScreen() {
    const { color } = useAppTheme();
    const { styles } = useStyles((t, c) => ({
        screen: { flex: 1 },
        scroll: { padding: t.spacing.lg, gap: t.spacing.xl },
        header: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: t.spacing.md,
        },
        headerLeft: { flex: 1, gap: t.spacing.xxs },
        headerRight: { flexShrink: 0, alignItems: "flex-end" },
        encounterLabel: { fontSize: 11, letterSpacing: 2 },
        characterName: { fontSize: 32, lineHeight: 38 },
        levelText: { fontSize: 12 },
        classText: { fontSize: 16 },
        sectionHeader: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        },
        sectionHeaderRight: {
            flexDirection: "row",
            alignItems: "center",
            gap: t.spacing.sm,
        },
        slotsBadge: {
            borderWidth: 1,
            borderRadius: t.borderRadius.sm,
            paddingHorizontal: t.spacing.sm,
            paddingVertical: t.spacing.xxs,
        },
        slotsText: { fontSize: 12 },
        addButton: {
            width: 36,
            height: 36,
            borderRadius: t.borderRadius.full,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: c("surface.surfaceElevated"),
        },
        actionsGroup: { gap: t.spacing.md },
        actionRow: {
            flexDirection: "row",
            alignItems: "center",
            gap: t.spacing.sm,
        },
        actionCardWrapper: { flex: 1 },
        removeButton: {
            width: 36,
            height: 36,
            borderRadius: t.borderRadius.full,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: c("surface.surfaceElevated"),
        },
        emptyState: {
            paddingVertical: t.spacing.lg,
            alignItems: "center",
        },
    }));

    const characterId = useCharacterId();
    const [isEditMode, setIsEditMode] = useState(false);
    const [isPickerOpen, setIsPickerOpen] = useState(false);

    const { data: character } = useCharacter(characterId);
    const { data: availableClasses } = useClasses();
    const { data: features } = useCharacterFeatures(characterId);
    const { data: items } = useCharacterItems(characterId);
    const { data: spells } = useCharacterSpells(characterId);
    const { data: spellSlots } = useCharacterSpellSlots(characterId);
    const { data: pinnedCombatActions } =
        useCharacterCombatActions(characterId);

    const { updateCharacter } = useCharacterEditor(characterId);
    const { openNumeric, modals } = useFieldEditorModals();
    const addCombatAction = useAddCombatAction(characterId);
    const removeCombatAction = useRemoveCombatAction(characterId);

    const characterClass = availableClasses?.find(
        (cls) => character?.class_id === cls.id,
    );

    const combatActions = useMemo<ResolvedCombatAction[]>(() => {
        const featureById = new Map(
            (features ?? [])
                .filter((f) => !!f.feature_id)
                .map((f) => [f.feature_id as string, f]),
        );
        const itemById = new Map((items ?? []).map((i) => [i.id, i]));
        const spellById = new Map((spells ?? []).map((s) => [s.spell_id, s]));

        return (pinnedCombatActions ?? []).flatMap(
            (pin): ResolvedCombatAction[] => {
                if (pin.source_type === "feature") {
                    const feature = featureById.get(pin.source_id);
                    if (!feature) return [];
                    return [
                        {
                            sourceType: "feature",
                            sourceId: pin.source_id,
                            feature,
                        },
                    ];
                }
                if (pin.source_type === "item") {
                    const item = itemById.get(pin.source_id);
                    if (!item) return [];
                    return [
                        {
                            sourceType: "item",
                            sourceId: pin.source_id,
                            item,
                        },
                    ];
                }
                if (pin.source_type === "spell") {
                    const spell = spellById.get(pin.source_id);
                    if (!spell) return [];
                    return [
                        {
                            sourceType: "spell",
                            sourceId: pin.source_id,
                            spell,
                        },
                    ];
                }
                return [];
            },
        );
    }, [features, items, spells, pinnedCombatActions]);

    const totalSlotsLeft = (spellSlots ?? []).reduce(
        (sum, s) => sum + s.current,
        0,
    );
    const totalSlotsMax = (spellSlots ?? []).reduce((sum, s) => sum + s.max, 0);

    return (
        <EditScreenShell
            isEditMode={isEditMode}
            style={styles.screen}
            onToggleEditMode={() => setIsEditMode((v) => !v)}
        >
            <ThemedView
                backgroundColor="surface.background"
                style={styles.screen}
            >
                {modals}
                <ScrollView contentContainerStyle={styles.scroll}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <ThemedText
                                color="palette.secondary"
                                style={styles.encounterLabel}
                            >
                                CURRENT ENCOUNTER
                            </ThemedText>
                            <ThemedText
                                color="text.heading"
                                style={styles.characterName}
                                variant="headline"
                            >
                                {character?.name}
                            </ThemedText>
                        </View>
                        <View style={styles.headerRight}>
                            <ThemedText
                                color="text.muted"
                                style={styles.levelText}
                            >
                                LEVEL {character?.level}
                            </ThemedText>
                            <ThemedText
                                color="text.heading"
                                style={styles.classText}
                                variant="label"
                            >
                                {characterClass?.name}
                            </ThemedText>
                        </View>
                    </View>

                    {/* Hit Points */}
                    <HealthBar
                        currentHp={character?.hp_current ?? 0}
                        isEditMode={isEditMode}
                        maxHp={character?.hp_max ?? 0}
                        tempHp={character?.hp_temp ?? 0}
                        onEditCurrentHp={() =>
                            openNumeric({
                                label: "Current HP",
                                initialValue: character?.hp_current ?? 0,
                                min: 0,
                                onSubmit: (value) =>
                                    updateCharacter.mutate({
                                        hp_current: value,
                                    }),
                            })
                        }
                        onEditMaxHp={() =>
                            openNumeric({
                                label: "Max HP",
                                initialValue: character?.hp_max ?? 0,
                                min: 1,
                                onSubmit: (value) =>
                                    updateCharacter.mutate({ hp_max: value }),
                            })
                        }
                        onEditTempHp={() =>
                            openNumeric({
                                label: "Temp HP",
                                initialValue: character?.hp_temp ?? 0,
                                min: 0,
                                onSubmit: (value) =>
                                    updateCharacter.mutate({ hp_temp: value }),
                            })
                        }
                    />

                    {/* Combat Stats */}
                    <StatRow
                        armorClass={character?.armor_class ?? 0}
                        initiative={character?.initiative ?? 0}
                        isEditMode={isEditMode}
                        speed={character?.speed ?? 0}
                        onEditArmorClass={() =>
                            openNumeric({
                                label: "Armor class",
                                initialValue: character?.armor_class ?? 0,
                                min: 0,
                                onSubmit: (value) =>
                                    updateCharacter.mutate({
                                        armor_class: value,
                                    }),
                            })
                        }
                        onEditInitiative={() =>
                            openNumeric({
                                label: "Initiative",
                                initialValue: character?.initiative ?? 0,
                                onSubmit: (value) =>
                                    updateCharacter.mutate({
                                        initiative: value,
                                    }),
                            })
                        }
                        onEditSpeed={() =>
                            openNumeric({
                                label: "Speed (ft)",
                                initialValue: character?.speed ?? 0,
                                min: 0,
                                onSubmit: (value) =>
                                    updateCharacter.mutate({ speed: value }),
                            })
                        }
                    />

                    {/* Death Saves */}
                    <DeathSaves
                        failures={character?.death_save_fail ?? 0}
                        successes={character?.death_save_success ?? 0}
                        onFailuresChange={(value) =>
                            updateCharacter.mutate({ death_save_fail: value })
                        }
                        onSuccessesChange={(value) =>
                            updateCharacter.mutate({
                                death_save_success: value,
                            })
                        }
                    />

                    {/* Combat Actions */}
                    <View style={styles.actionsGroup}>
                        <View style={styles.sectionHeader}>
                            <ThemedText color="text.heading" variant="headline">
                                Combat Actions
                            </ThemedText>
                            <View style={styles.sectionHeaderRight}>
                                {totalSlotsMax > 0 && (
                                    <View style={styles.slotsBadge}>
                                        <ThemedText
                                            color="semantic.success"
                                            style={styles.slotsText}
                                        >
                                            {totalSlotsLeft} / {totalSlotsMax}{" "}
                                            Slots
                                        </ThemedText>
                                    </View>
                                )}
                                <Pressable
                                    accessibilityLabel="Add combat action"
                                    accessibilityRole="button"
                                    style={styles.addButton}
                                    onPress={() => setIsPickerOpen(true)}
                                >
                                    <Plus
                                        color={color("text.body")}
                                        size={18}
                                    />
                                </Pressable>
                            </View>
                        </View>
                        {combatActions.length === 0 && (
                            <View style={styles.emptyState}>
                                <ThemedText color="text.muted">
                                    Tap + to add a feature, item, or spell.
                                </ThemedText>
                            </View>
                        )}
                        {combatActions.map((entry) => (
                            <View
                                key={`${entry.sourceType}:${entry.sourceId}`}
                                style={styles.actionRow}
                            >
                                <View style={styles.actionCardWrapper}>
                                    {entry.sourceType === "feature" && (
                                        <CombatActionCard
                                            action={featureToAction(
                                                entry.feature,
                                            )}
                                        />
                                    )}
                                    {entry.sourceType === "item" && (
                                        <InventoryItemCard
                                            isEditMode={false}
                                            item={entry.item}
                                        />
                                    )}
                                    {entry.sourceType === "spell" && (
                                        <SpellCard spell={entry.spell} />
                                    )}
                                </View>
                                {isEditMode && (
                                    <Pressable
                                        accessibilityLabel="Remove combat action"
                                        accessibilityRole="button"
                                        style={styles.removeButton}
                                        onPress={() =>
                                            removeCombatAction.mutate({
                                                source_type: entry.sourceType,
                                                source_id: entry.sourceId,
                                            })
                                        }
                                    >
                                        <X
                                            color={color("semantic.error")}
                                            size={18}
                                        />
                                    </Pressable>
                                )}
                            </View>
                        ))}
                    </View>
                </ScrollView>
                <CombatActionPickerModal
                    features={features ?? []}
                    isOpen={isPickerOpen}
                    items={items ?? []}
                    pinned={pinnedCombatActions ?? []}
                    spells={spells ?? []}
                    onClose={() => setIsPickerOpen(false)}
                    onPick={(input) => addCombatAction.mutate(input)}
                />
            </ThemedView>
        </EditScreenShell>
    );
}
