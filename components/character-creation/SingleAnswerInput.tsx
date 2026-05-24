import React from "react";
import { View, TextInput } from "react-native";
import Svg, { Path } from "react-native-svg";
import { ThemedText } from "@/components/themed";
import { useStyles } from "@/hooks/useStyles";

interface SingleAnswerInputProps {
    value: string;
    onChangeText: (text: string) => void;
    title?: string;
    placeholder?: string;
    minHeight?: number; // Added to interface
}

export const SingleAnswerInput: React.FC<SingleAnswerInputProps> = ({
    value,
    onChangeText,
    title = "Character Name",
    placeholder = "Enter a legendary name...",
    minHeight = 50 // Defaults to standard height, pass 200 or 300 for text areas
}) => {
    const { styles } = useStyles((theme, c) => ({
        container: {
            backgroundColor: c("card.background"),
            padding: theme.spacing.lg,
            borderRadius: theme.borderRadius.lg,
            marginBottom: theme.spacing.xl,
            gap: theme.spacing.md,
        },
        inputWrapper: {
            flexDirection: "row",
            backgroundColor: c("card.background"),
            borderRadius: theme.borderRadius.md,
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.md,
            gap: theme.spacing.sm,
            // Removed fixed minHeight from here so it can be dynamically injected
        },
        iconWrapper: {
            paddingTop: 2,
        },
        input: {
            flex: 1,
            color: c("text.muted"),
            fontFamily: theme.typography.bodyFont,
            fontSize: 16, 
            textAlignVertical: "top", 
            padding: 0,
        },
    }));

    return (
        <View style={styles.container}>
            <ThemedText color="text.heading" variant="headline">
                {title}
            </ThemedText>
            {/* Merged the dynamic minHeight with the static styles */}
            <View style={[styles.inputWrapper, { minHeight }]}>
                <View style={styles.iconWrapper}>
                    {/* Embedded SVG Pencil Icon */}
                    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                        <Path
                            d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"
                            stroke={styles.input.color}
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </Svg>
                </View>
                <TextInput
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={styles.input.color}
                    style={styles.input}
                    value={value}
                    multiline={true}
                    scrollEnabled={true}
                />
            </View>
        </View>
    );
};