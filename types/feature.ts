export type OriginType = "class" | "subclass" | "race" | "background" | "feat" | "other";
export type Feature = {
    name: string;
    origin_type: OriginType;
    shortDescription: string;
    description: string;
};
export function originTypeToDisplayName(origin_type: OriginType): string {
    switch (origin_type) {
        case "class":
            return "Class Feature";
        case "subclass":
            return "Subclass Feature";
        case "race":
            return "Racial Trait";
        case "background":
            return "Background Feature";
        case "feat":
            return "Feat";
        case "other":
            return "Other";
    }
}
