-- Example official races and classes for test/local seeding.
-- Stable UUIDs: races b1000001-0001-4001-8001-00000000000X, classes c2000002-0002-4002-8002-00000000000X
-- Apply via Supabase MCP execute_sql on test (project_ref nsbvjwtvfblanjwwuytw).

INSERT INTO public.races (
  id,
  name,
  short_description,
  is_official,
  created_by_user_id,
  created_at,
  updated_at
)
VALUES
  (
    'b1000001-0001-4001-8001-000000000001',
    'Dragonborn',
    'Proud draconic humanoids with breath weapons and damage resistance.',
    true,
    NULL,
    '2026-05-25T12:00:00+00'::timestamptz,
    '2026-05-25T12:00:00+00'::timestamptz
  ),
  (
    'b1000001-0001-4001-8001-000000000002',
    'Dwarf',
    'Stout, resilient folk known for craftsmanship and mountain strongholds.',
    true,
    NULL,
    '2026-05-25T12:00:00+00'::timestamptz,
    '2026-05-25T12:00:00+00'::timestamptz
  ),
  (
    'b1000001-0001-4001-8001-000000000003',
    'Elf',
    'Graceful, long-lived people with keen senses and affinity for magic.',
    true,
    NULL,
    '2026-05-25T12:00:00+00'::timestamptz,
    '2026-05-25T12:00:00+00'::timestamptz
  ),
  (
    'b1000001-0001-4001-8001-000000000004',
    'Gnome',
    'Curious small folk with sharp minds and a knack for illusion and invention.',
    true,
    NULL,
    '2026-05-25T12:00:00+00'::timestamptz,
    '2026-05-25T12:00:00+00'::timestamptz
  ),
  (
    'b1000001-0001-4001-8001-000000000005',
    'Goliath',
    'Towering mountain-dwellers who compete to prove their strength and honor.',
    true,
    NULL,
    '2026-05-25T12:00:00+00'::timestamptz,
    '2026-05-25T12:00:00+00'::timestamptz
  ),
  (
    'b1000001-0001-4001-8001-000000000006',
    'Halfling',
    'Cheerful, nimble folk who favor comfort, community, and good fortune.',
    true,
    NULL,
    '2026-05-25T12:00:00+00'::timestamptz,
    '2026-05-25T12:00:00+00'::timestamptz
  ),
  (
    'b1000001-0001-4001-8001-000000000007',
    'Human',
    'Versatile and ambitious, the most widespread people in the multiverse.',
    true,
    NULL,
    '2026-05-25T12:00:00+00'::timestamptz,
    '2026-05-25T12:00:00+00'::timestamptz
  ),
  (
    'b1000001-0001-4001-8001-000000000008',
    'Orc',
    'Fierce, enduring warriors shaped by harsh lands and tribal tradition.',
    true,
    NULL,
    '2026-05-25T12:00:00+00'::timestamptz,
    '2026-05-25T12:00:00+00'::timestamptz
  ),
  (
    'b1000001-0001-4001-8001-000000000009',
    'Tiefling',
    'Mortals touched by infernal legacy, often mistrusted yet fiercely independent.',
    true,
    NULL,
    '2026-05-25T12:00:00+00'::timestamptz,
    '2026-05-25T12:00:00+00'::timestamptz
  ),
  (
    'b1000001-0001-4001-8001-00000000000a',
    'Half-Elf',
    'Charismatic blend of human adaptability and elven grace.',
    true,
    NULL,
    '2026-05-25T12:00:00+00'::timestamptz,
    '2026-05-25T12:00:00+00'::timestamptz
  ),
  (
    'b1000001-0001-4001-8001-00000000000b',
    'Half-Orc',
    'Formidable heirs of orc strength and human determination.',
    true,
    NULL,
    '2026-05-25T12:00:00+00'::timestamptz,
    '2026-05-25T12:00:00+00'::timestamptz
  );

INSERT INTO public.classes (
  id,
  name,
  short_description,
  subclass_level,
  is_official,
  created_by_user_id,
  created_at,
  updated_at
)
VALUES
  (
    'c2000002-0002-4002-8002-000000000001',
    'Barbarian',
    'Primal warrior who enters a rage to shrug off pain and strike harder.',
    3,
    true,
    NULL,
    '2026-05-25T12:00:00+00'::timestamptz,
    '2026-05-25T12:00:00+00'::timestamptz
  ),
  (
    'c2000002-0002-4002-8002-000000000002',
    'Bard',
    'Inspiring performer whose magic flows through music, wit, and lore.',
    3,
    true,
    NULL,
    '2026-05-25T12:00:00+00'::timestamptz,
    '2026-05-25T12:00:00+00'::timestamptz
  ),
  (
    'c2000002-0002-4002-8002-000000000003',
    'Cleric',
    'Divine champion who channels a deity''s power to heal, protect, and smite.',
    3,
    true,
    NULL,
    '2026-05-25T12:00:00+00'::timestamptz,
    '2026-05-25T12:00:00+00'::timestamptz
  ),
  (
    'c2000002-0002-4002-8002-000000000004',
    'Druid',
    'Guardian of nature who shapeshifts and wields primal elemental magic.',
    3,
    true,
    NULL,
    '2026-05-25T12:00:00+00'::timestamptz,
    '2026-05-25T12:00:00+00'::timestamptz
  ),
  (
    'c2000002-0002-4002-8002-000000000005',
    'Fighter',
    'Master of weapons and armor who excels through training and tactics.',
    3,
    true,
    NULL,
    '2026-05-25T12:00:00+00'::timestamptz,
    '2026-05-25T12:00:00+00'::timestamptz
  ),
  (
    'c2000002-0002-4002-8002-000000000006',
    'Monk',
    'Martial artist who harnesses ki for speed, defense, and stunning strikes.',
    3,
    true,
    NULL,
    '2026-05-25T12:00:00+00'::timestamptz,
    '2026-05-25T12:00:00+00'::timestamptz
  ),
  (
    'c2000002-0002-4002-8002-000000000007',
    'Paladin',
    'Holy knight bound by an oath, blending martial prowess and divine magic.',
    3,
    true,
    NULL,
    '2026-05-25T12:00:00+00'::timestamptz,
    '2026-05-25T12:00:00+00'::timestamptz
  ),
  (
    'c2000002-0002-4002-8002-000000000008',
    'Ranger',
    'Skilled hunter who thrives in the wild and tracks foes with deadly focus.',
    3,
    true,
    NULL,
    '2026-05-25T12:00:00+00'::timestamptz,
    '2026-05-25T12:00:00+00'::timestamptz
  ),
  (
    'c2000002-0002-4002-8002-000000000009',
    'Rogue',
    'Cunning expert in stealth, traps, and precise strikes from the shadows.',
    3,
    true,
    NULL,
    '2026-05-25T12:00:00+00'::timestamptz,
    '2026-05-25T12:00:00+00'::timestamptz
  ),
  (
    'c2000002-0002-4002-8002-00000000000a',
    'Sorcerer',
    'Arcane caster whose magic arises from innate bloodline or wild surge.',
    3,
    true,
    NULL,
    '2026-05-25T12:00:00+00'::timestamptz,
    '2026-05-25T12:00:00+00'::timestamptz
  ),
  (
    'c2000002-0002-4002-8002-00000000000b',
    'Warlock',
    'Pact-bound spellcaster who draws power from an otherworldly patron.',
    3,
    true,
    NULL,
    '2026-05-25T12:00:00+00'::timestamptz,
    '2026-05-25T12:00:00+00'::timestamptz
  ),
  (
    'c2000002-0002-4002-8002-00000000000c',
    'Wizard',
    'Scholar of the arcane who prepares spells from a meticulously kept spellbook.',
    3,
    true,
    NULL,
    '2026-05-25T12:00:00+00'::timestamptz,
    '2026-05-25T12:00:00+00'::timestamptz
  );
