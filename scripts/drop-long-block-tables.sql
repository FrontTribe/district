-- One-time fix: drop tables that exceed Postgres 63-char identifier limit.
-- Run after adding dbName to RealEstateProjectsWeDid block.
-- Then restart the dev server so Payload creates short-named tables.
--
-- Usage: psql $DATABASE_URI -f scripts/drop-long-block-tables.sql
-- Or paste into your DB client (TablePlus, pgAdmin, etc.)

DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename LIKE 'pages_blocks_real_estate_projects_we_did%'
  LOOP
    EXECUTE format('DROP TABLE IF EXISTS %I CASCADE', r.tablename);
    RAISE NOTICE 'Dropped: %', r.tablename;
  END LOOP;
END $$;
