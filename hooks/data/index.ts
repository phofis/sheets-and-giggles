export {
    currentUserQueryKey,
    fetchCurrentUser,
    useCurrentUser,
} from "./useCurrentUser";
export {
    characterQueryKey,
    useUpdateCharacter,
    type CharacterPatch,
} from "./useUpdateCharacter";

// Character queries
export { useCharacter } from "./useCharacter";
export {
    useCharacterFeatures,
    useAssignFeature,
    useUnassignFeature,
} from "./useCharacterFeatures";
export {
    useCharacterItems,
    useCreateCharacterItem,
    useUpdateCharacterItem,
    useDeleteCharacterItem,
} from "./useCharacterItems";
export {
    useCharacterSpells,
    useLearnSpell,
    useUpdateCharacterSpell,
    useForgetSpell,
} from "./useCharacterSpells";
export {
    useCharacterSpellSlots,
    useUpsertSpellSlot,
    useSpendSpellSlots,
    useResetSpellSlots,
} from "./useCharacterSpellSlots";

export {
    useCharacterCombatActions,
    useAddCombatAction,
    useRemoveCombatAction,
    type CharacterCombatActionRow,
    type CombatActionSourceType,
} from "./useCharacterCombatActions";

// Catalogs
export {
    useRaces,
    useClasses,
    useSpellsCatalog,
    useFeaturesCatalog,
} from "./useCatalog";

// Item transfers (QR sharing)
export {
    useCreateItemTransfer,
    useClaimItemTransfer,
    type ItemTransferRow,
    type ItemTransferSnapshot,
} from "./useItemTransfers";

// Factory (for custom one-off hooks)
export {
    useCharacterQuery,
    useCharacterMutation,
    useCatalogQuery,
} from "./factory";
