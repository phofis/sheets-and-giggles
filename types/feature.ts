export type OriginType = "class" | "subclass" | "race" | "background" | "feat" | "other";
export type Feature = {
    name: string;
    origin_type: OriginType;
    shortDescription: string;
    description: string;
};

