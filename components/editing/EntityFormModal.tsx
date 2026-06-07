import { useEffect, useMemo, useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { HighlightedView } from "../HighlightedView";
import ModalBase from "../ModalBase";
import { Checkbox } from "../Checkbox";
import { ThemedText } from "../themed";
import { useStyles } from "@/hooks/useStyles";

type FieldType = "text" | "numeric" | "textarea" | "checkbox" | "select";

export type EntityFormField = {
    name: string;
    label: string;
    placeholder?: string;
    type?: FieldType;
    initialValue?: string | number | boolean;
    min?: number;
    max?: number;
    multiline?: boolean;
    optional?: boolean;
    options?: { value: string; label: string }[];
};

type Props = {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    title: string;
    fields: EntityFormField[];
    submitLabel?: string;
    onSubmit: (values: Record<string, string | number | boolean>) => void;
};

export default function EntityFormModal({
    isOpen,
    setIsOpen,
    title,
    fields,
    submitLabel = "Save",
    onSubmit,
}: Props) {
    const initialValues = useMemo(
        () =>
            Object.fromEntries(
                fields.map((field) => [
                    field.name,
                    field.type === "checkbox"
                        ? Boolean(field.initialValue)
                        : field.initialValue !== undefined
                          ? String(field.initialValue)
                          : "",
                ]),
            ) as Record<string, string | boolean>,
        [fields],
    );

    const [values, setValues] =
        useState<Record<string, string | boolean>>(initialValues);
    const [openSelect, setOpenSelect] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setValues(initialValues);
            setOpenSelect(null);
        }
    }, [isOpen, initialValues]);

    const { styles, color } = useStyles((t, c) => ({
        container: {
            flexDirection: "column",
            alignItems: "stretch",
            gap: t.spacing.lg,
            paddingVertical: t.spacing.xl,
            paddingHorizontal: t.spacing.lg,
            width: 340,
            maxWidth: "100%",
            borderRadius: t.borderRadius.lg,
            backgroundColor: c("card.background"),
        },
        header: {
            fontSize: 18,
            fontWeight: "700",
            letterSpacing: 0.5,
        },
        fieldLabel: {
            fontSize: 14,
            color: c("text.muted"),
            marginBottom: t.spacing.xs,
        },
        fieldContainer: {
            gap: t.spacing.sm,
        },
        inputWrapper: {
            borderWidth: 1,
            borderRadius: t.borderRadius.md,
            paddingHorizontal: t.spacing.md,
            minHeight: 52,
            justifyContent: "center",
            backgroundColor: c("surface.background"),
            borderColor: c("border.default"),
        },
        input: {
            fontSize: 16,
            color: c("text.onPrimary") ?? c("text.body"),
            fontFamily: t.typography.bodyFont,
            padding: 0,
            minHeight: 20,
        },
        selectTrigger: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderWidth: 1,
            borderColor: c("border.default"),
            borderRadius: t.borderRadius.md,
            backgroundColor: c("surface.background"),
            paddingHorizontal: t.spacing.md,
            minHeight: 52,
        },
        menu: {
            marginTop: t.spacing.xs,
            borderWidth: 1,
            borderColor: c("border.subtle"),
            borderRadius: t.borderRadius.md,
            backgroundColor: c("card.background"),
            overflow: "hidden",
        },
        menuItem: {
            padding: t.spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: c("border.default"),
        },
        menuItemLast: {
            borderBottomWidth: 0,
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

    const normalizedFields = useMemo(
        () =>
            fields.map((field) => ({
                type: field.type ?? "text",
                multiline: field.multiline ?? field.type === "textarea",
                ...field,
            })),
        [fields],
    );

    const isValid = normalizedFields.every((field) => {
        if (field.optional || field.type === "checkbox") {
            return true;
        }

        const raw =
            typeof values[field.name] === "string"
                ? (values[field.name] as string).trim()
                : "";
        if (field.type === "numeric") {
            const parsed = parseInt(raw ?? "", 10);
            return (
                raw !== "" &&
                !Number.isNaN(parsed) &&
                (field.min === undefined || parsed >= field.min) &&
                (field.max === undefined || parsed <= field.max)
            );
        }

        return Boolean(raw && raw.length > 0);
    });

    const handleSave = () => {
        if (!isValid) return;

        const payload = normalizedFields.reduce(
            (acc, field) => {
                if (field.type === "checkbox") {
                    acc[field.name] = Boolean(values[field.name]);
                } else {
                    const raw = String(values[field.name]).trim();
                    if (field.type === "numeric") {
                        acc[field.name] = parseInt(raw, 10);
                    } else {
                        acc[field.name] = raw;
                    }
                }
                return acc;
            },
            {} as Record<string, string | number | boolean>,
        );

        onSubmit(payload);
        setIsOpen(false);
        setOpenSelect(null);
    };

    return (
        <ModalBase isOpen={isOpen} setIsOpen={setIsOpen}>
            <HighlightedView style={styles.container}>
                <ThemedText color="text.heading" style={styles.header}>
                    {title}
                </ThemedText>

                {normalizedFields.map((field) => (
                    <View key={field.name} style={styles.fieldContainer}>
                        <ThemedText
                            color="text.muted"
                            style={styles.fieldLabel}
                        >
                            {field.label}
                        </ThemedText>
                        {field.type === "checkbox" ? (
                            <Checkbox
                                value={Boolean(values[field.name])}
                                onValueChange={(value) =>
                                    setValues((current) => ({
                                        ...current,
                                        [field.name]: value,
                                    }))
                                }
                                label=""
                            />
                        ) : field.type === "select" ? (
                            <View>
                                <Pressable
                                    style={styles.selectTrigger}
                                    onPress={() =>
                                        setOpenSelect((current) =>
                                            current === field.name
                                                ? null
                                                : field.name,
                                        )
                                    }
                                >
                                    <ThemedText
                                        color="text.body"
                                        style={styles.input}
                                    >
                                        {field.options?.find(
                                            (option) =>
                                                option.value ===
                                                values[field.name],
                                        )?.label ??
                                            field.placeholder ??
                                            "Select..."}
                                    </ThemedText>
                                </Pressable>

                                {openSelect === field.name && (
                                    <View style={styles.menu}>
                                        {field.options?.map((option, index) => (
                                            <Pressable
                                                key={option.value}
                                                style={[
                                                    styles.menuItem,
                                                    index ===
                                                        (field.options
                                                            ?.length ?? 0) -
                                                            1 &&
                                                        styles.menuItemLast,
                                                ]}
                                                onPress={() => {
                                                    setValues((current) => ({
                                                        ...current,
                                                        [field.name]:
                                                            option.value,
                                                    }));
                                                    setOpenSelect(null);
                                                }}
                                            >
                                                <ThemedText color="text.body">
                                                    {option.label}
                                                </ThemedText>
                                            </Pressable>
                                        ))}
                                    </View>
                                )}
                            </View>
                        ) : (
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    autoFocus={
                                        normalizedFields[0].name === field.name
                                    }
                                    placeholder={
                                        field.placeholder ?? field.label
                                    }
                                    placeholderTextColor={color("text.muted")}
                                    returnKeyType={
                                        field.multiline ? "default" : "done"
                                    }
                                    selectionColor={color("text.lively")}
                                    style={styles.input}
                                    value={String(values[field.name] ?? "")}
                                    onChangeText={(value) =>
                                        setValues((current) => ({
                                            ...current,
                                            [field.name]: value,
                                        }))
                                    }
                                    keyboardType={
                                        field.type === "numeric"
                                            ? "number-pad"
                                            : "default"
                                    }
                                    multiline={field.multiline}
                                    textAlignVertical={
                                        field.multiline ? "top" : "center"
                                    }
                                    numberOfLines={field.multiline ? 4 : 1}
                                />
                            </View>
                        )}
                    </View>
                ))}

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
                        disabled={!isValid}
                        style={({ pressed }) => [
                            styles.saveBtn,
                            !isValid && styles.saveBtnDisabled,
                            { opacity: pressed && isValid ? 0.85 : 1 },
                        ]}
                        onPress={handleSave}
                    >
                        <ThemedText
                            color="buttonPrimary.text"
                            style={styles.saveText}
                        >
                            {submitLabel}
                        </ThemedText>
                    </Pressable>
                </View>
            </HighlightedView>
        </ModalBase>
    );
}
