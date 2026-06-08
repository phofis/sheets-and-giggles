import React from "react";
import { View, ViewStyle, TextStyle } from "react-native";
import { ThemedText } from "./themed";
import { EditableField } from "@/components/editing/EditableField";
import { useStyles } from "@/hooks/useStyles";
import { ThemeColorKey } from "@/constants/themes";

const PENCIL_SLOT_WIDTH = 18;

interface NoteProps {
    title?: string;
    titleColor?: ThemeColorKey;
    children: React.ReactNode;
    accentColor?: ThemeColorKey;
    accent?: boolean;
    backgroundColor?: ThemeColorKey;
    textColor?: ThemeColorKey;
    headerVariant?: "headline" | "body" | "label";
    blurIntensity?: number;
    containerStyle?: ViewStyle;
    contentStyle?: TextStyle;
    isEditMode?: boolean;
    onEditContent?: () => void;
}

export const Note: React.FC<NoteProps> = ({
    title,
    titleColor = "palette.primary",
    children,
    accentColor = "palette.primary",
    accent = false,
    backgroundColor = "card.background",
    textColor = "text.muted",
    headerVariant = "headline",
    containerStyle,
    contentStyle,
    isEditMode = false,
    onEditContent,
}) => {
    const { styles, color } = useStyles((_) => ({
        container: {
            padding: 32,
            borderRadius: 24,
            overflow: "hidden",
            alignSelf: "stretch",
            flexDirection: "row",
        },
        accentBar: {
            width: 4,
            height: 24,
            borderRadius: 2,
            position: "absolute",
            left: 12,
            top: 36,
        },
        innerWrapper: { flex: 1, gap: 16 },
        header: { textTransform: "none", fontWeight: "400" },
        contentContainer: {
            alignSelf: "stretch",
            minHeight: 26,
        },
        defaultText: { fontFamily: "Manrope", fontSize: 16, fontWeight: "300", lineHeight: 26 },
    }));

    const content =
        typeof children === "string" ? (
            <ThemedText
                color={textColor}
                style={[styles.defaultText, contentStyle]}
                variant="body"
            >
                {children}
            </ThemedText>
        ) : (
            children
        );

    return (
        <View
            style={[styles.container, { backgroundColor: color(backgroundColor) }, containerStyle]}
        >
            <View style={accent && [styles.accentBar, { backgroundColor: color(accentColor) }]} />

            <View style={styles.innerWrapper}>
                {title && (
                    <ThemedText color={titleColor} style={styles.header} variant={headerVariant}>
                        {title}
                    </ThemedText>
                )}

                <View
                    style={[
                        styles.contentContainer,
                        onEditContent && { paddingRight: PENCIL_SLOT_WIDTH },
                    ]}
                >
                    <EditableField
                        isEditMode={isEditMode}
                        reservePencilSpace={!!onEditContent}
                        onPress={onEditContent}
                    >
                        {content}
                    </EditableField>
                </View>
            </View>
        </View>
    );
};
