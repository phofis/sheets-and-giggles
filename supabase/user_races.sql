-- `user_races` — join table for custom races a user has added to their
-- account. Drives the "available races" list at character creation alongside
-- the global pool of official races.

CREATE TABLE public.user_races (
  user_id  UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  race_id  UUID NOT NULL REFERENCES public.races(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, race_id)
);

CREATE INDEX user_races_race_id_idx ON public.user_races (race_id);

ALTER TABLE public.user_races ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_races_select_own ON public.user_races
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY user_races_insert_own ON public.user_races
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY user_races_delete_own ON public.user_races
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));
