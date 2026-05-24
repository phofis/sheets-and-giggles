import React, { useState } from "react";
import { ScrollView, TouchableOpacity, View, TextInput, Text } from "react-native";
import { ThemedView, ThemedText } from "@/components/themed";
import { useStyles } from "@/hooks/useStyles";

import { Header } from "./Header";
import { NextStepButton } from "./NextStep";
import { CharacterDraftState, EquipmentItem } from "@/app/character-creation"; // Adjust path as needed
import { SectionCard } from "./SectionCard";

interface InventorySheetProps {
    initialData: CharacterDraftState;
    onNext: (data: Partial<CharacterDraftState>) => void;
    onBack: () => void;
}

// ─── Localized Sub-Components ────────────────────────────────────────────────

interface CurrencyInputProps {
    label: string;
    symbol: string;
    color: string;
    value: string;
    onChangeText: (val: string) => void;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({ label, symbol, color, value, onChangeText }) => {
    const { styles } = useStyles((t, c) => ({
        container: { marginBottom: t.spacing.md },
        label: { fontSize: 14, color: c("text.muted"), marginBottom: t.spacing.xs, fontWeight: "500" },
        inputWrapper: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.3)",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.1)",
            borderRadius: t.borderRadius.md,
            paddingHorizontal: t.spacing.sm,
            paddingVertical: t.spacing.sm,
        },
        badge: {
            width: 28, height: 28, borderRadius: 14, borderWidth: 1, borderColor: color,
            justifyContent: "center", alignItems: "center", marginRight: t.spacing.md,
            backgroundColor: "rgba(0,0,0,0.4)",
        },
        badgeText: { color: color, fontSize: 11, fontWeight: "bold" },
        input: { flex: 1, color: c("text.onPrimary"), fontSize: 16, fontFamily: t.typography.bodyFont }
    }));

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.inputWrapper}>
                <View style={styles.badge}><Text style={styles.badgeText}>{symbol}</Text></View>
                <TextInput
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor="rgba(255,255,255,0.2)"
                    style={styles.input}
                    value={value}
                    onChangeText={onChangeText}
                />
            </View>
        </View>
    );
};

// ─── Specialized Equipment Manager ───

interface EquipmentManagerCardProps {
    items: EquipmentItem[];
    onAddItem: (item: EquipmentItem) => void;
    onRemoveItem: (index: number) => void;
    accentColor: string;
}

const EquipmentManagerCard: React.FC<EquipmentManagerCardProps> = ({ items, onAddItem, onRemoveItem, accentColor }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const { styles } = useStyles((t, c) => ({
        input: {
            backgroundColor: "rgba(0,0,0,0.3)",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.1)",
            borderRadius: t.borderRadius.md,
            padding: t.spacing.md,
            color: c("text.onPrimary"),
            fontSize: 16,
            marginBottom: t.spacing.md,
            fontFamily: t.typography.bodyFont,
        },
        addButton: {
            backgroundColor: accentColor,
            borderRadius: t.borderRadius.md,
            paddingVertical: t.spacing.md,
            alignItems: "center",
            marginBottom: t.spacing.lg,
        },
        addButtonText: { color: c("text.onSecondary"), fontWeight: "bold", fontSize: 16 },
        listContainer: { gap: t.spacing.sm, marginTop: t.spacing.sm },
        listItem: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.2)",
            padding: t.spacing.md,
            borderRadius: t.borderRadius.md,
            borderLeftWidth: 3,
            borderLeftColor: accentColor,
        },
        itemTextContainer: { flex: 1, marginRight: t.spacing.md },
        itemName: { color: c("text.onPrimary"), fontSize: 16, fontWeight: "bold", marginBottom: 2 },
        itemDesc: { color: c("text.muted"), fontSize: 14 },
        removeIcon: { fontFamily: "Material Icons", fontSize: 20, color: c("text.muted") },
    }));

    const handleAdd = () => {
        if (name.trim()) {
            onAddItem({ name: name.trim(), description: description.trim() });
            setName("");
            setDescription("");
        }
    };

    return (
        <SectionCard iconColor={accentColor} iconLigature="cases" title="Equipment & Items">
            <View style={{ paddingTop: 8 }}>
                <TextInput
                    placeholder="Item Name"
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    placeholder="Description or Quantity"
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    style={styles.input}
                    value={description}
                    onChangeText={setDescription}
                />
                <TouchableOpacity activeOpacity={0.8} style={styles.addButton} onPress={handleAdd}>
                    <Text style={styles.addButtonText}>+ Add Item</Text>
                </TouchableOpacity>

                {items.length > 0 && (
                    <View style={styles.listContainer}>
                        {items.map((item, index) => (
                            <View key={index} style={styles.listItem}>
                                <View style={styles.itemTextContainer}>
                                    <Text style={styles.itemName}>{item.name}</Text>
                                    {item.description ? <Text style={styles.itemDesc}>{item.description}</Text> : null}
                                </View>
                                <TouchableOpacity activeOpacity={0.7} onPress={() => onRemoveItem(index)}>
                                    <Text style={styles.removeIcon}>close</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        </SectionCard>
    );
};

// ─── Main Sheet Component ────────────────────────────────────────────────────

export default function InventorySheet({ initialData, onNext, onBack }: InventorySheetProps) {
    const { styles } = useStyles((t, c) => ({
        screen: { flex: 1, marginBottom: 20, marginTop: 35 },
        scrollView: { flex: 1, alignSelf: "stretch" },
        scrollContentContainer: { flexGrow: 1 },
        content: { alignSelf: "stretch", paddingHorizontal: t.spacing.lg, paddingTop: t.spacing.xl },
        backButton: { marginBottom: t.spacing.md, paddingVertical: t.spacing.sm },
        inventoryIcon: { color: c("semantic.warning") },
        equipmentIcon: { color: c("palette.tertiary") }, // Matches the purple hex in your screenshot
    }));

    const [equipment, setEquipment] = useState<EquipmentItem[]>(initialData.equipment || []);

    const [cp, setCp] = useState<string>(initialData.wealth?.cp?.toString() || "0");
    const [sp, setSp] = useState<string>(initialData.wealth?.sp?.toString() || "0");
    const [gp, setGp] = useState<string>(initialData.wealth?.gp?.toString() || "0");

    const handleNext = () => {
        onNext({
            equipment,
            wealth: {
                cp: parseInt(cp) || 0,
                sp: parseInt(sp) || 0,
                gp: parseInt(gp) || 0,
            }
        });
    };

    return (
        <ThemedView backgroundColor="surface.background" style={styles.screen}>
            <ScrollView contentContainerStyle={styles.scrollContentContainer} style={styles.scrollView}>
                <ThemedView style={styles.content}>

                    <TouchableOpacity style={styles.backButton} onPress={onBack}>
                        <ThemedText color="text.muted" style={{ fontWeight: "bold" }}>← Back to Spells</ThemedText>
                    </TouchableOpacity>

                    <Header
                        currentStep={5}
                        subtitle={`Manage the material possessions for ${initialData.name}.`}
                        title={"Inventory & Wealth"}
                        totalSteps={6}
                    />

                    <SectionCard iconColor={styles.inventoryIcon.color} iconLigature="monetization_on" title="Wealth">
                        <View style={{ paddingTop: 8 }}>
                            <CurrencyInput color="#CD7F32" label="Copper Pieces (CP)" symbol="CP" value={cp} onChangeText={setCp} />
                            <CurrencyInput color="#C0C0C0" label="Silver Pieces (SP)" symbol="SP" value={sp} onChangeText={setSp} />
                            <CurrencyInput color="#FFD700" label="Gold Pieces (GP)" symbol="GP" value={gp} onChangeText={setGp} />
                        </View>
                    </SectionCard>

                    <EquipmentManagerCard
                        accentColor={styles.equipmentIcon.color}
                        items={equipment}
                        onAddItem={(item) => setEquipment(prev => [...prev, item])}
                        onRemoveItem={(index) => setEquipment(prev => prev.filter((_, i) => i !== index))}
                    />

                    <NextStepButton disabled={false} onPress={handleNext} />

                </ThemedView>
            </ScrollView>
        </ThemedView>
    );
}