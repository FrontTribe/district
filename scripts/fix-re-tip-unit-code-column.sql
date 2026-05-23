-- One-time repair after a failed Payload `push` left `re_tip_items.unit_code` half-applied,
-- so Drizzle retries `ADD COLUMN unit_code` and Postgres returns 42701 "already exists".
--
-- Usage: psql "$DATABASE_URI" -f scripts/fix-re-tip-unit-code-column.sql
--
-- Then restart `pnpm dev` so push can re-run cleanly. Re-save typology rows in admin if values were lost.

ALTER TABLE IF EXISTS re_tip_items DROP COLUMN IF EXISTS unit_code;
