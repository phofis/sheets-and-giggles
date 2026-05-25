import { ThemeProvider } from "@/context/ThemeContext";
import { CharacterIdProvider } from "@/context/CharacterIdContext";
import { PERSIST_BUSTER, PERSIST_MAX_AGE, queryClient, queryPersister } from "@/lib/queryClient";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useAuth } from "@/hooks/auth/useAuth";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import {
    Manrope_300Light,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
} from "@expo-google-fonts/manrope";
import {
    NotoSerif_400Regular,
    NotoSerif_600SemiBold,
    NotoSerif_700Bold,
} from "@expo-google-fonts/noto-serif";

SplashScreen.preventAutoHideAsync();

const PUBLIC_ROUTES = new Set(["login", "signup"]);

function useProtectedRoute() {
    const { session, loading } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;
        const first = segments[0];
        const isPublic = first ? PUBLIC_ROUTES.has(first) : false;

        if (!session && !isPublic) {
            router.replace("/login");
        } else if (session && isPublic) {
            router.replace("/landing");
        }
    }, [session, loading, segments, router]);
}

function RootLayoutInner() {
    const { color } = useAppTheme();
    useProtectedRoute();

    return (
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{
                persister: queryPersister,
                maxAge: PERSIST_MAX_AGE,
                buster: PERSIST_BUSTER,
            }}
        >
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: {
                        backgroundColor: color("surface.background"),
                    },
                }}
            />
        </PersistQueryClientProvider>
    );
}

export default function RootLayout() {
    const [loaded, error] = useFonts({
        "manrope-light": Manrope_300Light,
        manrope: Manrope_400Regular,
        "manrope-medium": Manrope_500Medium,
        "manrope-semibold": Manrope_600SemiBold,
        "manrope-bold": Manrope_700Bold,
        notoSerif: NotoSerif_400Regular,
        "notoSerif-semibold": NotoSerif_600SemiBold,
        "notoSerif-bold": NotoSerif_700Bold,
    });

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    return (
        <ThemeProvider>
            <CharacterIdProvider>
                <RootLayoutInner />
            </CharacterIdProvider>
        </ThemeProvider>
    );
}
