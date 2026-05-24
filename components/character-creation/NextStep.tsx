import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { useStyles } from "@/hooks/useStyles";

interface NextStepButtonProps {
    onPress: () => void;
    disabled?: boolean;
}

export const NextStepButton: React.FC<NextStepButtonProps> = ({
    onPress,
    disabled = false
}) => {
    const { styles } = useStyles((t, c) => ({
        button: {
            backgroundColor: c("card.glow"),
            borderRadius: 12,
            paddingVertical: 16,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            marginTop: t.spacing.xl,
            marginBottom: t.spacing.xxl,
            opacity: disabled ? 0.5 : 1,
        },
        text: {
            // color: c("text.onPrimary"),
            fontWeight: "600",
            letterSpacing: 0.5,
        }
    }));

    return (
        <TouchableOpacity
            style={styles.button}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.8}
        >
            <Text style={styles.text}>Next Step →</Text>
        </TouchableOpacity>
    );
};