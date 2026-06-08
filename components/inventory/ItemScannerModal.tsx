import { Pressable, View } from "react-native";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CameraView, useCameraPermissions } from "expo-camera";
import ModalBase from "@/components/ModalBase";
import { ThemedText } from "@/components/themed";
import { useStyles } from "@/hooks/useStyles";
import { useCharacterId } from "@/context/CharacterIdContext";
import { useClaimItemTransfer } from "@/hooks/data/useItemTransfers";
import { supabase } from "@/lib/supabase";

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

type Feedback = { kind: "success" | "error"; message: string };

export function ItemScannerModal({ isOpen, onClose }: Props) {
    const characterId = useCharacterId();
    const queryClient = useQueryClient();
    const claimTransfer = useClaimItemTransfer(characterId);
    const [permission, requestPermission] = useCameraPermissions();
    const [scanning, setScanning] = useState(true);
    const [feedback, setFeedback] = useState<Feedback | null>(null);

    const handleClose = () => {
        setScanning(true);
        setFeedback(null);
        claimTransfer.reset();
        onClose();
    };

    const resetForRetry = () => {
        setFeedback(null);
        setScanning(true);
        claimTransfer.reset();
    };

    const handleBarcodeScan = ({ data }: { data: string }) => {
        if (!scanning) return;
        setScanning(false);
        claimTransfer.mutate(data, {
            onSuccess: async () => {
                // Bypass staleTime/persister: fetch fresh rows and write
                // directly into the cache so the UI updates immediately.
                const { data: freshItems } = await supabase
                    .from("character_items")
                    .select("*")
                    .eq("character_id", characterId)
                    .order("created_at", { ascending: true });
                if (freshItems) {
                    queryClient.setQueryData(
                        ["character", characterId, "items"],
                        freshItems,
                    );
                }
                setFeedback({
                    kind: "success",
                    message: "Item added to your inventory!",
                });
            },
            onError: (err) =>
                setFeedback({ kind: "error", message: err.message }),
        });
    };

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
        camera: {
            width: 260,
            height: 260,
            borderRadius: t.borderRadius.md,
            overflow: "hidden",
        },
        hint: {
            fontSize: 13,
            textAlign: "center",
        },
        feedback: {
            fontSize: 14,
            textAlign: "center",
        },
        button: {
            paddingHorizontal: t.spacing.xl,
            paddingVertical: t.spacing.sm,
            borderRadius: t.borderRadius.md,
            backgroundColor: c("surface.surfaceElevated"),
        },
        permissionButton: {
            paddingHorizontal: t.spacing.xl,
            paddingVertical: t.spacing.sm,
            borderRadius: t.borderRadius.md,
            backgroundColor: c("palette.primary"),
        },
    }));

    return (
        <ModalBase isOpen={isOpen} setIsOpen={(open) => !open && handleClose()}>
            <View style={styles.container}>
                <ThemedText
                    color="text.heading"
                    style={styles.title}
                    variant="headline"
                >
                    Claim Item
                </ThemedText>

                {!permission?.granted ? (
                    <>
                        <ThemedText
                            color="text.body"
                            style={styles.hint}
                            variant="body"
                        >
                            Camera access is needed to scan QR codes.
                        </ThemedText>
                        <Pressable
                            style={styles.permissionButton}
                            onPress={requestPermission}
                        >
                            <ThemedText color="text.heading" variant="label">
                                Allow Camera
                            </ThemedText>
                        </Pressable>
                    </>
                ) : feedback ? (
                    <>
                        <ThemedText
                            color={
                                feedback.kind === "success"
                                    ? "semantic.success"
                                    : "semantic.error"
                            }
                            style={styles.feedback}
                            variant="body"
                        >
                            {feedback.message}
                        </ThemedText>
                        {feedback.kind === "error" && (
                            <Pressable
                                style={styles.button}
                                onPress={resetForRetry}
                            >
                                <ThemedText color="text.body" variant="label">
                                    Try Again
                                </ThemedText>
                            </Pressable>
                        )}
                    </>
                ) : (
                    <>
                        <CameraView
                            barcodeScannerSettings={{
                                barcodeTypes: ["qr"],
                            }}
                            style={styles.camera}
                            onBarcodeScanned={handleBarcodeScan}
                        />
                        <ThemedText
                            color="text.muted"
                            style={styles.hint}
                            variant="body"
                        >
                            Point the camera at the other player&apos;s QR code.
                        </ThemedText>
                    </>
                )}

                <Pressable style={styles.button} onPress={handleClose}>
                    <ThemedText color="text.body" variant="label">
                        {feedback?.kind === "success" ? "Done" : "Cancel"}
                    </ThemedText>
                </Pressable>
            </View>
        </ModalBase>
    );
}
