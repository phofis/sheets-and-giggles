import React from "react";
import { View } from "react-native";
import { SectionHeader } from "./SectionHeader";
import { SelectableItemCard, SelectableItem } from "./SelectableItemCard";

interface SelectionListProps {
    title: string;
    items: SelectableItem[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    isRequired?: boolean;
}

export function SelectionList({ title, items, selectedId, onSelect, isRequired = false }: SelectionListProps) {
    return (
        <View>
            <SectionHeader
                badgeText={isRequired ? "Required" : undefined}
                badgeType={isRequired ? "error" : "default"}
                title={title}
            />
            <View>
                {items.map((item) => (
                    <SelectableItemCard
                        isSelected={selectedId === item.id}
                        item={item}
                        key={item.id}
                        onPress={() => onSelect(item.id)}
                    />
                ))}
            </View>
        </View>
    );
}