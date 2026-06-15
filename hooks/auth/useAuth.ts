import { currentUserQueryKey, fetchCurrentUser } from "@/hooks/data/useCurrentUser";
import { queryClient, queryPersister } from "@/lib/queryClient";
import { supabase } from "@/lib/supabase";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import { useEffect, useMemo, useState } from "react";

// DEV ONLY: set to a UUID to bypass auth and act as that user. Set to null to use real auth.
const MOCK_USER_ID: string | null = "af2095b3-be27-4f55-b731-016b858b5d3e";

export interface UseAuthResult {
    session: Session | null;
    user: User | null;
    loading: boolean;
    lastEvent: AuthChangeEvent | null;
    signOut: () => Promise<void>;
}

function warmUserCache(userId: string) {
    return queryClient.prefetchQuery({
        queryKey: currentUserQueryKey(userId),
        queryFn: () => fetchCurrentUser(userId),
    });
}

async function purgePersistedCache() {
    queryClient.clear();
    await queryPersister.removeClient();
}

function buildMockSession(userId: string): Session {
    const user = {
        id: userId,
        aud: "authenticated",
        role: "authenticated",
        email: "mock@example.com",
        app_metadata: { provider: "mock" },
        user_metadata: { full_name: "Mock User" },
        created_at: new Date(0).toISOString(),
    } as unknown as User;

    return {
        access_token: "mock-access-token",
        refresh_token: "mock-refresh-token",
        expires_in: 60 * 60 * 24 * 365,
        expires_at: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365,
        token_type: "bearer",
        user,
    } as Session;
}

export function useAuth(): UseAuthResult {
    const mockSession = useMemo(
        () => (MOCK_USER_ID ? buildMockSession(MOCK_USER_ID) : null),
        [],
    );

    const [session, setSession] = useState<Session | null>(mockSession);
    const [loading, setLoading] = useState(!mockSession);
    const [lastEvent, setLastEvent] = useState<AuthChangeEvent | null>(
        mockSession ? "SIGNED_IN" : null,
    );

    useEffect(() => {
        if (mockSession) {
            void warmUserCache(mockSession.user.id);
            return;
        }

        let cancelled = false;

        supabase.auth.getSession().then(({ data }) => {
            if (cancelled) return;
            setSession(data.session);
            setLoading(false);
            if (data.session) {
                void warmUserCache(data.session.user.id);
            }
        });

        const { data } = supabase.auth.onAuthStateChange((event, nextSession) => {
            if (cancelled) return;
            setSession(nextSession);
            setLoading(false);
            setLastEvent(event);

            if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
                if (nextSession) {
                    void warmUserCache(nextSession.user.id);
                }
            } else if (event === "SIGNED_OUT") {
                void purgePersistedCache();
            }
        });

        return () => {
            cancelled = true;
            data.subscription.unsubscribe();
        };
    }, [mockSession]);

    const signOut = async () => {
        if (mockSession) return; // no-op in mock mode
        await supabase.auth.signOut();
        await purgePersistedCache();
    };

    return {
        session,
        user: session?.user ?? null,
        loading,
        lastEvent,
        signOut,
    };
}
