import { createContext, useContext, useState, type ReactNode } from "react";

interface CharacterIdContextValue {
    characterId: string | undefined;
    setCharacterId: (id: string) => void;
}

const CharacterIdContext = createContext<CharacterIdContextValue>({
    characterId: undefined,
    setCharacterId: () => {},
});

export function CharacterIdProvider({ children }: { children: ReactNode }) {
    const [characterId, setCharacterId] = useState<string | undefined>(undefined);

    return (
        <CharacterIdContext.Provider value={{ characterId, setCharacterId }}>
            {children}
        </CharacterIdContext.Provider>
    );
}

export function useCharacterId(): string {
    const { characterId } = useContext(CharacterIdContext);
    if (!characterId) {
        throw new Error("useCharacterId: no characterId set. Navigate from adventurer selection first.");
    }
    return characterId;
}

export function useSetCharacterId() {
    const { setCharacterId } = useContext(CharacterIdContext);
    return setCharacterId;
}
