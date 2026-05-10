import { useState } from "react";
import { Pressable, ViewStyle, StyleProp } from "react-native";
import { useStyles } from "@/hooks/useStyles";
import { HighlightedView } from "./HighlightedView";
import { ThemeColorKey } from "@/constants/themes";
interface CollapsibleCardProps {
    header: React.ReactNode;
    shortContent: React.ReactNode;
    fullContent: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    glowColor?: ThemeColorKey;
}

export function CollapsibleCard({ header, shortContent, fullContent, style, glowColor = "card.softGlow" }: CollapsibleCardProps) {
    const { styles } = useStyles((t, c) => ({
        pressable: { 
            marginVertical: t.spacing.sm,
        },
        pressed: { 
            opacity: 0.96,
        },
        container: {
            padding: t.spacing.md,
            justifyContent: "flex-start",
            alignItems: "stretch",
            backgroundColor: c("card.background"),
            borderRadius: t.borderRadius.lg,
        },
        containerExpanded: { 
            paddingBottom: t.spacing.lg 
        },
    }));

    const [expanded, setExpanded] = useState(false);
    const [pressed, setPressed] = useState(false);

    return (
        <Pressable
            style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
            onPress={() => setExpanded((value) => !value)}
            onPressIn={() => setPressed(true)}
            onPressOut={() => setPressed(false)}
        >
            <HighlightedView
                glow = {glowColor ? true : false}
                glowColor={glowColor}
                style={[styles.container, expanded && styles.containerExpanded, style]}
            >
                {header}
                {!expanded ? shortContent : fullContent}
            </HighlightedView>
        </Pressable>
    );
}