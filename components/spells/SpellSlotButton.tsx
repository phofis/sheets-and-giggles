import { Pressable } from "react-native";
import { useStyles } from "@/hooks/useStyles";
import { ThemedView } from "@/components/themed/ThemedView";

interface SpellSlotButtonProps {
    isUsed: boolean;
}
//TODO: Change color
export function SpellSlotButton({ isUsed}: SpellSlotButtonProps) {
    const { styles, color } = useStyles((t, c) => ({
        container: {
            width: 36,
            height: 36,
            borderRadius: 18,
            borderWidth: 2,
            justifyContent: "center",
            alignItems: "center",
        },
        unused: {
            borderColor: c("palette.tertiary"),
        },
        used: {
            backgroundColor: c("palette.tertiary"),
        },
    }))

    const containerStyle = isUsed ? styles.used : styles.unused;

    return (
        <ThemedView style={[styles.container, containerStyle]} />
    );
}
