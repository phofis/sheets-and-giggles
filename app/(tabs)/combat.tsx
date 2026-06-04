import { ScrollView, View } from "react-native";
import { useState } from "react";
import { ThemedView, ThemedText } from "@/components/themed";
import { useStyles } from "@/hooks/useStyles";
import HealthBar from "@/components/combat/HealthBar";
import StatRow from "@/components/combat/StatRow";
import DeathSaves from "@/components/combat/DeathSaves";
import CombatActionCard, {
    CombatAction,
} from "@/components/combat/CombatActionCard";
import { EditScreenShell } from "@/components/editing/EditScreenShell";
import { useCharacterId } from "@/context/CharacterIdContext";
import { useCharacter } from "@/hooks/data/useCharacter";
import { useCharacterItems, useCharacterSpells, useClasses } from "@/hooks/data";
import { useCharacterEditor } from "@/hooks/editing/useCharacterEditor";
import { useFieldEditorModals } from "@/hooks/editing/useFieldEditorModals";

const MOCK_ACTIONS: CombatAction[] = [
    {
        id: "1",
        name: "Divine Smite",
        type: "Action",
        range: "5ft",
        effect: "2d8 Radiant",
    },
    {
        id: "2",
        name: "Lay on Hands",
        type: "Action",
        range: "Touch",
        effect: "Heal up to 60",
    },
    {
        id: "3",
        name: "Shield of Faith",
        type: "Bonus Action",
        range: "V, S, M",
        effect: "+2 AC",
    },
];

export default function CombatScreen() {
    const { styles } = useStyles((t) => ({
        screen: {
            flex: 1,
        },
        scroll: {
            padding: t.spacing.lg,
            gap: t.spacing.xl,
        },
        header: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
        },
        headerLeft: {
            gap: t.spacing.xxs,
        },
        headerRight: {
            alignItems: "flex-end",
        },
        encounterLabel: {
            fontSize: 11,
            letterSpacing: 2,
        },
        characterName: {
            fontSize: 32,
            lineHeight: 38,
        },
        levelText: {
            fontSize: 12,
        },
        classText: {
            fontSize: 16,
        },
        sectionHeader: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        },
        slotsBadge: {
            borderWidth: 1,
            borderRadius: t.borderRadius.sm,
            paddingHorizontal: t.spacing.sm,
            paddingVertical: t.spacing.xxs,
        },
        slotsText: {
            fontSize: 12,
        },
        actionsGroup: {
            gap: t.spacing.md,
        },
    }));

    const characterId = useCharacterId();
    const [isEditMode, setIsEditMode] = useState(false);
    const { data: character } = useCharacter(characterId);
    const { data: availableClasses } = useClasses();
    const characterClass = availableClasses?.find((cls) => character?.class_id === cls.id);
    const { updateCharacter } = useCharacterEditor(characterId);
    const { openNumeric, modals } = useFieldEditorModals();

    useCharacterItems(characterId);
    useCharacterSpells(characterId);

    return (
        <EditScreenShell
            isEditMode={isEditMode}
            style={styles.screen}
            onToggleEditMode={() => setIsEditMode((v) => !v)}
        >
            <ThemedView backgroundColor="surface.background" style={styles.screen}>
                {modals}
                <ScrollView contentContainerStyle={styles.scroll}>
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <ThemedText
                                color="palette.secondary"
                                style={styles.encounterLabel}
                            >
                                CURRENT ENCOUNTER
                            </ThemedText>
                            <ThemedText
                                color="text.heading"
                                style={styles.characterName}
                                variant="headline"
                            >
                                {character?.name}
                            </ThemedText>
                        </View>
                        <View style={styles.headerRight}>
                            <ThemedText color="text.muted" style={styles.levelText}>
                                LEVEL {character?.level}
                            </ThemedText>
                            <ThemedText
                                color="text.heading"
                                style={styles.classText}
                                variant="label"
                            >
                                {characterClass?.name}
                            </ThemedText>
                        </View>
                    </View>

                    <HealthBar
                        currentHp={character?.hp_current ?? 0}
                        isEditMode={isEditMode}
                        maxHp={character?.hp_max ?? 0}
                        tempHp={character?.hp_temp ?? 0}
                        onEditCurrentHp={() =>
                            openNumeric({
                                label: "Current HP",
                                initialValue: character?.hp_current ?? 0,
                                min: 0,
                                onSubmit: (value) =>
                                    updateCharacter.mutate({ hp_current: value }),
                            })
                        }
                        onEditMaxHp={() =>
                            openNumeric({
                                label: "Max HP",
                                initialValue: character?.hp_max ?? 0,
                                min: 1,
                                onSubmit: (value) =>
                                    updateCharacter.mutate({ hp_max: value }),
                            })
                        }
                        onEditTempHp={() =>
                            openNumeric({
                                label: "Temp HP",
                                initialValue: character?.hp_temp ?? 0,
                                min: 0,
                                onSubmit: (value) =>
                                    updateCharacter.mutate({ hp_temp: value }),
                            })
                        }
                    />

                    <StatRow
                        armorClass={character?.armor_class ?? 0}
                        initiative={character?.initiative ?? 0}
                        isEditMode={isEditMode}
                        speed={character?.speed ?? 0}
                        onEditArmorClass={() =>
                            openNumeric({
                                label: "Armor class",
                                initialValue: character?.armor_class ?? 0,
                                min: 0,
                                onSubmit: (value) =>
                                    updateCharacter.mutate({ armor_class: value }),
                            })
                        }
                        onEditInitiative={() =>
                            openNumeric({
                                label: "Initiative",
                                initialValue: character?.initiative ?? 0,
                                onSubmit: (value) =>
                                    updateCharacter.mutate({ initiative: value }),
                            })
                        }
                        onEditSpeed={() =>
                            openNumeric({
                                label: "Speed (ft)",
                                initialValue: character?.speed ?? 0,
                                min: 0,
                                onSubmit: (value) =>
                                    updateCharacter.mutate({ speed: value }),
                            })
                        }
                    />

                    <DeathSaves />

                    <View style={styles.actionsGroup}>
                        <View style={styles.sectionHeader}>
                            <ThemedText color="text.heading" variant="headline">
                                Combat Actions
                            </ThemedText>
                            <View style={styles.slotsBadge}>
                                <ThemedText
                                    color="semantic.success"
                                    style={styles.slotsText}
                                >
                                    2 Slots Left
                                </ThemedText>
                            </View>
                        </View>
                        {MOCK_ACTIONS.map((action) => (
                            <CombatActionCard key={action.id} action={action} />
                        ))}
                    </View>
                </ScrollView>
            </ThemedView>
        </EditScreenShell>
    );
}
