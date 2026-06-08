-- Enable Supabase Realtime for character_items.
--
-- Two pieces are required:
--   1. Add the table to the `supabase_realtime` publication so changes are
--      broadcast over the Realtime channel at all.
--   2. Set REPLICA IDENTITY FULL so DELETE events include every column value
--      (not just the primary key).  Without this, server-side filters like
--      `character_id=eq.<uuid>` cannot match DELETE events, which means the
--      sender's device never receives the notification that their row was
--      removed by an item transfer.

ALTER PUBLICATION supabase_realtime ADD TABLE public.character_items;
ALTER TABLE public.character_items REPLICA IDENTITY FULL;
