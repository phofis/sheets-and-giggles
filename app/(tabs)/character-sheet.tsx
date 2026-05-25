import { ActivityIndicator, ScrollView } from "react-native";
import { useState } from "react";

import { ThemedView, ThemedList, ThemedBoxList } from "@/components/themed";
import { ThemedTwoColumnList } from "@/components/themed/ThemedTwoColumnList";
import { AbilityGrid } from "@/components/characterSheet/AbilityGrid";
import { Header } from "@/components/Header";
import { SavingThrowsIcon } from "@/components/icons";

import { useStyles } from "@/hooks/useStyles";
import { useCharacterSheet, CharacterSheet } from "@/hooks/useCharacterSheet";
import { useCharacterId } from "@/context/CharacterIdContext";


const defaultCharacterSheet: CharacterSheet = {
    characterHeader: {
        name: "",
        level: 1,
        class: "",
        inspiration: 1
    },
}
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
    }));

    const characterId = useCharacterId();

    const [isExpanded, setIsExpanded] = useState(false);

    const { data: characterSheet = defaultCharacterSheet, isLoading: isLoading } = useCharacterSheet(characterId);

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
                    {/* AVATAR & HEADER SECTION */}
                    <Header characterHeader={characterSheet.characterHeader} />

                    {/* ABILITY GRID */}
                    <AbilityGrid characterId={characterId} />

                    {/* SAVING THROWS*/}
                    <ThemedTwoColumnList
                        data={savingThrows}
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

                    {/* <ThemedBoxList data={features} itemStyle={styles.features} title="Key Features" /> */}
                </ThemedView>
                )}
            </ScrollView>
        </ThemedView>
    );
}
