import { useState } from "react";
import { Pressable } from "react-native";
import { useStyles } from "@/hooks/useStyles";
import { ThemedText } from "@/components/themed/ThemedText";
import { ThemedView } from "@/components/themed/ThemedView";
import { SpellSlotButton } from "./SpellSlotButton";
import { ThemedHeadline } from "../themed";
import { ButtonRow } from "../ButtonRow";
import { BoxWithGlow } from "../BoxWithGlow";

interface SpellSlotState {
    [level: number]: number;
}

const SPELL_SLOT_MAXIMUMS: Record<number, number> = {
    1: 4,
    2: 3,
    3: 3,
    4: 3,
    5: 1,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
};

export function SpellSlots() {
    const [usedSlots, setUsedSlots] = useState<SpellSlotState>(() => {
        const initial: SpellSlotState = {};
        for (let i = 1; i <= 9; i++) initial[i] = 0;
        return initial;
    });

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

    const handleToggleSlot = (level: number, index: number) => {
        setUsedSlots((prev) => {
            const current = prev[level] || 0;
            return {
                ...prev,
                [level]: index < current ? index : index + 1,
            };
        });
    };

    const handleResetAll = () => {
        const reset: SpellSlotState = {};
        for (let i = 1; i <= 9; i++) reset[i] = 0;
        setUsedSlots(reset);
    };

    return (
        <>
            <ThemedView style={styles.header}>
                <ThemedHeadline color="text.heading">
                    Spell Slots
                </ThemedHeadline>
            </ThemedView>

            {/* ZAMIENNIK container -> BoxWithGlow */}
            <BoxWithGlow
                style={{
                    marginBottom: 16,
                    padding: 16,
                    borderRadius: 16,
                    width: "95%",
                    alignSelf: "center",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    height: "auto", // ważne: override z BoxWithGlow
                }}
            >
                <ThemedView style={styles.slotsWrapper}>
                    {Array.from({ length: 9 }, (_, i) => i + 1).map((level) => {
                        const max = SPELL_SLOT_MAXIMUMS[level];
                        if (max === 0) return null;

                        const used = usedSlots[level] || 0;

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
                                    selectedCount={used}
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
