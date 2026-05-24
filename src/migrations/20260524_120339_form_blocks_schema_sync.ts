import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "forms_blocks_select" DROP COLUMN "name";
  ALTER TABLE "forms_blocks_select" DROP COLUMN "width";
  ALTER TABLE "forms_blocks_select" DROP COLUMN "required";
  ALTER TABLE "forms_blocks_text" DROP COLUMN "name";
  ALTER TABLE "forms_blocks_text" DROP COLUMN "width";
  ALTER TABLE "forms_blocks_text" DROP COLUMN "required";
  ALTER TABLE "forms_blocks_textarea" DROP COLUMN "name";
  ALTER TABLE "forms_blocks_textarea" DROP COLUMN "width";
  ALTER TABLE "forms_blocks_textarea" DROP COLUMN "required";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "forms_blocks_select" ADD COLUMN "name" varchar NOT NULL;
  ALTER TABLE "forms_blocks_select" ADD COLUMN "width" numeric;
  ALTER TABLE "forms_blocks_select" ADD COLUMN "required" boolean;
  ALTER TABLE "forms_blocks_text" ADD COLUMN "name" varchar NOT NULL;
  ALTER TABLE "forms_blocks_text" ADD COLUMN "width" numeric;
  ALTER TABLE "forms_blocks_text" ADD COLUMN "required" boolean;
  ALTER TABLE "forms_blocks_textarea" ADD COLUMN "name" varchar NOT NULL;
  ALTER TABLE "forms_blocks_textarea" ADD COLUMN "width" numeric;
  ALTER TABLE "forms_blocks_textarea" ADD COLUMN "required" boolean;`)
}
