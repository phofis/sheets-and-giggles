import React from "react";
import { Text } from "react-native";
import { SelectionOption } from "@/components/character-creation/SelectionGrid";

const MATERIAL_ICON_STYLE = {
    textAlign: "center",
    fontFamily: "Material Icons",
    fontSize: 30,
    fontStyle: "normal",
    fontWeight: "400",
} as const;

// ─── Races ───────────────────────────────────────────────────────────────────

export const getRaceOptions = (): SelectionOption[] => [
    {
        id: "person",
        label: "Human",
        description: "Versatile and ambitious, found in all corners of the world.",
        icon: (color) => (
            <Text style={[{ color: color || "#958EA0" }, MATERIAL_ICON_STYLE]}>person</Text>
        ),
    },
    {
        id: "nature",
        label: "Elf",
        description: "Graceful and long-lived, deeply connected to the natural world.",
        icon: (color) => (
            <Text style={[{ color: color || "#958EA0" }, MATERIAL_ICON_STYLE]}>nature</Text>
        ),
    },
    {
        id: "hardware",
        label: "Dwarf",
        description: "Stout, resilient, and master crafters of stone and metal.",
        icon: (color) => (
            <Text style={[{ color: color || "#958EA0" }, MATERIAL_ICON_STYLE]}>hardware</Text>
        ),
    },
    {
        id: "pets",
        label: "Halfling",
        description: "Small in stature but large in spirit, luck, and bravery.",
        icon: (color) => (
            <Text style={[{ color: color || "#958EA0" }, MATERIAL_ICON_STYLE]}>pets</Text>
        ),
    },
    {
        id: "half_elf",
        label: "Half-Elf",
        description: "Caught between two worlds, blending human ambition with elven grace.",
        icon: (color) => (
            <Text style={[{ color: color || "#958EA0" }, MATERIAL_ICON_STYLE]}>diversity_3</Text>
        ),
    },
    {
        id: "goliath",
        label: "Goliath",
        description: "Towering mountain-dwellers with unmatched physical strength.",
        icon: (color) => (
            <Text style={[{ color: color || "#958EA0" }, MATERIAL_ICON_STYLE]}>landscape</Text>
        ),
    },
    {
        id: "dragonborn",
        label: "Dragonborn",
        description: "Proud draconic humanoids bound by strict codes of honor.",
        icon: (color) => (
            <Text style={[{ color: color || "#958EA0" }, MATERIAL_ICON_STYLE]}>whatshot</Text>
        ),
    },
    {
        id: "orc",
        label: "Orc",
        description: "Fierce and powerful warriors driven by primal instincts.",
        icon: (color) => (
            <Text style={[{ color: color || "#958EA0" }, MATERIAL_ICON_STYLE]}>pan_tool</Text>
        ),
    },
    {
        id: "half_orc",
        label: "Half-Orc",
        description: "Formidable fighters who channel their raw fury in battle.",
        icon: (color) => (
            <Text style={[{ color: color || "#958EA0" }, MATERIAL_ICON_STYLE]}>sentiment_very_dissatisfied</Text>
        ),
    },
    {
        id: "tiefling",
        label: "Tiefling",
        description: "Cursed with a fiendish heritage but masters of their own destiny.",
        icon: (color) => (
            <Text style={[{ color: color || "#958EA0" }, MATERIAL_ICON_STYLE]}>psychology</Text>
        ),
    },
];

// ─── Custom Option Generator ─────────────────────────────────────────────────

export const getCustomOption = (id: string, label: string, description: string): SelectionOption => {
    return {
        id: id,
        label: label,
        description: description,
        icon: (color) => (
            <Text style={[{ color: color || "#958EA0" }, MATERIAL_ICON_STYLE]}>
                help_outline
            </Text>
        ),
    }
}

// ─── Classes ─────────────────────────────────────────────────────────────────

export const getClassOptions = (): SelectionOption[] => [
    {
        id: "b0000000-0000-0000-0000-000000000001",
        label: "Fighter",
        description: "A master of martial combat, skilled with a variety of weapons and armor.",
        icon: (color) => (
            <Text style={[{ color: color || "#958EA0" }, MATERIAL_ICON_STYLE]}>security</Text>
        ),
    },
    {
        id: "rogue",
        label: "Rogue",
        description: "A stealthy scoundrel who uses agility and trickery to overcome obstacles.",
        icon: (color) => (
            <Text style={[{ color: color || "#958EA0" }, MATERIAL_ICON_STYLE]}>visibility</Text>
        ),
    },
    {
        id: "b0000000-0000-0000-0000-000000000002",
        label: "Wizard",
        description: "A scholarly magic-user capable of shaping reality through arcane study.",
        icon: (color) => (
            <Text style={[{ color: color || "#958EA0" }, MATERIAL_ICON_STYLE]}>auto_awesome</Text>
        ),
    },
    {
        id: "cleric",
        label: "Cleric",
        description: "A divine champion who wields holy magic in service of a higher power.",
        icon: (color) => (
            <Text style={[{ color: color || "#958EA0" }, MATERIAL_ICON_STYLE]}>favorite</Text>
        ),
    },
];

export const getAlignmentOptions = () => [
    { id: "lawful_good", label: "Lawful Good" },
    { id: "neutral_good", label: "Neutral Good" },
    { id: "chaotic_good", label: "Chaotic Good" },
    { id: "lawful_neutral", label: "Lawful Neutral" },
    { id: "true_neutral", label: "True Neutral" },
    { id: "chaotic_neutral", label: "Chaotic Neutral" },
    { id: "lawful_evil", label: "Lawful Evil" },
    { id: "neutral_evil", label: "Neutral Evil" },
    { id: "chaotic_evil", label: "Chaotic Evil" },
] as const;

export const DEFAULT_ALIGNMENT = getAlignmentOptions()[0].id;