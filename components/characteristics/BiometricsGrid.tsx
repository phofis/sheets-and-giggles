import React from "react";
import { View } from "react-native";
import { ThemedGrid, ThemedText } from "@/components/themed";
import { BoxWithGlow } from ".././BoxWithGlow";
import { useStyles } from "@/hooks/useStyles";
import { BiometricEntry } from "@/types/character";

export const BiometricsGrid = ({ biometricEntries }: { biometricEntries: BiometricEntry[] }) => {
    const { styles, color } = useStyles((theme, c) => ({
        loadingContainer: { height: 120, justifyContent: "center", alignItems: "center" },
        textContainer: { flex: 1, justifyContent: "center" },
        label: { fontSize: 10, fontWeight: "700", letterSpacing: 0.5, marginBottom: 2 },
        value: {
            fontSize: 18,
            lineHeight: 24,
            fontFamily: theme.typography.headlineFont,
        },
        decorationSpacer: { width: 10 },
    }));

    return (
        <ThemedGrid
            columnGap={12}
            columns={2}
            data={biometricEntries}
            renderItem={(item) => (
                <BoxWithGlow glow={false}>
                    <View style={styles.textContainer}>
                        <ThemedText color="card.header" style={styles.label} variant="body">
                            {item.label.toUpperCase()}
                        </ThemedText>
                        <ThemedText color="card.label" style={styles.value} variant="headline">
                            {item.value}
                        </ThemedText>
                    </View>

                    {/* The secondary slot (used for Mods in abilities) is kept as a 
                        decorative spacer or could be mapped to an icon for the trait */}
                    <View style={styles.decorationSpacer} />
                </BoxWithGlow>
            )}
            rowGap={12}
        />
    );
};
