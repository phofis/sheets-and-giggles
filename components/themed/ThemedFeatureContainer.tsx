import { useStyles } from "@/hooks/useStyles";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { CollapsibleCard } from "../CollapsibleCard";
import { Feature, originTypeToDisplayName } from "@/types/feature";

//TODO: change feature colors based on origin
export interface ThemedFeatureContainerProps {
    feature: Feature;
}

export function ThemedFeatureContainer({ feature }: ThemedFeatureContainerProps) {
    const { styles } = useStyles((t, c) => ({
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

    const header = (
        <ThemedView style={styles.titleRow}>
            <ThemedText color="text.heading" style={styles.name} variant="label">
                {feature.name}
            </ThemedText>
            <ThemedText color="text.muted" style={styles.origin_type} variant="body">
                {originTypeToDisplayName(feature.origin_type)}
            </ThemedText>
        </ThemedView>
    );

    const shortContent = (
        <ThemedText color="text.body" style={styles.shortDescription}>
            {feature.shortDescription}
        </ThemedText>
    );

    const fullContent = (
        <ThemedText color="text.body" style={styles.description}>
            {feature.description}
        </ThemedText>
    );

    return (
        <CollapsibleCard
            header={header}
            shortContent={shortContent}
            fullContent={fullContent}
            glowColor="card.softGlow"
        />
    );
}
