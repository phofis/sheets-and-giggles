import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { useRouter } from "expo-router";
import { useStyles } from "@/hooks/useStyles";

interface NextStepButtonProps {
    onPress: () => void;
    disabled?: boolean;
    text?: string;
}

export const NextStepButton: React.FC<NextStepButtonProps> = ({
    onPress,
    disabled = false,
    text = "Next Step →",
}) => {
    const router = useRouter();

    const { styles } = useStyles((t, c) => ({
        row: {
            flexDirection: "row",
            gap: t.spacing.sm,
            marginTop: t.spacing.xl,
            marginBottom: t.spacing.xxl,
        },
        nextButton: {
            flex: 1,
            backgroundColor: c("card.glow"),
            borderRadius: 12,
            paddingVertical: 16,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            opacity: disabled ? 0.5 : 1,
        },
        abortButton: {
            backgroundColor: "transparent",
            borderRadius: 12,
            borderWidth: 1,
            borderColor: c("text.muted"),
            paddingVertical: 16,
            paddingHorizontal: 20,
            alignItems: "center",
            justifyContent: "center",
        },
        nextText: {
            fontWeight: "600",
            letterSpacing: 0.5,
        },
        abortText: {
            color: c("text.muted"),
            fontWeight: "600",
            letterSpacing: 0.5,
        },
    }));

    return (
        <View style={styles.row}>
            <TouchableOpacity
                activeOpacity={0.8}
                style={styles.abortButton}
                onPress={() => router.replace("/my-adventurers")}
            >
                <Text style={styles.abortText}>Abort</Text>
            </TouchableOpacity>
            <TouchableOpacity
                activeOpacity={0.8}
                disabled={disabled}
                style={styles.nextButton}
                onPress={onPress}
            >
                <Text style={styles.nextText}>{text}</Text>
            </TouchableOpacity>
        </View>
    );
};
