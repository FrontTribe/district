import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "buildings_units" ADD COLUMN IF NOT EXISTS "dilatacija" varchar;
    ALTER TABLE "buildings_units" ADD COLUMN IF NOT EXISTS "floor" numeric;
    ALTER TABLE "buildings_units" ADD COLUMN IF NOT EXISTS "unit_type" varchar;
    ALTER TABLE "buildings_units" ADD COLUMN IF NOT EXISTS "net_area" numeric;
    ALTER TABLE "buildings_units" ADD COLUMN IF NOT EXISTS "gross_area" numeric;
    ALTER TABLE "buildings_units" ADD COLUMN IF NOT EXISTS "status" varchar DEFAULT 'available';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "buildings_units" DROP COLUMN IF EXISTS "dilatacija";
    ALTER TABLE "buildings_units" DROP COLUMN IF EXISTS "floor";
    ALTER TABLE "buildings_units" DROP COLUMN IF EXISTS "unit_type";
    ALTER TABLE "buildings_units" DROP COLUMN IF EXISTS "net_area";
    ALTER TABLE "buildings_units" DROP COLUMN IF EXISTS "gross_area";
    ALTER TABLE "buildings_units" DROP COLUMN IF EXISTS "status";
  `)
}
