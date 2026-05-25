import { ThemedView, ThemedBoxList } from "@/components/themed";
import { ScrollView, ActivityIndicator } from "react-native";
import { Header } from "@/components/Header";
import { BiometricsGrid } from "@/components/characteristics/BiometricsGrid";
import { Note } from "@/components/Note";
import { useStyles } from "@/hooks/useStyles";
import { useCharacteristics,Characteristics } from "@/hooks/useCharacteristics";
import { useCharacterId } from "@/context/CharacterIdContext";

const defaultCharacteristics: Characteristics = {
    characterHeader: {
        name: "",
        level: 1,
        class: "",
        inspiration: 1
    },
    biometrics: [],
    background: "",
    traits: [],
    ideals: [],
    bonds: [],
    flaws: []

}

export default function CharacteristicsScreen() {
    const { styles } = useStyles((theme, c) => ({
        screen: { flex: 1, marginBottom: theme.spacing.xl, marginTop: 35 },
        scrollView: { flex: 1, alignSelf: "stretch" },
        scrollContentContainer: { flexGrow: 1 },
        content: {
            alignSelf: "stretch",
            paddingHorizontal: theme.spacing.lg,
            paddingTop: theme.spacing.xl,
            gap: theme.spacing.lg,
        },
        features: {
            borderRadius: theme.borderRadius.md,
            borderLeftWidth: 2,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.1,
            shadowRadius: 15,
            elevation: 4,
        },
    }));
    const characterId = useCharacterId();
    const {data: characteristics = defaultCharacteristics, isLoading} = useCharacteristics(characterId as string);
    
    return (
        <ThemedView backgroundColor="surface.background" style={styles.screen}>
            <ScrollView
                contentContainerStyle={styles.scrollContentContainer}
                style={styles.scrollView}
            >
                {isLoading ? (
                    <ActivityIndicator />
                ) : (
                <ThemedView style={styles.content}>
                    {/** HEADER  */}
                    <Header  characterHeader={characteristics.characterHeader}/>

                    {/** GRID */}
                    <BiometricsGrid biometricEntries={characteristics.biometrics}/>

                    {/** BACKGROUND */}
                    <Note
                        backgroundColor="surface.note"
                        textColor="text.note"
                        title="Background"
                        titleColor="text.lively"
                    >
                        {characteristics.background}
                    </Note>

                    <ThemedBoxList
                        data={characteristics.traits}
                        glowColor="palette.secondary"
                        itemStyle={styles.features}
                        title="Personality Traits"
                    />

                    <ThemedBoxList
                        data={characteristics.bonds}
                        glowColor="palette.tertiary"
                        itemStyle={styles.features}
                        title="Bonds"
                    />

                    <ThemedBoxList
                        data={characteristics.ideals}
                        glowColor="palette.tertiary"
                        itemStyle={styles.features}
                        title="Ideals"
                    />

                    <ThemedBoxList
                        data={characteristics.flaws}
                        glowColor="semantic.error"
                        itemStyle={styles.features}
                        title="Flaws"
                    />
                </ThemedView>
                )}
            </ScrollView>
        </ThemedView>
    );
}
