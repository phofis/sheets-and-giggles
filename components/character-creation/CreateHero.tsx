import React, { useState, useMemo } from "react";
import { ScrollView, View, TouchableOpacity, ActivityIndicator } from "react-native";

import { ThemedView, ThemedText } from "@/components/themed";
import { useStyles } from "@/hooks/useStyles";
import { useCustomRaces, useOfficialRaces } from "@/hooks/data/useCustomRaces";
import { useCustomClasses, useOfficialClasses } from "@/hooks/data/useCustomClasses";

import { Header } from "./Header";
import { SingleAnswerInput } from "./SingleAnswerInput";
import { SelectionGrid, SelectionOption } from "./SelectionGrid";
import { getRaceOptions, getClassOptions, getCustomOption } from "@/constants/character-creation-setup";
import { Checkbox } from "../Checkbox";
import { PathDetails } from "./PathDetails";
import { NextStepButton } from "./NextStep";

// Import the type from your main controller
import { CharacterDraftState } from "@/app/character-creation"; // Adjust import path to where your main controller lives

interface CreateHeroProps {
    initialData: CharacterDraftState;
    onNext: (data: Partial<CharacterDraftState>) => void;
}

export default function CreateHero({ initialData, onNext }: CreateHeroProps) {
    const { styles } = useStyles((t, c) => ({
        screen: { flex: 1, marginBottom: 20, marginTop: 35 },
        scrollView: { flex: 1, alignSelf: "stretch" },
        scrollContentContainer: { flexGrow: 1 },
        content: { alignSelf: "stretch", paddingHorizontal: t.spacing.lg, paddingTop: t.spacing.xl },
        headerRow: { flexDirection: "row", alignItems: "center", gap: t.spacing.sm, marginBottom: t.spacing.lg },
        checkboxContainer: { flexDirection: "row", alignItems: "center", gap: t.spacing.md, paddingVertical: t.spacing.sm },
        loadingContainer: { paddingVertical: t.spacing.sm, alignItems: "center", justifyContent: "center" },
    }));

    const { data: officialRacesData, isLoading: isLoadingOfficialRaces } = useOfficialRaces();
    const { data: officialClassesData, isLoading: isLoadingOfficialClasses } = useOfficialClasses();

    const baseRaceOptions = useMemo<SelectionOption[]>(() => {
        if (!officialRacesData) return [];
        const localIcons = getRaceOptions();
        return officialRacesData.map(race => {
            const match = localIcons.find(ui => ui.label.toLowerCase() === race.name.toLowerCase());
            return {
                id: race.id, label: race.name, description: race.shortDescription,
                icon: match ? match.icon : getCustomOption(race.id, "", "").icon
            };
        });
    }, [officialRacesData]);

    const baseClassOptions = useMemo<SelectionOption[]>(() => {
        if (!officialClassesData) return [];
        const localIcons = getClassOptions();
        return officialClassesData.map(cls => {
            const match = localIcons.find(ui => ui.label.toLowerCase() === cls.name.toLowerCase());
            return {
                id: cls.id, label: cls.name, description: cls.shortDescription,
                icon: match ? match.icon : getCustomOption(cls.id, "", "").icon
            };
        });
    }, [officialClassesData]);

    // ─── Local State (Initialized with Props) ────────────────────────────────
    const [charName, setCharName] = useState<string>(initialData.name);
    const [selectedRace, setSelectedRace] = useState<string | null>(initialData.raceId);
    const [selectedClass, setSelectedClass] = useState<string | null>(initialData.classId);

    const [isCustomRaceChecked, setIsCustomRaceChecked] = useState<boolean>(false);
    const [isCustomClassChecked, setIsCustomClassChecked] = useState<boolean>(false);

    const { data: customRacesData, isLoading: isLoadingCustomRaces } = useCustomRaces();
    const finalRaceOptions = useMemo<SelectionOption[]>(() => {
        if (isCustomRaceChecked && customRacesData) {
            const mappedCustomRaces: SelectionOption[] = customRacesData.map(race => getCustomOption(race.id, race.name, race.shortDescription));
            return [...baseRaceOptions, ...mappedCustomRaces];
        }
        return baseRaceOptions;
    }, [isCustomRaceChecked, customRacesData, baseRaceOptions]);

    const { data: customClassesData, isLoading: isLoadingCustomClasses } = useCustomClasses();
    const finalClassOptions = useMemo<SelectionOption[]>(() => {
        if (isCustomClassChecked && customClassesData) {
            const mappedCustomClasses: SelectionOption[] = customClassesData.map(cls => getCustomOption(cls.id, cls.name, cls.shortDescription));
            return [...baseClassOptions, ...mappedCustomClasses];
        }
        return baseClassOptions;
    }, [isCustomClassChecked, customClassesData, baseClassOptions]);

    const activeRaceObject = finalRaceOptions.find(r => r.id === selectedRace);
    const activeClassObject = finalClassOptions.find(c => c.id === selectedClass);

    return (
        <ThemedView backgroundColor="surface.background" style={styles.screen}>
            <ScrollView contentContainerStyle={styles.scrollContentContainer} style={styles.scrollView}>
                <ThemedView style={styles.content}>
                    <Header title={"Create Hero"} subtitle={"Define your origin and calling in the realms."} currentStep={1} totalSteps={5} />
                    <View style={{ gap: 24 }}>
                        <SingleAnswerInput
                        value={charName}
                        onChangeText={setCharName}
                        title={"Character Name"}
                        placeholder={"Enter a legendary name..."}
                        />

                        <View style={styles.headerRow}><ThemedText color="text.heading" variant="headline">Select Race</ThemedText></View>
                        <TouchableOpacity style={styles.checkboxContainer} onPress={() => setIsCustomRaceChecked(!isCustomRaceChecked)} activeOpacity={0.7}>
                            <Checkbox value={isCustomRaceChecked} onValueChange={setIsCustomRaceChecked} />
                            <ThemedText color="text.muted" variant="label">Allow custom races</ThemedText>
                        </TouchableOpacity>
                        {isCustomRaceChecked && isLoadingCustomRaces && <View style={styles.loadingContainer}><ActivityIndicator size="small" color="#9b59b6" /></View>}
                        <SelectionGrid options={finalRaceOptions} selectedValue={selectedRace} onSelect={setSelectedRace} accentColor="purple" />

                        <View style={styles.headerRow}><ThemedText color="text.heading" variant="headline">Select Class</ThemedText></View>
                        <TouchableOpacity style={styles.checkboxContainer} onPress={() => setIsCustomClassChecked(!isCustomClassChecked)} activeOpacity={0.7}>
                            <Checkbox value={isCustomClassChecked} onValueChange={setIsCustomClassChecked} />
                            <ThemedText color="text.muted" variant="label">Allow custom classes</ThemedText>
                        </TouchableOpacity>
                        {isCustomClassChecked && isLoadingCustomClasses && <View style={styles.loadingContainer}><ActivityIndicator size="small" color="#9b59b6" /></View>}
                        <SelectionGrid options={finalClassOptions} selectedValue={selectedClass} onSelect={setSelectedClass} accentColor="purple" />

                        <PathDetails selectedRaceOption={activeRaceObject} selectedClassOption={activeClassObject} />

                        <NextStepButton
                            onPress={() => {
                                if (!charName.trim() || !selectedRace || !selectedClass) return;
                                onNext({
                                    name: charName.trim(),
                                    raceId: selectedRace,
                                    classId: selectedClass
                                });
                            }}
                            disabled={charName.trim().length === 0 || !selectedRace || !selectedClass}
                        />
                    </View>
                </ThemedView>
            </ScrollView >
        </ThemedView >
    );
}