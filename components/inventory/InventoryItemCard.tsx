import { useStyles } from "@/hooks/useStyles";
import { ThemedText } from "../themed/ThemedText";
import { ThemedView } from "../themed/ThemedView";
import { CollapsibleCard } from "@/components/CollapsibleCard";
import { Slider } from "@/components/Slider";
import { ErrorModal } from "@/components/ErrorModal";
import {
    ItemRow,
    useUpdateCharacterItem,
    useDeleteCharacterItem,
} from "@/hooks/data/useCharacterItems";
import { Pressable } from "react-native";
import {
    Sword,
    FlaskRound,
    Shirt,
    Medal,
    Scroll,
    Sparkles,
    Edit3,
    Trash2,
    Share2,
} from "lucide-react-native";
import { useState } from "react";
import { ItemShareModal } from "@/components/inventory/ItemShareModal";
import { useCharacterId } from "@/context/CharacterIdContext";
import { useFieldEditorModals } from "@/hooks/editing/useFieldEditorModals";
import { itemFormFields } from "@/components/inventory/InventoryToolbar";
import { ThemeColorKey } from "@/constants/themes";

interface InventoryItemCardProps {
    item: ItemRow;
    isEditMode: boolean;
}

export function InventoryItemCard({
    item,
    isEditMode,
}: InventoryItemCardProps) {
    const characterId = useCharacterId();
    const updateCharacterItem = useUpdateCharacterItem(characterId!);
    const deleteCharacterItem = useDeleteCharacterItem(characterId!);
    const { styles, color } = useStyles((t, c) => ({
        card: {
            marginBottom: t.spacing.xs,
            width: "95%",
            alignSelf: "center",
        },
        titleRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: t.spacing.sm,
            marginBottom: t.spacing.sm,
        },
        titleSection: {
            flexDirection: "row",
            alignItems: "center",
            gap: t.spacing.sm,
            flex: 1,
            minWidth: 0,
        },
        title: {
            fontSize: 18,
            flexShrink: 1,
        },
        rightSection: {
            flexDirection: "row",
            alignItems: "center",
            gap: t.spacing.sm,
            flexShrink: 0,
        },
        quantity: {
            fontSize: 14,
            textAlign: "right",
            color: c("text.muted"),
        },
        rarity: {
            fontSize: 12,
        },
        shortContent: {
            marginBottom: t.spacing.sm,
            paddingBottom: t.spacing.sm,
            borderBottomWidth: 1,
            borderBottomColor: c("border.subtle"),
        },
        metaRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: t.spacing.sm,
        },
        metaItem: {
            flexDirection: "row",
            alignItems: "center",
            gap: t.spacing.xs,
        },
        metaLabel: {
            fontSize: 12,
            fontWeight: "600",
        },
        metaValue: {
            fontSize: 12,
        },
        description: {
            marginTop: t.spacing.sm,
            lineHeight: 20,
        },
        contentRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: t.spacing.md,
            marginTop: t.spacing.sm,
        },
        descriptionContainer: {
            flex: 1,
        },
        attunementRow: {
            flexShrink: 0,
        },
        editButton: {
            flexDirection: "row",
            alignItems: "center",
            gap: t.spacing.xs,
            padding: t.spacing.xs,
            borderRadius: t.borderRadius.md,
            backgroundColor: c("surface.surfaceElevated"),
        },
        editButtonText: {
            fontSize: 12,
            fontWeight: "600",
        },
        actionsContainer: {
            flexDirection: "row",
            alignItems: "center",
            gap: t.spacing.xs,
            flexShrink: 0,
        },
    }));

    const { openForm, modals } = useFieldEditorModals();
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isAttunedWarningOpen, setIsAttunedWarningOpen] = useState(false);

    const iconByTag = {
        Weapon: <Sword color={color("text.muted")} size={16} />,
        Armor: <Shirt color={color("text.muted")} size={16} />,
        Potion: <FlaskRound color={color("text.muted")} size={16} />,
        Other: <Sparkles color={color("text.muted")} size={16} />,
        Scroll: <Scroll color={color("text.muted")} size={16} />,
        Accessory: <Medal color={color("text.muted")} size={16} />,
    } as const;
    const colorByRarity = {
        None: "rarity.none",
        Common: "rarity.common",
        Uncommon: "rarity.uncommon",
        Rare: "rarity.rare",
        "Very Rare": "rarity.veryRare",
        Legendary: "rarity.legendary",
        Artifact: "rarity.artifact",
    } as const;
    const itemIcon = iconByTag[item.tag] ?? iconByTag.Other;
    const quantityLabel = item.quantity > 1 ? ` x${item.quantity}` : "";

    const editableFields = itemFormFields.map((field) => ({
        ...field,
        initialValue:
            field.name === "name"
                ? item.name
                : field.name === "description"
                  ? (item.description ?? "")
                  : field.name === "rarity"
                    ? item.rarity
                    : field.name === "tag"
                      ? (item.tag ?? "Other")
                      : field.name === "quantity"
                        ? item.quantity
                        : field.name === "requires_attunement"
                          ? Boolean(item.requires_attunement)
                          : field.initialValue,
    }));

    const handleEditSubmit = (
        values: Record<string, string | number | boolean>,
    ) => {
        if (!characterId) return;

        const patch: Record<string, string | number | boolean> = {
            name: String(values.name ?? item.name),
            description: String(values.description ?? item.description ?? ""),
            rarity: String(values.rarity ?? item.rarity),
            tag: String(values.tag ?? item.tag ?? "Other"),
            quantity:
                typeof values.quantity === "number"
                    ? values.quantity
                    : parseInt(String(values.quantity ?? item.quantity), 10),
            requires_attunement: Boolean(values.requires_attunement),
        };

        if (!patch.requires_attunement && item.attuned) {
            patch.attuned = false;
        }

        updateCharacterItem.mutate({
            itemId: item.id,
            patch,
        });
    };

    const toggleAttuned = () => {
        if (!characterId) return;
        updateCharacterItem.mutate({
            itemId: item.id,
            patch: { attuned: !item.attuned },
        });
    };

    const shortContent = null;

    const longContent = (
        <ThemedView style={styles.contentRow}>
            <ThemedView style={styles.descriptionContainer}>
                {item.description && (
                    <ThemedText
                        color="text.body"
                        style={styles.description}
                        variant="body"
                    >
                        {item.description}
                    </ThemedText>
                )}
            </ThemedView>

            {item.requires_attunement && (
                <Pressable
                    style={styles.attunementRow}
                    onPress={(e) => {
                        e.stopPropagation?.();
                    }}
                >
                    <Slider
                        activeColor="semantic.success"
                        inactiveColor="text.muted"
                        label="Attuned"
                        value={item.attuned}
                        onValueChange={toggleAttuned}
                    />
                </Pressable>
            )}
        </ThemedView>
    );

    const openEditModal = () => {
        openForm({
            title: "Edit inventory item",
            submitLabel: "Save changes",
            fields: editableFields,
            onSubmit: handleEditSubmit,
        });
    };

    const header = (
        <ThemedView style={styles.titleRow}>
            <ThemedView style={styles.titleSection}>
                <ThemedView>{itemIcon}</ThemedView>

                <ThemedText
                    color="text.heading"
                    style={styles.title}
                    variant="label"
                >
                    {item.name}
                </ThemedText>

                {quantityLabel && (
                    <ThemedText
                        color="text.heading"
                        style={styles.quantity}
                        variant="body"
                    >
                        {quantityLabel}
                    </ThemedText>
                )}
            </ThemedView>

            <ThemedView style={styles.rightSection}>
                {item.rarity && item.rarity !== "None" && (
                    <ThemedText
                        style={[
                            styles.rarity,
                            {
                                color: color(colorByRarity[item.rarity]),
                            },
                        ]}
                        variant="body"
                    >
                        {item.rarity}
                    </ThemedText>
                )}
                <Pressable
                    style={[
                        styles.editButton,
                        item.attuned && { opacity: 0.4 },
                    ]}
                    onPress={(e) => {
                        e.stopPropagation?.();
                        if (item.attuned) {
                            setIsAttunedWarningOpen(true);
                        } else {
                            setIsShareModalOpen(true);
                        }
                    }}
                >
                    <Share2
                        color={color(
                            item.attuned ? "text.muted" : "palette.secondary",
                        )}
                        size={16}
                    />
                </Pressable>

                {isEditMode && (
                    <Pressable
                        style={styles.editButton}
                        onPress={(e) => {
                            e.stopPropagation?.();
                            openEditModal();
                        }}
                    >
                        <Edit3 color={color("text.body")} size={16} />
                        <ThemedText
                            color="text.body"
                            style={styles.editButtonText}
                            variant="body"
                        >
                            Edit
                        </ThemedText>
                    </Pressable>
                )}
                {isEditMode && (
                    <Pressable
                        style={styles.editButton}
                        onPress={(e) => {
                            e.stopPropagation?.();
                            deleteCharacterItem.mutate(item.id);
                        }}
                    >
                        <Trash2 color={color("semantic.error")} size={16} />
                    </Pressable>
                )}
            </ThemedView>
        </ThemedView>
    );

    return (
        <>
            {modals}
            <ItemShareModal
                isOpen={isShareModalOpen}
                item={item}
                onClose={() => setIsShareModalOpen(false)}
            />
            <ErrorModal
                isOpen={isAttunedWarningOpen}
                message={`You cannot share "${item.name}" while it is attuned. Remove attunement first, then try again.`}
                title="🔒 Item Attuned"
                onClose={() => setIsAttunedWarningOpen(false)}
            />
            <CollapsibleCard
                fullContent={longContent}
                glowColor={colorByRarity[item.rarity] as ThemeColorKey}
                header={header}
                shortContent={shortContent}
                style={styles.card}
            />
        </>
    );
}
