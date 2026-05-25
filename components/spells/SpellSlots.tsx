import { Pressable } from "react-native";
import { useStyles } from "@/hooks/useStyles";
import { ThemedText } from "@/components/themed/ThemedText";
import { ThemedView } from "@/components/themed/ThemedView";
import { ThemedHeadline } from "../themed";
import { ButtonRow } from "../ButtonRow";
import { BoxWithGlow } from "../BoxWithGlow";
import { SpellSlotButton } from "./SpellSlotButton";

import { useCharacterSpellSlots } from "@/hooks/data/useCharacterSpellSlots";
import {
    useSpendSpellSlots,
    useResetSpellSlots,
} from "@/hooks/data/useCharacterSpellSlots";
import { useCharacter } from "@/hooks/data/useCharacter";
const characterId = "a1b2c3d4-e5f6-4789-a012-3456789abcde"; // TODO: get from context instead

//TODO: add lazy updates - immiedately change UI, update server once every few seconds or on unmount
export function SpellSlots() {
    const { styles } = useStyles((t, c) => ({
        header: {
            alignItems: "center",
            marginBottom: t.spacing.lg,
            marginTop: t.spacing.lg,
        },
        resetContainer: {
            alignItems: "flex-end",
            marginBottom: t.spacing.xs,
            marginRight: t.spacing.md,
        },
        resetButton: {
            paddingHorizontal: t.spacing.sm,
            paddingVertical: t.spacing.xs,
            backgroundColor: c("card.background"),
            borderRadius: t.borderRadius.sm,
        },
        resetButtonText: {
            fontSize: 12,
        },
        slotsWrapper: {
            alignItems: "flex-start",
        },
        levelRow: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: t.spacing.md,
            gap: t.spacing.sm,
        },
        levelLabel: {
            fontSize: 13,
            fontWeight: "500",
            minWidth: 50,
        },
        slotsContainer: {
            flexDirection: "row",
            flexWrap: "wrap",
            gap: t.spacing.sm,
            flex: 1,
        },
    }));

    const {
        data: slots,
        error,
        isLoading,
    } = useCharacterSpellSlots(characterId);
    const { data: character } = useCharacter(characterId);
    if (isLoading) {
    }
    const spendSlots = useSpendSpellSlots(characterId);
    const resetSlots = useResetSpellSlots(characterId);

    const availableByLevel = Object.fromEntries(
        (slots ?? []).map((s) => [s.level, s.current]),
    );
    const maxByLevel = Object.fromEntries(
        (slots ?? []).map((s) => [s.level, s.max]),
    );

    const handleToggleSlot = (level: number, index: number) => {
        const current = availableByLevel[level] ?? 0;
        const max = maxByLevel[level] ?? 0;

        const used = max - current;

        const isUsed = index < used;
        // change -1 to index - used so that  you can untoggle multiple slots at once but toggle only one at a time
        const amount = isUsed ? -1 : 1;

        spendSlots.mutate({
            level,
            amount,
        });
    };

    const handleResetAll = () => {
        resetSlots.mutate();
    };
    const levelsToRender = Array.from({ length: 9 }, (_, i) => i + 1).filter(
        (level) => (maxByLevel[level] ?? 0) > 0,
    );
    return (
        <>
            <ThemedView style={styles.header}>
                <ThemedHeadline color="text.heading">
                    Spell Slots
                </ThemedHeadline>
            </ThemedView>

            <BoxWithGlow
                style={{
                    marginBottom: 16,
                    padding: 16,
                    borderRadius: 16,
                    width: "95%",
                    alignSelf: "center",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    height: "auto",
                }}
            >
                <ThemedView style={styles.slotsWrapper}>
                    {levelsToRender.map((level) => {
                        const max = maxByLevel[level];
                        if (max === 0) return null;

                        const available = availableByLevel[level] ?? 0;

                        return (
                            <ThemedView key={level} style={styles.levelRow}>
                                <ThemedText
                                    color="text.muted"
                                    style={styles.levelLabel}
                                    variant="body"
                                >
                                    Level {level}:
                                </ThemedText>

                                <ButtonRow
                                    count={max}
                                    selectedCount={max - available}
                                    onPress={(index) =>
                                        handleToggleSlot(level, index)
                                    }
                                    style={styles.slotsContainer}
                                    renderButton={(filled) => (
                                        <SpellSlotButton isUsed={filled} />
                                    )}
                                />
                            </ThemedView>
                        );
                    })}
                </ThemedView>
            </BoxWithGlow>

            <ThemedView style={styles.resetContainer}>
                <Pressable style={styles.resetButton} onPress={handleResetAll}>
                    <ThemedText
                        color="text.muted"
                        style={styles.resetButtonText}
                        variant="body"
                    >
                        Reset All
                    </ThemedText>
                </Pressable>
            </ThemedView>
        </>
    );
}
