INSERT INTO character_items (
    id,
    character_id,
    name,
    description,
    requires_attunement,
    attuned,
    created_at,
    updated_at
) VALUES
(
    gen_random_uuid(),
    'a1b2c3d4-e5f6-4789-a012-3456789abcde',
    'Amulet of Health',
    'Your Constitution score is 19 while you wear this amulet. It has no effect on you if your Constitution is already 19 or higher.',
    TRUE,
    TRUE,
    now(),
    now()
),
(
    gen_random_uuid(),
    'a1b2c3d4-e5f6-4789-a012-3456789abcde',
    'Ring of Protection',
    'You gain a +1 bonus to AC and saving throws while wearing this ring.',
    TRUE,
    FALSE,
    now(),
    now()
),
(
    gen_random_uuid(),
    'a1b2c3d4-e5f6-4789-a012-3456789abcde',
    'Bag of Holding',
    'This bag has an interior space considerably larger than its outside dimensions. It can hold up to 500 pounds, not exceeding a volume of 64 cubic feet.',
    FALSE,
    FALSE,
    now(),
    now()
),
(
    gen_random_uuid(),
    'a1b2c3d4-e5f6-4789-a012-3456789abcde',
    'Cloak of Protection',
    'You gain a +1 bonus to AC and saving throws while wearing this cloak.',
    TRUE,
    FALSE,
    now(),
    now()
),
(
    gen_random_uuid(),
    'a1b2c3d4-e5f6-4789-a012-3456789abcde',
    'Potion of Healing',
    'You regain 2d4 + 2 hit points when you drink this potion.',
    FALSE,
    FALSE,
    now(),
    now()
);