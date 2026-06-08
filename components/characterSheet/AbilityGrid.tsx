import React from "react";
import { View } from "react-native";
import { ThemedGrid, ThemedText } from "@/components/themed";
import { BoxWithGlow } from ".././BoxWithGlow";
import { EditableField } from "@/components/editing/EditableField";
import { ABILITY_LABELS, AbilityKey, AbilityScores } from "@/types/character";
import { useStyles } from "@/hooks/useStyles";

type Props = {
    abilities: AbilityScores;
    isEditMode?: boolean;
    onEditScore?: (key: AbilityKey) => void;
};

export const AbilityGrid = ({ abilities, isEditMode = false, onEditScore }: Props) => {
    const { styles } = useStyles((theme) => ({
        abilityLabel: {
            fontSize: 10,
            fontWeight: "700",
        },
        abilityScore: {
            fontSize: 30,
            fontFamily: theme.typography.headlineFont,
        },
        abilityMod: {
            fontSize: 20,
            fontWeight: "600",
            fontFamily: theme.typography.headlineFont,
        },
        scoreRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
        },
    }));

    return (
        <ThemedGrid
            columnGap={12}
            columns={2}
            data={ABILITY_LABELS}
            renderItem={({ key, label }) => (
                <BoxWithGlow glow={true} glowColor="card.glow">
                    <View>
                        <ThemedText color="card.header" style={styles.abilityLabel} variant="body">
                            {label.toUpperCase()}
                        </ThemedText>
                        <EditableField
                            isEditMode={isEditMode}
                            onPress={onEditScore ? () => onEditScore(key) : undefined}
                        >
                            <View style={styles.scoreRow}>
                                <ThemedText
                                    color="card.label"
                                    style={styles.abilityScore}
                                    variant="headline"
                                >
                                    {abilities[key].score}
                                </ThemedText>
                                <ThemedText
                                    color="card.note"
                                    style={styles.abilityMod}
                                    variant="headline"
                                >
                                    {abilities[key].mod}
                                </ThemedText>
                            </View>
                        </EditableField>
                    </View>
                </BoxWithGlow>
            )}
            rowGap={12}
        />
    );
};
