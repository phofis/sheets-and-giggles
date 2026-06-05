import React from "react";
import { View } from "react-native";
import { ThemedGrid, ThemedText } from "@/components/themed";
import { BoxWithGlow } from ".././BoxWithGlow";
import { EditableField } from "@/components/editing/EditableField";
import { useStyles } from "@/hooks/useStyles";
import { BiometricEntry } from "@/types/character";

type Props = {
    biometricEntries: BiometricEntry[];
    isEditMode?: boolean;
    onEditEntry?: (entry: BiometricEntry) => void;
};

export const BiometricsGrid = ({
    biometricEntries,
    isEditMode = false,
    onEditEntry,
}: Props) => {
    const { styles } = useStyles((theme, c) => ({
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
                    <EditableField
                        isEditMode={isEditMode}
                        onPress={onEditEntry ? () => onEditEntry(item) : undefined}
                    >
                        <View style={styles.textContainer}>
                            <ThemedText color="card.header" style={styles.label} variant="body">
                                {item.label.toUpperCase()}
                            </ThemedText>
                            <ThemedText color="card.label" style={styles.value} variant="headline">
                                {item.value}
                            </ThemedText>
                        </View>
                    </EditableField>
                    <View style={styles.decorationSpacer} />
                </BoxWithGlow>
            )}
            rowGap={12}
        />
    );
};
