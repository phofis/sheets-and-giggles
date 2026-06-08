import { ActivityIndicator, Pressable, View } from "react-native";
import { useEffect, useRef, useState } from "react";
import QRCode from "react-native-qrcode-svg";
import ModalBase from "@/components/ModalBase";
import { ThemedText } from "@/components/themed";
import { useStyles } from "@/hooks/useStyles";
import { useCharacterId } from "@/context/CharacterIdContext";
import { useCreateItemTransfer } from "@/hooks/data/useItemTransfers";
import type { ItemRow } from "@/hooks/data/useCharacterItems";

type Props = {
    item: ItemRow | null;
    isOpen: boolean;
    onClose: () => void;
};

export function ItemShareModal({ item, isOpen, onClose }: Props) {
    const characterId = useCharacterId();
    const createTransfer = useCreateItemTransfer(characterId);
    const [transferId, setTransferId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    // Prevent creating a second transfer if the modal re-renders with the same item
    const createdForItemId = useRef<string | null>(null);

    useEffect(() => {
        if (!isOpen || !item) {
            setTransferId(null);
            setError(null);
            createdForItemId.current = null;
            return;
        }
        if (createdForItemId.current === item.id) return;
        createdForItemId.current = item.id;

        createTransfer.mutate(
            {
                itemId: item.id,
                snapshot: {
                    name: item.name,
                    description: item.description ?? "",
                    rarity: item.rarity,
                    tag: item.tag,
                    quantity: item.quantity,
                    requires_attunement: item.requires_attunement,
                },
            },
            {
                onSuccess: (transfer) => setTransferId(transfer.id),
                onError: () =>
                    setError("Could not generate QR code. Please try again."),
            },
        );
    }, [isOpen, item?.id]);

    const { styles } = useStyles((t, c) => ({
        container: {
            backgroundColor: c("card.background"),
            borderRadius: t.borderRadius.lg,
            padding: t.spacing.xl,
            alignItems: "center",
            gap: t.spacing.lg,
            width: 300,
        },
        title: {
            fontSize: 18,
        },
        qrWrapper: {
            padding: t.spacing.md,
            backgroundColor: "#ffffff",
            borderRadius: t.borderRadius.md,
        },
        subtitle: {
            fontSize: 13,
            textAlign: "center",
        },
        expiry: {
            fontSize: 11,
            textAlign: "center",
            letterSpacing: 0.5,
        },
        closeButton: {
            paddingHorizontal: t.spacing.xl,
            paddingVertical: t.spacing.sm,
            borderRadius: t.borderRadius.md,
            backgroundColor: c("surface.surfaceElevated"),
        },
    }));

    return (
        <ModalBase isOpen={isOpen} setIsOpen={(open) => !open && onClose()}>
            <View style={styles.container}>
                <ThemedText
                    color="text.heading"
                    style={styles.title}
                    variant="headline"
                >
                    Share Item
                </ThemedText>

                {transferId ? (
                    <>
                        <View style={styles.qrWrapper}>
                            <QRCode size={200} value={transferId} />
                        </View>
                        <ThemedText
                            color="text.body"
                            style={styles.subtitle}
                            variant="body"
                        >
                            {"Have the other player scan this to receive\n"}
                            <ThemedText color="text.heading" variant="label">
                                {item?.name}
                            </ThemedText>
                        </ThemedText>
                        <ThemedText color="text.muted" style={styles.expiry}>
                            EXPIRES IN 24 HOURS
                        </ThemedText>
                    </>
                ) : error ? (
                    <ThemedText
                        color="semantic.error"
                        style={styles.subtitle}
                        variant="body"
                    >
                        {error}
                    </ThemedText>
                ) : (
                    <ActivityIndicator />
                )}

                <Pressable style={styles.closeButton} onPress={onClose}>
                    <ThemedText color="text.body" variant="label">
                        Close
                    </ThemedText>
                </Pressable>
            </View>
        </ModalBase>
    );
}
