// TODO: consider changing the names and places in folders
export type BulletState = "active" | "inactive";

export interface ListEntry {
    label: string;
    value: string;
    state: BulletState;
    editId?: string;
}

export interface ListItem {
    label: string;
    value: string;
    highlight?: boolean;
    editId?: string;
}