-- supabase/main.sql
--
-- Orchestration script for the `public` schema. Sources each per-table file
-- in dependency order so a fresh database can be bootstrapped in one go.
--
-- Apply with:
--   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/main.sql
--
-- The `\i` directive is a psql client meta-command, so this file must be run
-- through `psql` (or anything that handles psql meta-commands). For Supabase
-- CLI / MCP `execute_sql`, run each file listed below in the order they
-- appear instead.
--
-- Order rationale:
--   * `setup.sql` first — defines the shared `update_updated_at()` trigger
--     function used by most tables.
--   * Catalog tables (users, races, classes, subclasses, features) before
--     anything that references them.
--   * Character-owned tables (characters, character_*, character_spells)
--     after `characters` is defined.
--   * `spells` sits next to `character_spells` because the join references
--     both.

\i setup.sql
\i users.sql
\i races.sql
\i classes.sql
\i subclasses.sql
\i features.sql
\i user_races.sql
\i user_classes.sql
\i characters.sql
\i character_features.sql
\i character_spell_slots.sql
\i character_items.sql
\i spells.sql
\i character_spells.sql
