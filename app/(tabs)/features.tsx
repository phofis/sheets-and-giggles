import { ThemedHeadline, ThemedView } from "@/components/themed";
import { ThemedFeatureContainer} from "@/components/themed/ThemedFeatureContainer";
import { ScrollView, View } from "react-native";
import { useStyles } from "@/hooks/useStyles";
import { useFeatures,  } from "@/hooks/useFeatures";

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

    const { features, isLoading } = useFeatures();
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
                    {features.map((feature) => (
                        <ThemedFeatureContainer key={feature.name} feature={feature} />
                    ))}
                </View>
            </ScrollView>
        </ThemedView>
    );
}
