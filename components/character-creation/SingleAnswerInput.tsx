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
    minHeight?: number;
}

export const SingleAnswerInput: React.FC<SingleAnswerInputProps> = ({
    value,
    onChangeText,
    title = "Character Name",
    placeholder = "Enter a legendary name...",
    minHeight = 50,
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
            <View style={[styles.inputWrapper, { minHeight }]}>
                <View style={styles.iconWrapper}>
                    {/* Embedded SVG Pencil Icon */}
                    <Svg fill="none" height={18} viewBox="0 0 24 24" width={18}>
                        <Path
                            d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"
                            stroke={styles.input.color}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                        />
                    </Svg>
                </View>
                <TextInput
                    multiline={true}
                    placeholder={placeholder}
                    placeholderTextColor={styles.input.color}
                    scrollEnabled={true}
                    style={styles.input}
                    value={value}
                    onChangeText={onChangeText}
                />
            </View>
        </View>
    );
};