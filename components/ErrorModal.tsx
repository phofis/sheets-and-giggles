import { Pressable, View } from "react-native";
import ModalBase from "@/components/ModalBase";
import { ThemedText } from "@/components/themed";
import { useStyles } from "@/hooks/useStyles";

type Props = {
    isOpen: boolean;
    title: string;
    message: string;
    onClose: () => void;
};

export function ErrorModal({ isOpen, title, message, onClose }: Props) {
    const { styles } = useStyles((t, c) => ({
        container: {
            backgroundColor: c("card.background"),
            borderRadius: t.borderRadius.lg,
            padding: t.spacing.xl,
            alignItems: "center",
            gap: t.spacing.md,
            width: 300,
        },
        message: {
            textAlign: "center",
            lineHeight: 22,
        },
        button: {
            marginTop: t.spacing.xs,
            paddingHorizontal: t.spacing.xl,
            paddingVertical: t.spacing.sm,
            borderRadius: t.borderRadius.md,
            backgroundColor: c("surface.surfaceElevated"),
        },
    }));

    return (
        <ModalBase isOpen={isOpen} setIsOpen={(open) => !open && onClose()}>
            <View style={styles.container}>
                <ThemedText color="text.heading" variant="headline">
                    {title}
                </ThemedText>
                <ThemedText
                    color="text.body"
                    style={styles.message}
                    variant="body"
                >
                    {message}
                </ThemedText>
                <Pressable style={styles.button} onPress={onClose}>
                    <ThemedText color="text.body" variant="label">
                        Got it
                    </ThemedText>
                </Pressable>
            </View>
        </ModalBase>
    );
}
