import React from "react";
import {Text, View, TextInput, TouchableOpacity } from "react-native"
import { ThemedText } from "@/components/themed";
import { useStyles } from "@/hooks/useStyles";

interface LabeledInputProps {
    label: string;
    placeholder: string;
    value: string;
    onChangeText?: (text: string) => void;
    flex?: number;
    isDropdown?: boolean;
    onPress?: () => void;
}

export const LabeledInput: React.FC<LabeledInputProps> = ({
    label,
    placeholder,
    value,
    onChangeText,
    flex,
    isDropdown = false,
    onPress
}) => {
    const { styles } = useStyles((t, c) => ({
        container: {
            flex: flex,
            gap: t.spacing.xs,
        },
        label: {
            color: c("text.muted"),
            fontSize: 14,
            marginBottom: 4,
        },
        inputBox: {
            height: 48,
            borderWidth: 1,
            borderColor: "rgba(255, 255, 255, 0.2)",
            // borderRadius: t.radii.md,
            paddingHorizontal: t.spacing.md,
            justifyContent: "center",
        },
        inputText: {
            color: c("text.heading"),
            fontSize: 16,
            fontFamily: t.typography.bodyFont,
        }
    }));

    const content = isDropdown ? (
        <TouchableOpacity activeOpacity={0.7} style={styles.inputBox} onPress={onPress}>
            <ThemedText style={{ color: value ? styles.inputText.color : "rgba(255, 255, 255, 0.4)" }}>
                {value || placeholder}
            </ThemedText>
        </TouchableOpacity>
    ) : (
        <View style={styles.inputBox}>
            <TextInput
                placeholder={placeholder}
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                style={styles.inputText}
                value={value}
                onChangeText={onChangeText}
            />
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            {content}
        </View>
    );
};