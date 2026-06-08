import React from "react";
import { ViewStyle, StyleProp } from "react-native";
import { ThemeColorKey } from "@/constants/themes";
import { useStyles } from "@/hooks/useStyles";
import { HighlightedView } from "./HighlightedView";

interface BoxWithGlowProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    glow?: boolean;
    backgroundColor?: ThemeColorKey;
    glowColor?: ThemeColorKey;
    size?: "fixed" | "auto";
}

export const BoxWithGlow = ({
    children,
    style,
    glow = true,
    backgroundColor = "card.background",
    glowColor = "card.softGlow",
    size = "fixed",
}: BoxWithGlowProps) => {
    const isAuto = size === "auto";

    const { styles } = useStyles((t, c) => ({
        container: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: isAuto ? "flex-start" : "center",
            paddingHorizontal: t.spacing.md,
            paddingVertical: isAuto ? t.spacing.md : 0,
            backgroundColor: c(backgroundColor),
            borderRadius: t.borderRadius.md,
            height: isAuto ? undefined : 80,
            minHeight: isAuto ? 80 : undefined,
        },
    }));

    return (
        <HighlightedView
            glow={glow}
            glowColor={glowColor}
            style={[styles.container, style]}
        >
            {children}
        </HighlightedView>
    );
};
