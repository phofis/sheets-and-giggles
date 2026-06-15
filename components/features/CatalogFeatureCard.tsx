import { Pressable } from "react-native";
import { Plus } from "lucide-react-native";
import { CollapsibleCard } from "@/components/CollapsibleCard";
import { ThemedText } from "@/components/themed/ThemedText";
import { ThemedView } from "@/components/themed/ThemedView";
import { useStyles } from "@/hooks/useStyles";
import type { Database } from "@/types/supabase";

type FeatureRow = Database["public"]["Tables"]["features"]["Row"];
type OriginType = Database["public"]["Enums"]["feature_origin_type"];

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
        case "feat":
            return "Feat";
        case "character":
            return "Character Feature";
        default:
            return "Other";
    }
}

type CatalogFeatureCardProps = {
    feature: FeatureRow;
    isAssigned: boolean;
    onAdd: () => void;
};

export function CatalogFeatureCard({
    feature,
    isAssigned,
    onAdd,
}: CatalogFeatureCardProps) {
    const { styles, color } = useStyles((t, c) => ({
        card: {
            marginBottom: t.spacing.xs,
            width: "95%",
            alignSelf: "center",
        },
        titleRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: t.spacing.sm,
            marginBottom: t.spacing.sm,
        },
        titleBlock: {
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: t.spacing.sm,
        },
        title: {
            flex: 1,
            fontSize: 18,
        },
        meta: {
            fontSize: 12,
        },
        addButton: {
            width: 36,
            height: 36,
            borderRadius: t.borderRadius.xl,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: c("surface.surfaceElevated"),
        },
        addButtonDisabled: {
            opacity: 0.45,
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

    const description = feature.description ?? "";
    const shortDescription =
        description.length > 50
            ? description.slice(0, 50) + "..."
            : description;

    const header = (
        <ThemedView style={styles.titleRow}>
            <ThemedView style={styles.titleBlock}>
                <ThemedText color="text.heading" style={styles.title} variant="label">
                    {feature.name}
                </ThemedText>
                <ThemedText color="text.muted" style={styles.meta} variant="body">
                    {feature.min_character_level != null
                        ? `Lvl ${feature.min_character_level}`
                        : originTypeToDisplayName(feature.origin_type)}
                </ThemedText>
            </ThemedView>
            <Pressable
                disabled={isAssigned}
                style={[styles.addButton, isAssigned && styles.addButtonDisabled]}
                onPress={(event) => {
                    event.stopPropagation();
                    onAdd();
                }}
            >
                <Plus
                    color={color(isAssigned ? "text.muted" : "text.body")}
                    size={18}
                />
            </Pressable>
        </ThemedView>
    );

    const shortContent = (
        <ThemedText color="text.body" style={styles.shortDescription}>
            {shortDescription}
        </ThemedText>
    );

    const fullContent = (
        <ThemedView>
            <ThemedText color="text.muted" style={styles.meta} variant="body">
                {originTypeToDisplayName(feature.origin_type)}
            </ThemedText>
            <ThemedText color="text.body" style={styles.description}>
                {description}
            </ThemedText>
        </ThemedView>
    );

    return (
        <CollapsibleCard
            fullContent={fullContent}
            glowColor="card.softGlow"
            header={header}
            shortContent={shortContent}
            style={styles.card}
        />
    );
}
