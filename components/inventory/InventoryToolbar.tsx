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

type InventoryToolbarProps = {
    search: string;
    onSearchChange: (value: string) => void;
    onFilterPress?: () => void;
    onCreateItem: (item: {
        name: string;
        description?: string;
        rarity?: Database["public"]["Enums"]["item_rarity"];
        tag?: Database["public"]["Enums"]["item_tag"];
        quantity?: number;
        requires_attunement?: boolean;
    }) => void;
};

const rarityOptions: Array<{
    value: Database["public"]["Enums"]["item_rarity"];
    label: string;
}> = Constants.public.Enums.item_rarity.map((value) => ({
    value,
    label: value,
}));

const tagOptions: Array<{
    value: Database["public"]["Enums"]["item_tag"];
    label: string;
}> = Constants.public.Enums.item_tag.map((value) => ({
    value,
    label: value,
}));

export const itemFormFields: FormField[] = [
    {
        name: "name",
        label: "Item name",
        placeholder: "Enter item name",
        type: "text",
    },
    {
        name: "description",
        label: "Description",
        placeholder: "Enter item description",
        type: "textarea",
        multiline: true,
        optional: true,
    },
    {
        name: "rarity",
        label: "Rarity",
        type: "select",
        options: rarityOptions,
        initialValue: "None",
    },
    {
        name: "tag",
        label: "Tag",
        type: "select",
        options: tagOptions,
        optional: true,
        initialValue: "Other",
    },
    {
        name: "quantity",
        label: "Quantity",
        placeholder: "1",
        type: "numeric",
        initialValue: 1,
        min: 1,
    },
    {
        name: "requires_attunement",
        label: "Requires attunement",
        type: "checkbox",
        optional: true,
        initialValue: false,
    },
];

export function InventoryToolbar({
    search,
    onSearchChange,
    onFilterPress,
    onCreateItem,
}: InventoryToolbarProps) {
    const { openForm, modals } = useFieldEditorModals();

    return (
        <>
            {modals}
            <Toolbar
                search={search}
                onSearchChange={onSearchChange}
                onFilterPress={onFilterPress}
                onAddPress={() =>
                    openForm({
                        title: "Create inventory item",
                        submitLabel: "Create item",
                        fields: itemFormFields,
                        onSubmit: (values) =>
                            onCreateItem({
                                name: String(values.name ?? ""),
                                description: String(values.description ?? ""),
                                rarity: String(
                                    values.rarity ?? "None",
                                ) as Database["public"]["Enums"]["item_rarity"],
                                tag: String(
                                    values.tag ?? "Other",
                                ) as Database["public"]["Enums"]["item_tag"],
                                quantity:
                                    typeof values.quantity === "number"
                                        ? values.quantity
                                        : parseInt(
                                              String(values.quantity ?? "1"),
                                              10,
                                          ),
                                requires_attunement: Boolean(
                                    values.requires_attunement,
                                ),
                            }),
                    })
                }
            />
        </>
    );
}
