import { createContext, useContext } from "react";

const CharacterIdContext = createContext<string | undefined>(undefined);

export const CharacterIdProvider = CharacterIdContext.Provider;

export function useCharacterId(): string {
    const id = useContext(CharacterIdContext);
    if (!id) {
        throw new Error("useCharacterId must be used within a CharacterIdProvider (inside tabs)");
    }
    return id;
}
