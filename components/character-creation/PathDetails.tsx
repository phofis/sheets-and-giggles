import React from "react";
import { View } from "react-native";
import { ThemedView, ThemedText } from "@/components/themed";
import { useStyles } from "@/hooks/useStyles";
import { PathSection } from "./PathSection";
import { SelectionOption } from "./SelectionGrid";

interface PathDetailsProps {
    selectedRaceOption?: SelectionOption;
    selectedClassOption?: SelectionOption;
}

export const PathDetails: React.FC<PathDetailsProps> = ({
    selectedRaceOption,
    selectedClassOption
}) => {
    const { styles } = useStyles((t, c) => ({
        card: {
            backgroundColor: c("card.background"),
            padding: t.spacing.lg,
            borderWidth: 1,
            borderColor: "rgba(255, 255, 255, 0.05)",
            marginVertical: t.spacing.md,
        },
        mainTitle: {
            color: c("palette.tertiary"),
            fontSize: 20,
            marginBottom: t.spacing.lg,
        },

        raceAccent: {
            color: c("palette.secondary")
        },
        classAccent: {
            color: c("palette.tertiary")
        }
    }));

    if (!selectedRaceOption && !selectedClassOption) {
        return null;
    }

    return (
        <View style={styles.card}>
            <ThemedText style={styles.mainTitle}>
                Path Details
            </ThemedText>

            {selectedRaceOption && (
                <PathSection
                    title={`${selectedRaceOption.label} Heritage`}
                    description={selectedRaceOption.description ?? "No heritage data available."}
                    iconRenderer={(color) => selectedRaceOption.icon(color ?? "")}
                    accentColor={styles.raceAccent.color}
                />
            )}

            {selectedClassOption && (
                <PathSection
                    title={`${selectedClassOption.label} Calling`}
                    description={selectedClassOption.description ?? "No calling data available."}
                    iconRenderer={(color) => selectedClassOption.icon(color ?? "")}
                    accentColor={styles.classAccent.color}
                />
            )}
        </View>
    );
};