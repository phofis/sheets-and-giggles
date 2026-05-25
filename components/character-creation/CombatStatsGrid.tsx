import React from "react";
import { View, TextInput } from "react-native";
import { ThemedText } from "@/components/themed";
import { BoxWithGlow } from "@/components/BoxWithGlow";
import { useStyles } from "@/hooks/useStyles";
import { CombatStats } from "@/app/character-creation";
import { ThemeColorKey } from "@/constants/themes";

interface CombatStatConfig {
    key: keyof CombatStats;
    label: string;
    suffix?: string;
    glowColor: ThemeColorKey; // Maps to your specific theme tokens
    textColor: ThemeColorKey;
}

// Configuration array to map out the 2x2 grid with unique colors
const STAT_CONFIGS: CombatStatConfig[] = [
    { key: "hp", label: "MAX HP", glowColor: "semantic.error", textColor: "semantic.error" }, // Red/Pink
    { key: "ac", label: "AC", glowColor: "semantic.warning", textColor: "semantic.warning" }, // Yellow/Gold
    { key: "initiative", label: "INITIATIVE", glowColor: "palette.primary", textColor: "palette.primary" }, // Purple/White
    { key: "speed", label: "SPEED", suffix: "ft", glowColor: "palette.secondary", textColor: "palette.primary" },
];

interface CombatStatsGridProps {
    stats: CombatStats;
    onChange: (key: keyof CombatStats, value: number) => void;
}

export const CombatStatsGrid: React.FC<CombatStatsGridProps> = ({ stats, onChange }) => {
    const { styles, theme } = useStyles((t, c) => ({
        gridContainer: {
            flexDirection: "row",
            flexWrap: "wrap",
            gap: t.spacing.md,
            justifyContent: "space-between",
        },
        cardWrapper: {
            width: "47%", // Allows 2 items per row with gap
            marginBottom: t.spacing.sm,
        },
        contentContainer: {
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: t.spacing.md,
        },
        label: {
            fontSize: 10,
            fontWeight: "700",
            letterSpacing: 1,
            color: c("text.muted"),
            marginBottom: t.spacing.sm,
        },
        inputRow: {
            flexDirection: "row",
            alignItems: "baseline",
            justifyContent: "center",
            gap: 4,
        },
        input: {
            fontSize: 32,
            fontFamily: "Noto Serif",
            textAlign: "center",
            minWidth: 50,
            color: c("text.muted"),
            padding: 0,
        },
        suffix: {
            fontSize: 16,
            color: c("text.muted"),
            fontFamily: t.typography.bodyFont,
        },
        text: {color: c("text.muted")},
    }));

    return (
        <View style={styles.gridContainer}>
            {STAT_CONFIGS.map((config) => {
                const currentValue = stats[config.key];

                return (
                    <View key={config.key} style={styles.cardWrapper}>
                        <BoxWithGlow glow={true} glowColor={config.glowColor}>
                            <View style={styles.contentContainer}>
                                <ThemedText style={styles.label}>
                                    {config.label}
                                </ThemedText>

                                <View style={styles.inputRow}>
                                    <TextInput
                                        keyboardType="number-pad"
                                        maxLength={3}
                                        placeholder="0"
                                        placeholderTextColor="rgba(255,255,255,0.2)"
                                        style={[
                                            styles.input,
                                            // { color: theme.colors.semantic.info }
                                        ]}
                                        value={currentValue !== 0 ? currentValue.toString() : ""}
                                        onChangeText={(text) => {
                                            // Ensure we only pass valid numbers or 0 back to state
                                            const cleanText = text.replace(/[^0-9-]/g, ''); // allow negative for initiative
                                            const numericValue = parseInt(cleanText, 10);
                                            onChange(config.key, isNaN(numericValue) ? 0 : numericValue);
                                        }}
                                    />

                                    {config.suffix && (
                                        <ThemedText style={styles.suffix}>
                                            {config.suffix}
                                        </ThemedText>
                                    )}
                                </View>
                            </View>
                        </BoxWithGlow>
                    </View>
                );
            })}
        </View>
    );
};