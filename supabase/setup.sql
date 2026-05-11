-- Shared infrastructure.
--
-- Holds the cross-table `update_updated_at()` trigger function used by every
-- mutable table to keep `updated_at` current on UPDATE. Sourced first by
-- `main.sql` so the table files can attach `set_updated_at` triggers to it.
--
-- `SET search_path = ''` is baked in to prevent schema-based hijacking
-- (advisor: function_search_path_mutable). `now()` resolves out of
-- `pg_catalog`, which is always implicitly in scope.

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
