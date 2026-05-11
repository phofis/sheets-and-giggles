-- `user_classes` — join table for custom classes a user has added to their
-- account. Mirrors `user_races`; together with the official pool it drives
-- the "available classes" list at character creation.

CREATE TABLE public.user_classes (
  user_id  UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, class_id)
);

CREATE INDEX user_classes_class_id_idx ON public.user_classes (class_id);

ALTER TABLE public.user_classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_classes_select_own ON public.user_classes
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY user_classes_insert_own ON public.user_classes
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY user_classes_delete_own ON public.user_classes
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));
