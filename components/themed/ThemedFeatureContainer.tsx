import { useState } from "react";
import { Pressable } from "react-native";
import { useStyles } from "@/hooks/useStyles";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { HighlightedView } from "../HighlightedView";

export type Feature = {
    name: string;
    origin_type: string;
    shortDescription: string;
    description: string;
};

export interface ThemedFeatureContainerProps {
    feature: Feature;
}

export function ThemedFeatureContainer({ feature }: ThemedFeatureContainerProps) {
    const { styles, color } = useStyles((t, c) => ({
        pressable: { 
            marginVertical: t.spacing.sm,
        },
        pressed: { 
            opacity: 0.96,
        },
        container: {
            padding: t.spacing.md,
            justifyContent: "flex-start",
            alignItems: "stretch",
            backgroundColor: c("card.background"),
            borderRadius: t.borderRadius.lg,
        },
        containerPressed: {
            borderColor: c("palette.primary"),
        },
        containerExpanded: { 
            paddingBottom: t.spacing.lg 
        },
        titleRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: t.spacing.sm,
            marginBottom: t.spacing.sm
        },
        name: { 
            marginBottom: 0, 
            flex: 1, 
            fontSize: 16,
            flexWrap: "wrap"
        },
        origin_type: { 
            marginBottom: 0, 
            fontSize: 8, 
            textAlign: "right",
            flexShrink: 0
        },
        shortDescription: { 
            marginBottom: t.spacing.md, 
            lineHeight: 22
        },
        description: { 
            marginBottom: t.spacing.md,
            lineHeight: 24
        },
    }));

    const [expanded, setExpanded] = useState(false);
    const [pressed, setPressed] = useState(false);

    return (
        <Pressable
            style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
            onPress={() => setExpanded((value) => !value)}
            onPressIn={() => setPressed(true)}
            onPressOut={() => setPressed(false)}
        >
            <HighlightedView
                glow
                glowColor="palette.secondary"
                style={[styles.container, expanded && styles.containerExpanded]}
                
                
            >
                <ThemedView style={styles.titleRow}>
                    <ThemedText color="palette.primary" style={styles.name} variant="label">
                        {feature.name}
                    </ThemedText>
                    <ThemedText color="text.muted" style={styles.origin_type} variant="body">
                        {feature.origin_type}
                    </ThemedText>
                </ThemedView>

                {!expanded ? (
                    <ThemedText color="text.body" style={styles.shortDescription}>
                        {feature.shortDescription}
                    </ThemedText>
                ) : null}

                {expanded ? (
                    <ThemedText color="text.body" style={styles.description}>
                        {feature.description}
                    </ThemedText>
                ) : null}
            </HighlightedView>
        </Pressable>
    );
}
