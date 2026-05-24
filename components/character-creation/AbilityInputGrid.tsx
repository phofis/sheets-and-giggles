import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { ThemedGrid, ThemedText } from "@/components/themed";
import { BoxWithGlow } from ".././BoxWithGlow"; // Adjust path as necessary
import { useStyles } from "@/hooks/useStyles";
import { AbilityScores } from "@/app/character-creation";

// Assumed structure based on your initial file
const ABILITY_LABELS: { key: keyof AbilityScores; label: string }[] = [
    { key: "str", label: "Strength" },
    { key: "dex", label: "Dexterity" },
    { key: "con", label: "Constitution" },
    { key: "int", label: "Intelligence" },
    { key: "wis", label: "Wisdom" },
    { key: "cha", label: "Charisma" },
];

interface AbilityInputGridProps {
    scores: AbilityScores;
    proficiencies: (keyof AbilityScores)[];
    onScoreChange: (key: keyof AbilityScores, value: number) => void;
    onToggleProficiency: (key: keyof AbilityScores) => void;
}

export const AbilityInputGrid: React.FC<AbilityInputGridProps> = ({
    scores,
    proficiencies,
    onScoreChange,
    onToggleProficiency,
}) => {
    const { styles, theme } = useStyles((t, c) => ({
        abilityLabel: {
            fontSize: 10,
            fontWeight: "700",
            letterSpacing: 1,
        },
        inputContainer: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
        },
        abilityInput: {
            fontSize: 30,
            // Applies the serif font from your TODO
            fontFamily: "Noto Serif",
            color: c("text.onPrimary"),
            borderBottomWidth: 1,
            borderBottomColor: "rgba(255, 255, 255, 0.2)",
            minWidth: 50,
            textAlign: "center",
            paddingVertical: 0,
        },
        abilityMod: {
            fontSize: 24,
            fontWeight: "600",
            fontFamily: t.typography.headlineFont,
        },
    }));

    // Standard d20 Modifier calculation: Floor((Score - 10) / 2)
    const calculateModifier = (score: number) => {
        if (!score || isNaN(score)) return "+0";
        const mod = Math.floor((score - 10) / 2);
        return mod >= 0 ? `+${mod}` : `${mod}`;
    };

    return (
        <ThemedGrid
            columnGap={12}
            columns={2}
            data={ABILITY_LABELS}
            renderItem={({ key, label }) => {
                const isProficient = proficiencies.includes(key);
                const currentScore = scores[key];
                const modifier = calculateModifier(currentScore);

                return (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => onToggleProficiency(key)}
                    >
                        <BoxWithGlow
                            glow={true}
                            // Change glow color based on proficiency state
                            glowColor={isProficient ? "palette.primary" : "card.glow"}
                        >
                            <View style={styles.inputContainer}>
                                <View>
                                    <ThemedText
                                        // Change label color when proficient
                                        color={isProficient ? "palette.primary" : "card.header"}
                                        style={[
                                            styles.abilityLabel,
                                            isProficient && { textDecorationLine: "underline" }
                                        ]}
                                        variant="body"
                                    >
                                        {label.toUpperCase()}
                                    </ThemedText>

                                    <TextInput
                                        keyboardType="number-pad"
                                        maxLength={2}
                                        style={styles.abilityInput}
                                        value={currentScore ? currentScore.toString() : ""}
                                        onChangeText={(text) => {
                                            // Strip non-numeric characters and parse
                                            const cleanText = text.replace(/[^0-9]/g, '');
                                            const numericValue = parseInt(cleanText, 10);
                                            onScoreChange(key, isNaN(numericValue) ? 0 : numericValue);
                                        }}
                                        // Prevent touch events on the input from triggering the parent proficiency toggle
                                        onStartShouldSetResponder={() => true}
                                    />
                                </View>

                                <ThemedText
                                    color={isProficient ? "palette.primary" : "palette.tertiary"}
                                    style={styles.abilityMod}
                                    variant="headline"
                                >
                                    {modifier}
                                </ThemedText>
                            </View>
                        </BoxWithGlow>
                    </TouchableOpacity>
                );
            }}
            rowGap={12}
        />
    );
};