import { createContext, useContext } from "react";

const CharacterIdContext = createContext<string | undefined>(undefined);

export const CharacterIdProvider = CharacterIdContext.Provider;

export function useCharacterId(): string {
    const id = "a1b2c3d4-e5f6-4789-a012-3456789abcde" //useContext(CharacterIdContext);
    if (!id) {
        throw new Error("useCharacterId must be used within a CharacterIdProvider (inside tabs)");
    }
    return id;
}
