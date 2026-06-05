import { useUpdateCharacter } from "@/hooks/data/useUpdateCharacter";
import { useUpdateCharacterItem } from "@/hooks/data/useCharacterItems";

export function useCharacterEditor(characterId: string) {
    const updateCharacter = useUpdateCharacter(characterId);
    const updateCharacterItem = useUpdateCharacterItem(characterId);

    return {
        updateCharacter,
        updateCharacterItem,
    };
}
