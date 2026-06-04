import { useStyles } from "@/hooks/useStyles";
import React, { ReactNode } from "react";
import { Keyboard, Modal, Pressable, StyleSheet, View } from "react-native";

type Props = {
    children: ReactNode;
    isOpen: boolean;
    setIsOpen?: (open: boolean) => void;
    dismissOnBackdropPress?: boolean;
};

export default function ModalBase({
    children,
    isOpen,
    setIsOpen,
    dismissOnBackdropPress = true,
}: Props) {
    const { styles } = useStyles(() => ({
        root: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        },
        backdrop: {
            backgroundColor: "rgba(0,0,0,0.5)",
        },
        content: {
            zIndex: 1,
            elevation: 1,
        },
    }));

    const close = () => {
        Keyboard.dismiss();
        setIsOpen?.(false);
    };

    return (
        <Modal
            transparent
            animationType="fade"
            visible={isOpen}
            onRequestClose={close}
        >
            <View style={styles.root}>
                <Pressable
                    style={[StyleSheet.absoluteFill, styles.backdrop]}
                    onPress={dismissOnBackdropPress ? close : undefined}
                />
                <View style={styles.content}>{children}</View>
            </View>
        </Modal>
    );
}
