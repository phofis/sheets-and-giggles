import { ActivityIndicator, ScrollView, View } from "react-native";
import { useState } from "react";

import { ThemedView, ThemedList, ThemedHeadline } from "@/components/themed";
import { ThemedFeatureContainer} from "@/components/themed/ThemedFeatureContainer";
import { ThemedTwoColumnList } from "@/components/themed/ThemedTwoColumnList";
import { AbilityGrid } from "@/components/characterSheet/AbilityGrid";
import { Header } from "@/components/Header";
import { SavingThrowsIcon } from "@/components/icons";

import { useStyles } from "@/hooks/useStyles";
import { useCharacterSheet, CharacterSheet } from "@/hooks/useCharacterSheet";
import { useCharacterId } from "@/context/CharacterIdContext";
import { useCharacterFeatures } from "@/hooks/data/useCharacterFeatures";

const defaultCharacterSheet: CharacterSheet = {
    characterHeader: {
        name: "",
        level: 1,
        class: "",
        inspiration: 1,
    },
    abilities: {
        STR: { score: 0, mod: "+0" },
        DEX: { score: 0, mod: "+0" },
        CON: { score: 0, mod: "+0" },
        INT: { score: 0, mod: "+0" },
        WIS: { score: 0, mod: "+0" },
        CHA: { score: 0, mod: "+0" },
    },
    savingThrows: [],
    allSkills: [],
    proficientSkills: [],
};

export default function MainSheetScreen() {
    const { styles } = useStyles((theme, c) => ({
        screen: { flex: 1, marginBottom: 20, marginTop: 35 },
        scrollView: { flex: 1 },
        scrollContentContainer: { padding: theme.spacing.lg, gap: theme.spacing.xl },
        content: {
            alignSelf: "stretch",
            paddingHorizontal: theme.spacing.lg,
            paddingTop: theme.spacing.xl,
            gap: theme.spacing.lg,
        },
        features: {
            backgroundColor: c("card.background"),
            borderRadius: theme.borderRadius.md,
            borderLeftWidth: 2,
            borderLeftColor: c("card.glow"),
            shadowColor: c("card.glow"),
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.1,
            shadowRadius: 15,
            elevation: 4,
        },
        headline: {
            marginBottom: theme.spacing.lg,
            marginTop: theme.spacing.xxl,
            textAlign: "center",
        },
        list: { width: "95%" },
    }));

    const characterId = useCharacterId();

    const [isExpanded, setIsExpanded] = useState(false);

    const { data: characterSheet = defaultCharacterSheet, isLoading: isLoadingCharacterSheet } = useCharacterSheet(characterId);
    const { data: features, isLoading } = useCharacterFeatures(characterId);
    const displayedSkills = isExpanded
        ? characterSheet.allSkills
        : characterSheet.proficientSkills;

    return (
        <ThemedView style={styles.screen}>
            <ScrollView
                contentContainerStyle={styles.scrollContentContainer}
                style={styles.scrollView}
            >
                {isLoading ? (
                    <ActivityIndicator />
                ) : (
                <ThemedView style={styles.content}>
                    <Header characterHeader={characterSheet.characterHeader} />

                    <AbilityGrid abilities={characterSheet.abilities} />

                    <ThemedTwoColumnList
                        data={characterSheet.savingThrows}
                        icon={SavingThrowsIcon}
                        title="Saving Throws"
                    />

                    <ThemedList
                        data={displayedSkills}
                        footerLabel={isExpanded ? "Show Less" : "View All Skills"}
                        icon="list"
                        title="Skills"
                        onFooterPress={() => setIsExpanded(!isExpanded)}
                    />
                    {/** //TODO: we probably want to animate the expansion movement */}

                    {/** //TODO: Add combat section here. Consider if it should not belong to another page*/}
                    <ThemedHeadline color="text.heading" style={styles.headline}>
                        Your Features
                    </ThemedHeadline>
                    <View style={styles.list}>
                        {(features ?? []).map((feature) => (
                            <ThemedFeatureContainer key={feature.feature_name} feature={feature} />
                        ))}
                    </View>
                    </ThemedView>
                )}
            </ScrollView>
        </ThemedView>
    );
}
