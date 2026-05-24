import { Pressable, View, ViewStyle, StyleProp } from "react-native";
import { useStyles } from "@/hooks/useStyles";

interface ButtonRowProps {
    count: number;
    selectedCount: number;
    onPress: (index: number) => void;
    renderButton: (filled: boolean, index: number, value: number) => React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

export function ButtonRow({
    count,
    selectedCount,
    onPress,
    renderButton,
    style,
}: ButtonRowProps) {
    const { styles } = useStyles((t) => ({
        row: {
            flexDirection: "row",
            gap: t.spacing.xs,
        },
    }));

    return (
        <View style={[styles.row, style]}>
            {Array.from({ length: count }, (_, index) => (
                <Pressable key={index} onPress={() => onPress(index)}>
                    {renderButton(index < selectedCount, index, index)}
                </Pressable>
            ))}
        </View>
    );
}