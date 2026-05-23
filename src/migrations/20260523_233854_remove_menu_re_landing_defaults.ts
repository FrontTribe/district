import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "menu" DROP COLUMN "re_landing_defaults_form_action_url";
  ALTER TABLE "menu" DROP COLUMN "re_landing_defaults_form_method";
  DROP TYPE "public"."enum_menu_re_landing_defaults_form_method";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_menu_re_landing_defaults_form_method" AS ENUM('POST', 'GET');
  ALTER TABLE "menu" ADD COLUMN "re_landing_defaults_form_action_url" varchar;
  ALTER TABLE "menu" ADD COLUMN "re_landing_defaults_form_method" "enum_menu_re_landing_defaults_form_method" DEFAULT 'POST';`)
}
