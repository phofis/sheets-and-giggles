-- `characters` — one row per character.
--
-- All strictly one-to-one character-sheet fields (ability scores, HP, money,
-- biometrics, narrative arrays) live here. Derived values like ability mods,
-- saving throws, and skill totals stay app-side so this table only stores
-- the inputs. The composite FK to `subclasses` is checked under PostgreSQL's
-- MATCH SIMPLE default, so a NULL `subclass_id` (character without a chosen
-- subclass) doesn't trigger the constraint.

CREATE TYPE public.ability_score AS ENUM ('STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA');

CREATE TYPE public.skill_name AS ENUM (
  'Acrobatics',
  'Animal Handling',
  'Arcana',
  'Athletics',
  'Deception',
  'History',
  'Insight',
  'Intimidation',
  'Investigation',
  'Medicine',
  'Nature',
  'Perception',
  'Performance',
  'Persuasion',
  'Religion',
  'Sleight of Hand',
  'Stealth',
  'Survival'
);

CREATE TYPE public.alignment AS ENUM (
  'lawful_good',
  'neutral_good',
  'chaotic_good',
  'lawful_neutral',
  'true_neutral',
  'chaotic_neutral',
  'lawful_evil',
  'neutral_evil',
  'chaotic_evil'
);

CREATE TABLE public.characters (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  race_id            UUID NOT NULL REFERENCES public.races(id),
  class_id           UUID NOT NULL REFERENCES public.classes(id),
  subclass_id        UUID,
  name               TEXT NOT NULL,
  photo_uri          TEXT,
  str_score          SMALLINT NOT NULL CHECK (str_score BETWEEN 1 AND 30),
  dex_score          SMALLINT NOT NULL CHECK (dex_score BETWEEN 1 AND 30),
  con_score          SMALLINT NOT NULL CHECK (con_score BETWEEN 1 AND 30),
  int_score          SMALLINT NOT NULL CHECK (int_score BETWEEN 1 AND 30),
  wis_score          SMALLINT NOT NULL CHECK (wis_score BETWEEN 1 AND 30),
  cha_score          SMALLINT NOT NULL CHECK (cha_score BETWEEN 1 AND 30),
  proficient_saves   public.ability_score[] NOT NULL DEFAULT '{}',
  proficient_skills  public.skill_name[] NOT NULL DEFAULT '{}',
  hp_current         INTEGER NOT NULL CHECK (hp_current >= 0),
  hp_max             INTEGER NOT NULL CHECK (hp_max >= 0),
  hp_temp            INTEGER NOT NULL DEFAULT 0 CHECK (hp_temp >= 0),
  proficiency_bonus  SMALLINT NOT NULL CHECK (proficiency_bonus >= 0),
  armor_class        SMALLINT NOT NULL CHECK (armor_class >= 0),
  inspiration        SMALLINT NOT NULL DEFAULT 0 CHECK (inspiration >= 0),
  initiative         SMALLINT NOT NULL,
  speed              SMALLINT NOT NULL CHECK (speed >= 0),
  level              SMALLINT NOT NULL CHECK (level BETWEEN 1 AND 20),
  experience         INTEGER NOT NULL DEFAULT 0 CHECK (experience >= 0),
  alignment          public.alignment NOT NULL,
  gender             TEXT NOT NULL,
  eyes               TEXT NOT NULL,
  size               TEXT NOT NULL,
  height             TEXT NOT NULL,
  age                INTEGER NOT NULL CHECK (age >= 0),
  faith              TEXT NOT NULL,
  skin               TEXT NOT NULL,
  background         TEXT NOT NULL,
  personality_traits TEXT[] NOT NULL DEFAULT '{}',
  bonds              TEXT[] NOT NULL DEFAULT '{}',
  ideals             TEXT[] NOT NULL DEFAULT '{}',
  flaws              TEXT[] NOT NULL DEFAULT '{}',
  gold               INTEGER NOT NULL DEFAULT 0 CHECK (gold >= 0),
  silver             INTEGER NOT NULL DEFAULT 0 CHECK (silver >= 0),
  copper             INTEGER NOT NULL DEFAULT 0 CHECK (copper >= 0),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  FOREIGN KEY (class_id, subclass_id) REFERENCES public.subclasses(class_id, subclass_id)
);

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.characters
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE INDEX characters_user_id_idx     ON public.characters (user_id);
CREATE INDEX characters_race_id_idx     ON public.characters (race_id);
CREATE INDEX characters_class_id_idx    ON public.characters (class_id);
CREATE INDEX characters_subclass_id_idx ON public.characters (subclass_id);

ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;

CREATE POLICY characters_select_own ON public.characters
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- The race/class checks ensure a character can only point at rows the user is
-- actually allowed to use: an official catalog row, or a custom row they have
-- added to their account through user_races / user_classes.
CREATE POLICY characters_insert_own ON public.characters
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = (SELECT auth.uid())
    AND (
      EXISTS (
        SELECT 1 FROM public.races
        WHERE races.id = race_id
          AND races.is_official = true
      )
      OR EXISTS (
        SELECT 1 FROM public.user_races
        WHERE user_races.user_id = (SELECT auth.uid())
          AND user_races.race_id = race_id
      )
    )
    AND (
      EXISTS (
        SELECT 1 FROM public.classes
        WHERE classes.id = class_id
          AND classes.is_official = true
      )
      OR EXISTS (
        SELECT 1 FROM public.user_classes
        WHERE user_classes.user_id = (SELECT auth.uid())
          AND user_classes.class_id = class_id
      )
    )
  );

CREATE POLICY characters_update_own ON public.characters
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY characters_delete_own ON public.characters
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));
