import { useStyles } from "@/hooks/useStyles";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { CollapsibleCard } from "../CollapsibleCard";
import { FeatureRow, OriginType } from "@/hooks/data/useCharacterFeatures";
//TODO: Move This to utils/ idk
//TODO: Allow origin type in DB to be null or add "other" category
function originTypeToDisplayName(origin_type: OriginType): string {
    switch (origin_type) {
        case "class":
            return "Class Feature";
        case "subclass":
            return "Subclass Feature";
        case "race":
            return "Racial Trait";
        case "background":
            return "Background Feature";
        default:
            return "Other";
    }
}
//TODO: change feature colors based on origin
export interface ThemedFeatureContainerProps {
    feature: FeatureRow;
}

export function ThemedFeatureContainer({
    feature,
}: ThemedFeatureContainerProps) {
    const { styles } = useStyles((t, c) => ({
        titleRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: t.spacing.sm,
            marginBottom: t.spacing.sm,
        },
        name: {
            marginBottom: 0,
            flex: 1,
            fontSize: 16,
            flexWrap: "wrap",
        },
        origin_type: {
            marginBottom: 0,
            fontSize: 8,
            textAlign: "right",
            flexShrink: 0,
        },
        shortDescription: {
            marginBottom: t.spacing.md,
            lineHeight: 22,
        },
        description: {
            marginBottom: t.spacing.md,
            lineHeight: 24,
        },
    }));

    const header = (
        <ThemedView style={styles.titleRow}>
            <ThemedText
                color="text.heading"
                style={styles.name}
                variant="label"
            >
                {feature.feature_name}
            </ThemedText>
            <ThemedText
                color="text.muted"
                style={styles.origin_type}
                variant="body"
            >
                {originTypeToDisplayName(feature.origin_type ?? "class")}
            </ThemedText>
        </ThemedView>
    );
    if (!feature.feature_description) {
        feature.feature_description = "";
    }
    const shortContent = (
        <ThemedText color="text.body" style={styles.shortDescription}>
            {feature.feature_description.length > 150
                ? feature.feature_description.slice(0, 150) + "..."
                : feature.feature_description}
        </ThemedText>
    );

    const fullContent = (
        <ThemedText color="text.body" style={styles.description}>
            {feature.feature_description}
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
