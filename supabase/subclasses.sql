-- `subclasses` — subclass options grouped under each class.
--
-- Composite PK `(class_id, subclass_id)` lets `features` and `characters`
-- reference a specific subclass-within-class as a single FK target. Custom
-- subclasses aren't carved out yet — every row is treated as readable by any
-- authenticated user (writes are handled out-of-band, e.g. via seed scripts).

CREATE TABLE public.subclasses (
  class_id           UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  subclass_id        UUID NOT NULL DEFAULT gen_random_uuid(),
  name               TEXT NOT NULL,
  short_description  TEXT NOT NULL,
  PRIMARY KEY (class_id, subclass_id)
);

CREATE INDEX subclasses_class_id_idx ON public.subclasses (class_id);
CREATE INDEX subclasses_name_idx ON public.subclasses (lower(name));

ALTER TABLE public.subclasses ENABLE ROW LEVEL SECURITY;

CREATE POLICY subclasses_select_authenticated ON public.subclasses
  FOR SELECT TO authenticated
  USING (true);
