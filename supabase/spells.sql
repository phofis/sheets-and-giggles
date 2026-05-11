-- `spells` — shared spell catalog, readable by any authenticated user. One
-- row per spell. Writes are out-of-band (seed scripts / admin tooling); no
-- INSERT/UPDATE/DELETE policies are exposed.

CREATE TABLE public.spells (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL UNIQUE,
  level           SMALLINT NOT NULL CHECK (level BETWEEN 0 AND 9),
  school_of_magic TEXT NOT NULL,
  casting_time    TEXT NOT NULL,
  range           TEXT NOT NULL,
  duration        TEXT NOT NULL,
  components      TEXT[] NOT NULL DEFAULT '{}',
  ritual          BOOLEAN NOT NULL DEFAULT false,
  concentration   BOOLEAN NOT NULL DEFAULT false,
  saving_throw    BOOLEAN NOT NULL DEFAULT false,
  rolls           TEXT NOT NULL DEFAULT 'NA',
  damage_type     TEXT NOT NULL DEFAULT 'NA',
  tag             TEXT NOT NULL DEFAULT '',
  description     TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.spells
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE INDEX spells_level_idx ON public.spells (level);

ALTER TABLE public.spells ENABLE ROW LEVEL SECURITY;

CREATE POLICY spells_select_authenticated ON public.spells
  FOR SELECT TO authenticated
  USING (true);
