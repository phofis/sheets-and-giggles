import { View, type ViewStyle } from "react-native";
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
    return (
        <View pointerEvents="box-none" style={[{ flex: 1 }, style]}>
            {children}
            <EditModeToggle isEditMode={isEditMode} onToggle={onToggleEditMode} />
        </View>
    );
}
