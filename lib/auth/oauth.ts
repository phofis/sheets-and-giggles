import * as Linking from "expo-linking";
import { supabase } from "@/lib/supabase";

export type OAuthProvider = "google" | "apple";

export const OAUTH_REDIRECT_PATH = "/auth-callback";
export const OAUTH_PROVIDER_STORAGE_KEY = "oauth_pending_provider";

export function getOAuthRedirectUrl(): string {
    return Linking.createURL(OAUTH_REDIRECT_PATH);
}

export function parseTokensFromOAuthUrl(url: string): {
    accessToken: string;
    refreshToken: string;
} {
    const callbackUrl = new URL(url);
    const rawParams = callbackUrl.hash.startsWith("#")
        ? callbackUrl.hash.slice(1)
        : callbackUrl.search.replace(/^\?/, "");
    const params = new URLSearchParams(rawParams);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    if (!accessToken || !refreshToken) {
        throw new Error("Missing tokens in OAuth callback");
    }
    return { accessToken, refreshToken };
}

export function readPendingOAuthProvider(): OAuthProvider | null {
    if (typeof window === "undefined") return null;
    const value = window.sessionStorage.getItem(OAUTH_PROVIDER_STORAGE_KEY);
    if (value === "google" || value === "apple") return value;
    return null;
}

export function storePendingOAuthProvider(provider: OAuthProvider): void {
    if (typeof window === "undefined") return;
    window.sessionStorage.setItem(OAUTH_PROVIDER_STORAGE_KEY, provider);
}

export function clearPendingOAuthProvider(): void {
    if (typeof window === "undefined") return;
    window.sessionStorage.removeItem(OAUTH_PROVIDER_STORAGE_KEY);
}

export async function completeOAuthSignIn(
    provider: OAuthProvider,
    accessToken: string,
    refreshToken: string,
): Promise<void> {
    const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
    });
    if (sessionError) throw sessionError;

    const authUser = sessionData.user;
    if (!authUser) throw new Error("No user after setSession");

    const meta = (authUser.user_metadata ?? {}) as Record<string, unknown>;
    const displayName =
        (typeof meta.full_name === "string" && meta.full_name) ||
        (typeof meta.name === "string" && meta.name) ||
        authUser.email ||
        "Adventurer";

    const { error: upsertError } = await supabase.from("users").upsert(
        {
            id: authUser.id,
            auth_provider: provider,
            auth_provider_id: typeof meta.sub === "string" ? meta.sub : authUser.id,
            email: authUser.email ?? null,
            display_name: displayName,
            avatar_url: typeof meta.avatar_url === "string" ? meta.avatar_url : null,
        },
        { onConflict: "id" },
    );
    if (upsertError) throw upsertError;
}
