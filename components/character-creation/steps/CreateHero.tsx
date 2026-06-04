import React, { useState, useMemo } from "react";
import { ScrollView, View, TouchableOpacity, ActivityIndicator } from "react-native";

import { ThemedView, ThemedText } from "@/components/themed";
import { useStyles } from "@/hooks/useStyles";
import { useCustomRaces, useOfficialRaces } from "@/hooks/data/useCustomRaces";
import { useCustomClasses, useOfficialClasses } from "@/hooks/data/useCustomClasses";

import { Header } from ".././Header";
import { SingleAnswerInput } from ".././SingleAnswerInput";
import { SelectionGrid, SelectionOption } from ".././SelectionGrid";
import { getRaceOptions, getClassOptions, getCustomOption } from "@/constants/character-creation-setup";
import { Checkbox } from "../../Checkbox";
import { PathDetails } from ".././PathDetails";
import { NextStepButton } from ".././NextStep";
import { CharacterDraftState } from "@/app/character-creation";

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
    const [charName, setCharName] = useState<CharacterDraftState["name"]>(initialData.name);
    const [selectedRace, setSelectedRace] = useState<CharacterDraftState["raceId"] | null>(initialData.raceId);
    const [selectedClass, setSelectedClass] = useState<CharacterDraftState["classId"] | null>(initialData.classId);

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
                    <Header currentStep={1} subtitle={"Define your origin and calling in the realms."} title={"Create Hero"} totalSteps={5} />
                    <View style={{ gap: 24 }}>
                        <SingleAnswerInput
                        placeholder={"Enter a legendary name..."}
                        title={"Character Name"}
                        value={charName}
                        onChangeText={setCharName}
                        />

                        <View style={styles.headerRow}><ThemedText color="text.heading" variant="headline">Select Race</ThemedText></View>
                        <TouchableOpacity activeOpacity={0.7} style={styles.checkboxContainer} onPress={() => setIsCustomRaceChecked(!isCustomRaceChecked)}>
                            <Checkbox value={isCustomRaceChecked} onValueChange={setIsCustomRaceChecked} />
                            <ThemedText color="text.muted" variant="label">Allow custom races</ThemedText>
                        </TouchableOpacity>
                        {isCustomRaceChecked && isLoadingCustomRaces && <View style={styles.loadingContainer}><ActivityIndicator color="#9b59b6" size="small" /></View>}
                        <SelectionGrid accentColor="purple" options={finalRaceOptions} selectedValue={selectedRace} onSelect={setSelectedRace} />

                        <View style={styles.headerRow}><ThemedText color="text.heading" variant="headline">Select Class</ThemedText></View>
                        <TouchableOpacity activeOpacity={0.7} style={styles.checkboxContainer} onPress={() => setIsCustomClassChecked(!isCustomClassChecked)}>
                            <Checkbox value={isCustomClassChecked} onValueChange={setIsCustomClassChecked} />
                            <ThemedText color="text.muted" variant="label">Allow custom classes</ThemedText>
                        </TouchableOpacity>
                        {isCustomClassChecked && isLoadingCustomClasses && <View style={styles.loadingContainer}><ActivityIndicator color="#9b59b6" size="small" /></View>}
                        <SelectionGrid accentColor="purple" options={finalClassOptions} selectedValue={selectedClass} onSelect={setSelectedClass} />

                        <PathDetails selectedClassOption={activeClassObject} selectedRaceOption={activeRaceObject} />

                        <NextStepButton
                            disabled={charName.trim().length === 0 || !selectedRace || !selectedClass}
                            onPress={() => {
                                if (!charName.trim() || !selectedRace || !selectedClass) return;
                                onNext({
                                    name: charName.trim(),
                                    raceId: selectedRace,
                                    classId: selectedClass
                                });
                            }}
                        />
                    </View>
                </ThemedView>
            </ScrollView >
        </ThemedView >
    );
}