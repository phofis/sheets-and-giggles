import { ThemedHeadline, ThemedView } from "@/components/themed";
import { ThemedFeatureContainer} from "@/components/themed/ThemedFeatureContainer";
import { ScrollView, View } from "react-native";
import { useStyles } from "@/hooks/useStyles";
import { useCharacterFeatures, FeatureRow, OriginType} from "@/hooks/data/useCharacterFeatures";

const characterId = "a1b2c3d4-e5f6-4789-a012-3456789abcde"; //TODO: get from context instead

export default function FeaturesAndTraitsScreen() {
    const { styles } = useStyles((theme) => ({
        container: { flex: 1, padding: theme.spacing.lg },
        scrollContent: { paddingBottom: theme.spacing.xxl },
        headline: {
            marginBottom: theme.spacing.lg,
            marginTop: theme.spacing.xxl,
            textAlign: "center",
        },
        list: { width: "95%" },
    }));

    const { data: features, isLoading } = useCharacterFeatures(characterId);
    if (isLoading) {
        //TODO: add spinner here
    }

    return (
        <ThemedView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <ThemedHeadline color="text.heading" style={styles.headline}>
                    Your Features
                </ThemedHeadline>
                <View style={styles.list}>
                    {(features ?? []).map((feature) => (
                        <ThemedFeatureContainer key={feature.feature_name} feature={feature} />
                    ))}
                </View>
            </ScrollView>
        </ThemedView>
    );
}
