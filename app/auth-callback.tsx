import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useRouter } from "expo-router";
import { ThemedText, ThemedView } from "@/components/themed";
import { useAppTheme } from "@/hooks/useAppTheme";
import {
    clearPendingOAuthProvider,
    completeOAuthSignIn,
    parseTokensFromOAuthUrl,
    readPendingOAuthProvider,
    type OAuthProvider,
} from "@/lib/auth/oauth";

export default function AuthCallbackScreen() {
    const router = useRouter();
    const { color } = useAppTheme();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const finish = async () => {
            try {
                if (typeof window === "undefined") {
                    throw new Error("OAuth callback must run in the browser");
                }

                const provider: OAuthProvider = readPendingOAuthProvider() ?? "google";
                const { accessToken, refreshToken } = parseTokensFromOAuthUrl(window.location.href);

                await completeOAuthSignIn(provider, accessToken, refreshToken);
                clearPendingOAuthProvider();

                if (!cancelled) {
                    router.replace("/landing");
                }
            } catch (caught) {
                clearPendingOAuthProvider();
                if (!cancelled) {
                    setError(caught instanceof Error ? caught.message : "Sign-in failed");
                }
            }
        };

        void finish();

        return () => {
            cancelled = true;
        };
    }, [router]);

    return (
        <ThemedView
            backgroundColor="surface.background"
            style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24 }}
        >
            {error ? (
                <View style={{ alignItems: "center", gap: 12 }}>
                    <ThemedText color="semantic.error" style={{ textAlign: "center" }}>
                        {error}
                    </ThemedText>
                    <ThemedText
                        color="text.lively"
                        onPress={() => router.replace("/login")}
                        style={{ fontWeight: "600" }}
                    >
                        Back to login
                    </ThemedText>
                </View>
            ) : (
                <>
                    <ActivityIndicator color={color("text.lively")} size="large" />
                    <ThemedText color="text.muted" style={{ marginTop: 16 }}>
                        Completing sign-in…
                    </ThemedText>
                </>
            )}
        </ThemedView>
    );
}
