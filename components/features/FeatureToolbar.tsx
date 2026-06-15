import { Toolbar } from "@/components/Toolbar";
import { useFieldEditorModals } from "@/hooks/editing/useFieldEditorModals";
import { Constants } from "@/types/supabase";
import type { Database } from "@/types/supabase";

type FormField = {
    name: string;
    label: string;
    placeholder?: string;
    type?: "text" | "numeric" | "textarea" | "checkbox" | "select";
    multiline?: boolean;
    optional?: boolean;
    initialValue?: string | number | boolean;
    min?: number;
    max?: number;
    options?: { value: string; label: string }[];
};

type FeatureToolbarProps = {
    search: string;
    onSearchChange: (value: string) => void;
    onFilterPress?: () => void;
    onAssignFeature: (feature: {
        feature_id: string;
        assigned_source: Database["public"]["Enums"]["feature_assignment_source"];
    }) => void;
    hideAdd?: boolean;
    searchPlaceholder?: string;
    onAddPressOverride?: () => void;
};

const assignedSourceOptions = Constants.public.Enums.feature_assignment_source.map(
    (value) => ({
        value,
        label: value.charAt(0).toUpperCase() + value.slice(1).replace("_", " "),
    }),
);

export const featureFormFields: FormField[] = [
    {
        name: "feature_id",
        label: "Feature ID",
        placeholder: "Enter feature ID",
        type: "text",
    },
    {
        name: "assigned_source",
        label: "Assigned source",
        type: "select",
        options: assignedSourceOptions,
        initialValue: "adventure",
    },
];

export function FeatureToolbar({
    search,
    onSearchChange,
    onFilterPress,
    onAssignFeature,
    hideAdd = false,
    searchPlaceholder = "Search features...",
    onAddPressOverride,
}: FeatureToolbarProps) {
    const { openForm, modals } = useFieldEditorModals();

    const handleAddPress =
        onAddPressOverride ??
        (() =>
            openForm({
                title: "Assign feature",
                submitLabel: "Assign feature",
                fields: featureFormFields,
                onSubmit: (values) => {
                    onAssignFeature({
                        feature_id: String(values.feature_id ?? ""),
                        assigned_source: String(
                            values.assigned_source ?? "adventure",
                        ) as Database["public"]["Enums"]["feature_assignment_source"],
                    });
                },
            }));

    return (
        <>
            {modals}
            <Toolbar
                placeholder={searchPlaceholder}
                search={search}
                onAddPress={hideAdd ? undefined : handleAddPress}
                onFilterPress={onFilterPress}
                onSearchChange={onSearchChange}
            />
        </>
    );
}
