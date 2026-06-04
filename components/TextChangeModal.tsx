import { useEffect, useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { HighlightedView } from "./HighlightedView";
import ModalBase from "./ModalBase";
import { ThemedText } from "./themed";
import { useStyles } from "@/hooks/useStyles";

type Props = {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    initialValue?: string;
    label?: string;
    placeholder?: string;
    onSubmit: (value: string) => void;
};

export default function TextChangeModal({
    isOpen,
    setIsOpen,
    initialValue = "",
    label = "Name",
    placeholder = "Enter new name",
    onSubmit,
}: Props) {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        if (isOpen) {
            setValue(initialValue);
        }
    }, [isOpen, initialValue]);

    const { styles, color } = useStyles((t, c) => ({
        container: {
            flexDirection: "column",
            alignItems: "stretch",
            gap: t.spacing.lg,
            paddingVertical: t.spacing.xl,
            paddingHorizontal: t.spacing.lg,
            width: 320,
            borderRadius: t.borderRadius.lg,
            backgroundColor: c("card.background"),
        },
        label: {
            fontSize: 12,
            letterSpacing: 1.2,
            textTransform: "uppercase",
            marginLeft: t.spacing.xs,
        },
        inputWrapper: {
            borderWidth: 1,
            borderRadius: t.borderRadius.md,
            paddingHorizontal: t.spacing.md,
            height: 52,
            justifyContent: "center",
            backgroundColor: c("surface.surface"),
            borderColor: c("border.subtle"),
        },
        input: {
            fontSize: 16,
            color: c("text.body"),
            fontFamily: t.typography.bodyFont,
            padding: 0,
        },
        buttonRow: {
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: t.spacing.sm,
        },
        cancelBtn: {
            paddingHorizontal: t.spacing.lg,
            paddingVertical: t.spacing.sm,
            borderRadius: t.borderRadius.md,
        },
        saveBtn: {
            paddingHorizontal: t.spacing.lg,
            paddingVertical: t.spacing.sm,
            borderRadius: t.borderRadius.md,
            backgroundColor: c("buttonPrimary.background"),
            borderWidth: 1,
            borderColor: c("buttonPrimary.border"),
        },
        saveBtnDisabled: {
            opacity: 0.4,
        },
        saveText: {
            fontFamily: t.typography.labelFont,
            fontSize: 14,
            letterSpacing: 0.5,
        },
    }));

    const trimmed = value.trim();
    const canSave = trimmed.length > 0 && trimmed !== initialValue.trim();

    const handleSave = () => {
        if (!canSave) return;
        onSubmit(trimmed);
        setIsOpen(false);
    };

    return (
        <ModalBase isOpen={isOpen} setIsOpen={setIsOpen}>
            <HighlightedView style={styles.container}>
                <ThemedText color="text.muted" style={styles.label}>
                    {label}
                </ThemedText>

                <View style={styles.inputWrapper}>
                    <TextInput
                        autoFocus
                        placeholder={placeholder}
                        placeholderTextColor={color("text.muted")}
                        returnKeyType="done"
                        selectionColor={color("text.lively")}
                        style={styles.input}
                        value={value}
                        onChangeText={setValue}
                        onSubmitEditing={handleSave}
                    />
                </View>

                <View style={styles.buttonRow}>
                    <Pressable
                        style={({ pressed }) => [
                            styles.cancelBtn,
                            { opacity: pressed ? 0.6 : 1 },
                        ]}
                        onPress={() => setIsOpen(false)}
                    >
                        <ThemedText color="text.muted" style={styles.saveText}>
                            Cancel
                        </ThemedText>
                    </Pressable>

                    <Pressable
                        disabled={!canSave}
                        style={({ pressed }) => [
                            styles.saveBtn,
                            !canSave && styles.saveBtnDisabled,
                            { opacity: pressed && canSave ? 0.85 : 1 },
                        ]}
                        onPress={handleSave}
                    >
                        <ThemedText
                            color="buttonPrimary.text"
                            style={styles.saveText}
                        >
                            Save
                        </ThemedText>
                    </Pressable>
                </View>
            </HighlightedView>
        </ModalBase>
    );
}
