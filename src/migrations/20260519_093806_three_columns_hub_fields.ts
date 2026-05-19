import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_three_columns_columns" ADD COLUMN "kicker" varchar;
  ALTER TABLE "pages_blocks_three_columns_columns" ADD COLUMN "number_label" varchar;
  ALTER TABLE "pages_blocks_three_columns_columns" ADD COLUMN "title_italic" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_three_columns_columns" DROP COLUMN "kicker";
  ALTER TABLE "pages_blocks_three_columns_columns" DROP COLUMN "number_label";
  ALTER TABLE "pages_blocks_three_columns_columns" DROP COLUMN "title_italic";`)
}
