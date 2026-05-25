INSERT INTO spells (
  id, name, level, school_of_magic, casting_time,
  "range", duration, components,
  ritual, concentration, saving_throw,
  rolls, damage_type, tag, description,
  created_at, updated_at
) VALUES

-- Bless
(
  '1aef862d-c329-473d-ac68-ea20368b8846',
  'Bless',
  1,
  'Enchantment',
  '1 action',
  '30 feet',
  'Concentration, up to 1 minute',
  ARRAY['V','S','M'],
  false,
  true,
  false,
  '1d4',
    'N/A',
  'Buff',
  'You bless up to three creatures of your choice.',
  NOW(),
  NOW()
),

-- Command
(
  '0cd6391b-ee24-4802-897f-ea4156bfb010',
  'Command',
  1,
  'Enchantment',
  '1 action',
  '60 feet',
  '1 round',
  ARRAY['V'],
  false,
  false,
  true,
  'N/A',
  'N/A',
  'Control',
  'You speak a one-word command to a creature.',
  NOW(),
  NOW()
),

-- Cure Wounds
(
  '3b74afc8-d3ea-45bd-b48a-3b6d27e627ce',
  'Cure Wounds',
  1,
  'Evocation',
  '1 action',
  'Touch',
  'Instantaneous',
  ARRAY['V','S'],
  false,
  false,
  false,
  '1d8',
  'Healing',
  'Healing',
  'A creature you touch regains hit points.',
  NOW(),
  NOW()
),

-- Shield of Faith
(
  'ec651dfa-2a85-4b45-afd7-8c26d1184dc1',
  'Shield of Faith',
  1,
  'Abjuration',
  '1 bonus action',
  '60 feet',
  'Concentration, up to 10 minutes',
  ARRAY['V','S','M'],
  false,
  true,
  false,
  'N/A',
  'N/A',
  'Defense',
  'A shimmering field appears and surrounds a creature.',
  NOW(),
  NOW()
),

-- Lesser Restoration
(
  '1483709d-db91-4fd0-9c24-117dde3e1090',
  'Lesser Restoration',
  2,
  'Abjuration',
  '1 action',
  'Touch',
  'Instantaneous',
  ARRAY['V','S'],
  false,
  false,
  false,
  'N/A',
  'N/A',
  'Healing',
  'You touch a creature and end one disease or condition.',
  NOW(),
  NOW()
),

-- Magic Weapon
(
  'c912752e-d722-4b2a-8115-bfce01864bd5',
  'Magic Weapon',
  2,
  'Transmutation',
  '1 bonus action',
  'Touch',
  'Concentration, up to 1 hour',
  ARRAY['V','S'],
  false,
  true,
  false,
  'N/A',
  'N/A',
  'Buff',
  'You touch a nonmagical weapon and imbue it with magic.',
  NOW(),
  NOW()
),

-- Find Steed
(
  '63b18f26-d7ac-4a79-83f7-8d9ee3b4137d',
  'Find Steed',
  2,
  'Conjuration',
  '10 minutes',
  '30 feet',
  'Instantaneous',
  ARRAY['V','S'],
  false,
  false,
  false,
  'N/A',
  'N/A',
  'Summon',
  'You summon a spirit that assumes the form of a steed.',
  NOW(),
  NOW()
),

-- Aura of Vitality
(
  '4e1ecf2b-d173-4c1d-9343-dac58f3324f4',
  'Aura of Vitality',
  3,
  'Evocation',
  '1 action',
  'Self',
  'Concentration, up to 1 minute',
  ARRAY['V'],
  false,
  true,
  false,
  '2d6',
  'Healing',
  'Healing',
  'Healing energy radiates from you in an aura.',
  NOW(),
  NOW()
),

-- Crusader's Mantle
(
  '453d5e9a-4320-4af6-b682-63a5a7220198',
  'Crusader''s Mantle',
  3,
  'Evocation',
  '1 action',
  'Self',
  'Concentration, up to 1 minute',
  ARRAY['V'],
  false,
  true,
  false,
  '1d4',
  'Radiant',
  'Aura',
  'Holy power radiates from you in an aura.',
  NOW(),
  NOW()
),

-- Revivify
(
  'f3f01a9a-aa6e-4f03-9b7f-7dea33383607',
  'Revivify',
  3,
  'Necromancy',
  '1 action',
  'Touch',
  'Instantaneous',
  ARRAY['V','S','M'],
  false,
  false,
  false,
  'N/A',
  'N/A',
  'Revival',
  'You touch a creature that has died within the last minute.',
  NOW(),
  NOW()
);