import { useCallback, useState } from "react";
import TextChangeModal from "@/components/TextChangeModal";
import NumericChangeModal from "@/components/editing/NumericChangeModal";
import EntityFormModal, {
    type EntityFormField,
} from "@/components/editing/EntityFormModal";

type TextEditorConfig = {
    kind: "text";
    label: string;
    placeholder?: string;
    initialValue: string;
    onSubmit: (value: string) => void;
};

type NumericEditorConfig = {
    kind: "numeric";
    label: string;
    placeholder?: string;
    initialValue: number;
    min?: number;
    max?: number;
    onSubmit: (value: number) => void;
};

type FormEditorConfig = {
    kind: "form";
    title: string;
    fields: EntityFormField[];
    submitLabel?: string;
    onSubmit: (values: Record<string, string | number>) => void;
};

type EditorConfig = TextEditorConfig | NumericEditorConfig | FormEditorConfig;

export function useFieldEditorModals() {
    const [editor, setEditor] = useState<EditorConfig | null>(null);

    const close = useCallback(() => setEditor(null), []);

    const openText = useCallback((config: Omit<TextEditorConfig, "kind">) => {
        setEditor({ kind: "text", ...config });
    }, []);

    const openNumeric = useCallback(
        (config: Omit<NumericEditorConfig, "kind">) => {
            setEditor({ kind: "numeric", ...config });
        },
        [],
    );

    const openForm = useCallback((config: Omit<FormEditorConfig, "kind">) => {
        setEditor({ kind: "form", ...config });
    }, []);

    const modals = (
        <>
            <TextChangeModal
                initialValue={
                    editor?.kind === "text" ? editor.initialValue : ""
                }
                isOpen={editor?.kind === "text"}
                label={editor?.kind === "text" ? editor.label : ""}
                placeholder={
                    editor?.kind === "text" ? editor.placeholder : undefined
                }
                setIsOpen={(open) => {
                    if (!open) close();
                }}
                onSubmit={(value) => {
                    if (editor?.kind === "text") {
                        editor.onSubmit(value);
                        close();
                    }
                }}
            />
            <NumericChangeModal
                initialValue={
                    editor?.kind === "numeric" ? editor.initialValue : 0
                }
                isOpen={editor?.kind === "numeric"}
                label={editor?.kind === "numeric" ? editor.label : ""}
                max={editor?.kind === "numeric" ? editor.max : undefined}
                min={editor?.kind === "numeric" ? editor.min : undefined}
                placeholder={
                    editor?.kind === "numeric" ? editor.placeholder : undefined
                }
                setIsOpen={(open) => {
                    if (!open) close();
                }}
                onSubmit={(value) => {
                    if (editor?.kind === "numeric") {
                        editor.onSubmit(value);
                        close();
                    }
                }}
            />
            <EntityFormModal
                isOpen={editor?.kind === "form"}
                setIsOpen={(open) => {
                    if (!open) close();
                }}
                title={editor?.kind === "form" ? editor.title : ""}
                fields={editor?.kind === "form" ? editor.fields : []}
                submitLabel={
                    editor?.kind === "form" ? editor.submitLabel : "Save"
                }
                onSubmit={(values) => {
                    if (editor?.kind === "form") {
                        editor.onSubmit(values);
                        close();
                    }
                }}
            />
        </>
    );

    return { openText, openNumeric, openForm, close, modals };
}
