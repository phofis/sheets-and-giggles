import React from "react";
import { View } from "react-native";
import { ThemedHeadline, ThemedText } from "@/components/themed";
import { useStyles } from "@/hooks/useStyles";

interface ProgressHeaderProps {
    title: string;
    subtitle: string;
    currentStep: number;
    totalSteps: number;
}

export const Header: React.FC<ProgressHeaderProps> = ({
    title,
    subtitle,
    currentStep,
    totalSteps,
}) => {
    const { styles } = useStyles((theme, c) => ({
        container: {
            marginBottom: theme.spacing.xl,
            gap: theme.spacing.sm,
        },
        progressRow: {
            flexDirection: "row",
            alignItems: "center",
            gap: theme.spacing.md,
            marginTop: theme.spacing.sm,
            marginBottom: theme.spacing.xs,
        },
        stepText: {
            fontSize: 12,
            fontWeight: "700",
            letterSpacing: 1.2,
            textTransform: "uppercase",
        },
        progressBarContainer: {
            flex: 1,
            height: 4,
            backgroundColor: c("card.background"),
            borderRadius: theme.borderRadius.sm,
            overflow: "hidden",
        },
        progressBarFill: {
            height: "100%",
            backgroundColor: c("buttonPrimary.background"),
            width: `${(currentStep / totalSteps) * 100}%`,
        },
    }));

    return (
        <View style={styles.container}>
            <ThemedHeadline color="palette.tertiary">
                {title}
            </ThemedHeadline>
            <View style={styles.progressRow}>
                <ThemedText color="palette.secondary" style={styles.stepText}>
                    STEP {currentStep} OF {totalSteps}
                </ThemedText>
                <View style={styles.progressBarContainer}>
                    <View style={styles.progressBarFill} />
                </View>
            </View>
            <ThemedText color="text.muted" variant="body">
                {subtitle}
            </ThemedText>
        </View>
    );
};