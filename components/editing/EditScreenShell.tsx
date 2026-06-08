import { Pressable, View, type ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStyles } from "@/hooks/useStyles";
import { useAuth } from "@/hooks/auth/useAuth";
import { EditModeToggle } from "./EditModeToggle";

type Props = {
    isEditMode: boolean;
    onToggleEditMode: () => void;
    children: React.ReactNode;
    style?: ViewStyle;
};

export function EditScreenShell({
    isEditMode,
    onToggleEditMode,
    children,
    style,
}: Props) {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { signOut } = useAuth();

    const { styles, color } = useStyles((t) => ({
        actionsRow: {
            position: "absolute",
            top: insets.top + t.spacing.xs,
            left: t.spacing.lg,
            zIndex: 100,
            elevation: 8,
            flexDirection: "row",
            gap: t.spacing.sm,
        },
        actionButton: {
            padding: t.spacing.sm,
            borderRadius: t.borderRadius.full,
        },
        content: {
            flex: 1,
            paddingTop: 22 + t.spacing.sm * 2 + t.spacing.xs,
        },
    }));

    return (
        <View pointerEvents="box-none" style={[{ flex: 1 }, style]}>
            <View pointerEvents="box-none" style={styles.content}>
                {children}
            </View>
            <View pointerEvents="box-none" style={styles.actionsRow}>
                <Pressable
                    accessibilityLabel="Back to My Adventurers"
                    accessibilityRole="button"
                    style={({ pressed }) => [
                        styles.actionButton,
                        { opacity: pressed ? 0.7 : 1 },
                    ]}
                    onPress={() => router.replace("/my-adventurers")}
                >
                    <Ionicons
                        color={color("text.muted")}
                        name="people-outline"
                        size={22}
                    />
                </Pressable>
                <Pressable
                    accessibilityLabel="Log out"
                    accessibilityRole="button"
                    style={({ pressed }) => [
                        styles.actionButton,
                        { opacity: pressed ? 0.7 : 1 },
                    ]}
                    onPress={async () => {
                        await signOut();
                        router.replace("/login");
                    }}
                >
                    <Ionicons
                        color={color("text.muted")}
                        name="log-out-outline"
                        size={22}
                    />
                </Pressable>
            </View>
            <EditModeToggle
                isEditMode={isEditMode}
                onToggle={onToggleEditMode}
            />
        </View>
    );
}
