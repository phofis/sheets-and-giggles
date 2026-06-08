import React from "react";
import { View, Switch, Pressable } from "react-native";
import { useStyles } from "@/hooks/useStyles";
import { ThemedText } from "@/components/themed";
import { useAppTheme } from "@/hooks/useAppTheme";
import { ThemeColorKey } from "@/constants/themes";

interface SliderProps {
    value: boolean;
    onValueChange: (value: boolean) => void;
    label?: string;
    activeColor?: ThemeColorKey;
    inactiveColor?: ThemeColorKey;
}

export const Slider = ({
    value,
    onValueChange,
    label,
    activeColor = "semantic.success",
    inactiveColor = "palette.secondary",
}: SliderProps) => {
    const { color } = useAppTheme();

    const { styles } = useStyles((t, c) => ({
        container: {
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            gap: t.spacing.md,
        },
        label: {
            fontSize: 14,
            color: c("text.body"),
        },
        switchContainer: {
            flexDirection: "row",
            alignItems: "center",
            gap: t.spacing.sm,
        },
    }));

    return (
        <Pressable
            style={styles.container}
            onPress={(e) => {
                // Prevent event bubbling to parent Pressable
                e.stopPropagation?.();
            }}
        >
            {label && <ThemedText style={styles.label}>{label}</ThemedText>}
            <View style={styles.switchContainer}>
                <Switch
                    value={value}
                    onValueChange={onValueChange}
                    trackColor={{
                        false: color(inactiveColor),
                        true: color(activeColor),
                    }}
                    thumbColor={
                        value ? color(activeColor) : color(inactiveColor)
                    }
                />
            </View>
        </Pressable>
    );
};
