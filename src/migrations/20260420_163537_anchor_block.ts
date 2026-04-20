import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_anchor" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor_id" varchar NOT NULL,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_anchor" ADD CONSTRAINT "pages_blocks_anchor_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_anchor_order_idx" ON "pages_blocks_anchor" USING btree ("_order");
  CREATE INDEX "pages_blocks_anchor_parent_id_idx" ON "pages_blocks_anchor" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_anchor_path_idx" ON "pages_blocks_anchor" USING btree ("_path");
  CREATE INDEX "pages_blocks_anchor_locale_idx" ON "pages_blocks_anchor" USING btree ("_locale");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_anchor" CASCADE;`)
}
