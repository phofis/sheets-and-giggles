import { Toolbar } from "@/components/Toolbar";
import { useFieldEditorModals } from "@/hooks/editing/useFieldEditorModals";
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

type SpellToolbarProps = {
    search: string;
    onSearchChange: (value: string) => void;
    onFilterPress?: () => void;
    onLearnSpell: (spell: {
        spell_id: string;
        prepared?: boolean;
        always_prepared?: boolean;
    }) => void;
    hideAdd?: boolean;
    searchPlaceholder?: string;
    onAddPressOverride?: () => void;
};


export const spellFormFields: FormField[] = [
    {
        name: "spell_id",
        label: "Spell ID",
        placeholder: "Enter spell ID",
        type: "text",
    },
    {
        name: "prepared",
        label: "Prepared",
        type: "checkbox",
        optional: true,
        initialValue: false,
    },
    {
        name: "always_prepared",
        label: "Always prepared",
        type: "checkbox",
        optional: true,
        initialValue: false,
    },
];

export function SpellToolbar({
    search,
    onSearchChange,
    onFilterPress,
    onLearnSpell,
    hideAdd = false,
    searchPlaceholder = "Search spells...",
    onAddPressOverride,
}: SpellToolbarProps) {
    const { openForm, modals } = useFieldEditorModals();

    const handleAddPress =
        onAddPressOverride ??
        (() =>
            openForm({
                title: "Learn spell",
                submitLabel: "Learn spell",
                fields: spellFormFields,
                onSubmit: (values) => {
                    onLearnSpell({
                        spell_id: String(values.spell_id ?? ""),
                        prepared: Boolean(values.prepared),
                        always_prepared: Boolean(values.always_prepared),
                    });
                },
            }));

    return (
        <>
            {modals}
            <Toolbar
                search={search}
                searchPlaceholder={searchPlaceholder}
                onSearchChange={onSearchChange}
                onFilterPress={onFilterPress}
                onAddPress={hideAdd ? undefined : handleAddPress}
            />
        </>
    );
}