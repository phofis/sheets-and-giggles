import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput } from "react-native";
import { ThemeColorKey } from "@/constants/themes";
import { useStyles } from "@/hooks/useStyles";
import { HighlightedView } from "@/components/HighlightedView";

interface DynamicStringListCardProps {
    title: string;
    iconLigature: string;
    accentColor?: string;
    emptyTitle: string;
    emptySubtitle: string;
    emptyIconLigature?: string;
    items: string[];
    onAddItem: (item: string) => void;
    onRemove?: (index: number) => void;
    glow?: boolean;
    backgroundColor?: ThemeColorKey;
    glowColor?: ThemeColorKey;
}

export const DynamicStringListCard: React.FC<DynamicStringListCardProps> = ({
    title,
    iconLigature,
    accentColor = "#B488FF",
    emptyTitle,
    emptySubtitle,
    emptyIconLigature = "manage_search",
    items,
    onAddItem,
    onRemove,
    glow = true,
    backgroundColor = "card.background",
    glowColor = "card.softGlow",
}) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [inputText, setInputText] = useState("");

    const { styles } = useStyles((t, c) => ({
        container: {
            backgroundColor: c(backgroundColor),
            borderRadius: t.borderRadius.md,
            borderLeftWidth: 4,
            borderLeftColor: accentColor,
            overflow: "hidden",
            marginBottom: t.spacing.lg,
        },
        header: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: t.spacing.lg,
            paddingVertical: t.spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: "rgba(255, 255, 255, 0.05)",
            backgroundColor: "rgba(0,0,0,0.2)",
        },
        headerLeft: {
            flexDirection: "row",
            alignItems: "center",
            gap: t.spacing.sm,
        },
        headerIcon: {
            fontFamily: "Material Icons",
            fontSize: 20,
            color: accentColor,
        },
        headerTitle: {
            fontSize: 16,
            fontWeight: "bold",
            color: c("text.heading"),
        },
        addButton: {
            fontSize: 14,
            fontWeight: "bold",
            color: accentColor,
            letterSpacing: 0.5,
        },
        content: {
            padding: t.spacing.lg,
        },
        emptyStateContainer: {
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: t.spacing.md,
            gap: t.spacing.sm,
        },
        emptyIcon: {
            fontFamily: "Material Icons",
            fontSize: 48,
            color: "rgba(255, 255, 255, 0.2)",
            marginBottom: t.spacing.xs,
        },
        emptyTitle: {
            fontSize: 16,
            color: c("text.muted"),
            textAlign: "center",
        },
        emptySubtitle: {
            fontSize: 14,
            color: "rgba(255, 255, 255, 0.4)",
            textAlign: "center",
        },
        listContainer: {
            gap: t.spacing.md,
        },
        listItemRow: {
            flexDirection: "row",
            alignItems: "flex-start",
            gap: t.spacing.sm,
        },
        bullet: {
            color: accentColor,
            fontSize: 18,
            lineHeight: 22,
        },
        itemText: {
            flex: 1,
            fontSize: 16,
            color: c("text.onPrimary"),
            lineHeight: 22,
            fontFamily: t.typography.bodyFont,
        },
        removeIcon: {
            fontFamily: "Material Icons",
            fontSize: 20,
            color: c("text.muted"),
            paddingHorizontal: t.spacing.xs,
        },
        // Modal Styles
        modalOverlay: {
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            justifyContent: "center",
            alignItems: "center",
            padding: t.spacing.lg,
        },
        modalContent: {
            width: "100%",
            backgroundColor: c("surface.background"),
            borderRadius: t.borderRadius.lg,
            padding: t.spacing.xl,
            borderWidth: 1,
            borderColor: "rgba(255, 255, 255, 0.1)",
        },
        modalTitle: {
            fontSize: 18,
            fontWeight: "bold",
            color: c("text.heading"),
            marginBottom: t.spacing.md,
        },
        input: {
            backgroundColor: "rgba(0,0,0,0.3)",
            color: c("text.onPrimary"),
            padding: t.spacing.md,
            borderRadius: t.borderRadius.md,
            fontSize: 16,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.1)",
            marginBottom: t.spacing.lg,
        },
        modalActions: {
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: t.spacing.md,
        },
        modalButton: {
            paddingVertical: t.spacing.sm,
            paddingHorizontal: t.spacing.lg,
            borderRadius: t.borderRadius.md,
            justifyContent: "center",
            alignItems: "center",
        },
        cancelButtonText: {
            color: c("text.muted"),
            fontWeight: "bold",
        },
        submitButtonText: {
            color: "#FFFFFF",
            fontWeight: "bold",
        }
    }));

    const handleSave = () => {
        if (inputText.trim()) {
            onAddItem(inputText.trim());
        }
        setInputText("");
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setInputText("");
        setIsModalVisible(false);
    };

    return (
        <>
            <HighlightedView glow={glow} glowColor={glowColor} style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Text style={styles.headerIcon}>{iconLigature}</Text>
                        <Text style={styles.headerTitle}>{title}</Text>
                    </View>
                    <TouchableOpacity onPress={() => setIsModalVisible(true)} activeOpacity={0.7}>
                        <Text style={styles.addButton}>+ ADD</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    {items.length === 0 ? (
                        <View style={styles.emptyStateContainer}>
                            <Text style={styles.emptyIcon}>{emptyIconLigature}</Text>
                            <Text style={styles.emptyTitle}>{emptyTitle}</Text>
                            <Text style={styles.emptySubtitle}>{emptySubtitle}</Text>
                        </View>
                    ) : (
                        <View style={styles.listContainer}>
                            {items.map((item, index) => (
                                <View key={index} style={styles.listItemRow}>
                                    <Text style={styles.bullet}>•</Text>
                                    <Text style={styles.itemText}>{item}</Text>
                                    {onRemove && (
                                        <TouchableOpacity onPress={() => onRemove(index)} activeOpacity={0.7}>
                                            <Text style={styles.removeIcon}>close</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            </HighlightedView>

            <Modal visible={isModalVisible} transparent animationType="fade" onRequestClose={handleCancel}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add {title}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder={`Enter ${title.toLowerCase()}...`}
                            placeholderTextColor="rgba(255,255,255,0.4)"
                            value={inputText}
                            onChangeText={setInputText}
                            autoFocus
                        />
                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.modalButton} onPress={handleCancel}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: accentColor }]}
                                onPress={handleSave}
                            >
                                <Text style={styles.submitButtonText}>Add to list</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
};