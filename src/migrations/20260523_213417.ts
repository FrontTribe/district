import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_real_estate_hero" CASCADE;
  DROP TABLE "pages_blocks_real_estate_about_us" CASCADE;
  DROP TABLE "gal" CASCADE;
  DROP TABLE "proj" CASCADE;
  DROP TABLE "re_pwd" CASCADE;
  DROP TABLE "pages_blocks_real_estate_current_projects_projects" CASCADE;
  DROP TABLE "pages_blocks_real_estate_current_projects" CASCADE;
  DROP TABLE "pages_blocks_real_estate_live_camera" CASCADE;
  DROP TABLE "pages_blocks_real_estate_looking_for_job_features" CASCADE;
  DROP TABLE "pages_blocks_real_estate_looking_for_job" CASCADE;
  DROP TABLE "pages_blocks_real_estate_contact" CASCADE;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_real_estate_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"subheading" varchar,
  	"background_image_id" integer,
  	"section_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_real_estate_about_us" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"section_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "gal" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "proj" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"image_id" integer,
  	"location" varchar,
  	"year" varchar
  );
  
  CREATE TABLE "re_pwd" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar NOT NULL,
  	"subtitle" varchar,
  	"section_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_real_estate_current_projects_projects" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"building_id" integer,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"image_id" integer,
  	"status" varchar,
  	"cta_text" varchar,
  	"cta_url" varchar
  );
  
  CREATE TABLE "pages_blocks_real_estate_current_projects" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar NOT NULL,
  	"subtitle" varchar,
  	"section_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_real_estate_live_camera" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"subtitle" varchar,
  	"stream_url" varchar,
  	"fallback_image_id" integer,
  	"section_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_real_estate_looking_for_job_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_real_estate_looking_for_job" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge" varchar,
  	"heading" varchar NOT NULL,
  	"subtitle" varchar,
  	"description" varchar NOT NULL,
  	"button_text" varchar NOT NULL,
  	"button_url" varchar NOT NULL,
  	"cta_note" varchar,
  	"section_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_real_estate_contact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar NOT NULL,
  	"left_text" varchar,
  	"address" varchar,
  	"email" varchar,
  	"phone" varchar,
  	"section_id" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_real_estate_hero" ADD CONSTRAINT "pages_blocks_real_estate_hero_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_real_estate_hero" ADD CONSTRAINT "pages_blocks_real_estate_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_real_estate_about_us" ADD CONSTRAINT "pages_blocks_real_estate_about_us_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "gal" ADD CONSTRAINT "gal_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "gal" ADD CONSTRAINT "gal_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."proj"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proj" ADD CONSTRAINT "proj_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "proj" ADD CONSTRAINT "proj_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."re_pwd"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "re_pwd" ADD CONSTRAINT "re_pwd_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_real_estate_current_projects_projects" ADD CONSTRAINT "pages_blocks_real_estate_current_projects_projects_building_id_buildings_id_fk" FOREIGN KEY ("building_id") REFERENCES "public"."buildings"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_real_estate_current_projects_projects" ADD CONSTRAINT "pages_blocks_real_estate_current_projects_projects_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_real_estate_current_projects_projects" ADD CONSTRAINT "pages_blocks_real_estate_current_projects_projects_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_real_estate_current_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_real_estate_current_projects" ADD CONSTRAINT "pages_blocks_real_estate_current_projects_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_real_estate_live_camera" ADD CONSTRAINT "pages_blocks_real_estate_live_camera_fallback_image_id_media_id_fk" FOREIGN KEY ("fallback_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_real_estate_live_camera" ADD CONSTRAINT "pages_blocks_real_estate_live_camera_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_real_estate_looking_for_job_features" ADD CONSTRAINT "pages_blocks_real_estate_looking_for_job_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_real_estate_looking_for_job"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_real_estate_looking_for_job" ADD CONSTRAINT "pages_blocks_real_estate_looking_for_job_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_real_estate_contact" ADD CONSTRAINT "pages_blocks_real_estate_contact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_real_estate_hero_order_idx" ON "pages_blocks_real_estate_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_real_estate_hero_parent_id_idx" ON "pages_blocks_real_estate_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_real_estate_hero_path_idx" ON "pages_blocks_real_estate_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_real_estate_hero_locale_idx" ON "pages_blocks_real_estate_hero" USING btree ("_locale");
  CREATE INDEX "pages_blocks_real_estate_hero_background_image_idx" ON "pages_blocks_real_estate_hero" USING btree ("background_image_id");
  CREATE INDEX "pages_blocks_real_estate_about_us_order_idx" ON "pages_blocks_real_estate_about_us" USING btree ("_order");
  CREATE INDEX "pages_blocks_real_estate_about_us_parent_id_idx" ON "pages_blocks_real_estate_about_us" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_real_estate_about_us_path_idx" ON "pages_blocks_real_estate_about_us" USING btree ("_path");
  CREATE INDEX "pages_blocks_real_estate_about_us_locale_idx" ON "pages_blocks_real_estate_about_us" USING btree ("_locale");
  CREATE INDEX "gal_order_idx" ON "gal" USING btree ("_order");
  CREATE INDEX "gal_parent_id_idx" ON "gal" USING btree ("_parent_id");
  CREATE INDEX "gal_locale_idx" ON "gal" USING btree ("_locale");
  CREATE INDEX "gal_image_idx" ON "gal" USING btree ("image_id");
  CREATE INDEX "proj_order_idx" ON "proj" USING btree ("_order");
  CREATE INDEX "proj_parent_id_idx" ON "proj" USING btree ("_parent_id");
  CREATE INDEX "proj_locale_idx" ON "proj" USING btree ("_locale");
  CREATE INDEX "proj_image_idx" ON "proj" USING btree ("image_id");
  CREATE INDEX "re_pwd_order_idx" ON "re_pwd" USING btree ("_order");
  CREATE INDEX "re_pwd_parent_id_idx" ON "re_pwd" USING btree ("_parent_id");
  CREATE INDEX "re_pwd_path_idx" ON "re_pwd" USING btree ("_path");
  CREATE INDEX "re_pwd_locale_idx" ON "re_pwd" USING btree ("_locale");
  CREATE INDEX "pages_blocks_real_estate_current_projects_projects_order_idx" ON "pages_blocks_real_estate_current_projects_projects" USING btree ("_order");
  CREATE INDEX "pages_blocks_real_estate_current_projects_projects_parent_id_idx" ON "pages_blocks_real_estate_current_projects_projects" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_real_estate_current_projects_projects_locale_idx" ON "pages_blocks_real_estate_current_projects_projects" USING btree ("_locale");
  CREATE INDEX "pages_blocks_real_estate_current_projects_projects_build_idx" ON "pages_blocks_real_estate_current_projects_projects" USING btree ("building_id");
  CREATE INDEX "pages_blocks_real_estate_current_projects_projects_image_idx" ON "pages_blocks_real_estate_current_projects_projects" USING btree ("image_id");
  CREATE INDEX "pages_blocks_real_estate_current_projects_order_idx" ON "pages_blocks_real_estate_current_projects" USING btree ("_order");
  CREATE INDEX "pages_blocks_real_estate_current_projects_parent_id_idx" ON "pages_blocks_real_estate_current_projects" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_real_estate_current_projects_path_idx" ON "pages_blocks_real_estate_current_projects" USING btree ("_path");
  CREATE INDEX "pages_blocks_real_estate_current_projects_locale_idx" ON "pages_blocks_real_estate_current_projects" USING btree ("_locale");
  CREATE INDEX "pages_blocks_real_estate_live_camera_order_idx" ON "pages_blocks_real_estate_live_camera" USING btree ("_order");
  CREATE INDEX "pages_blocks_real_estate_live_camera_parent_id_idx" ON "pages_blocks_real_estate_live_camera" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_real_estate_live_camera_path_idx" ON "pages_blocks_real_estate_live_camera" USING btree ("_path");
  CREATE INDEX "pages_blocks_real_estate_live_camera_locale_idx" ON "pages_blocks_real_estate_live_camera" USING btree ("_locale");
  CREATE INDEX "pages_blocks_real_estate_live_camera_fallback_image_idx" ON "pages_blocks_real_estate_live_camera" USING btree ("fallback_image_id");
  CREATE INDEX "pages_blocks_real_estate_looking_for_job_features_order_idx" ON "pages_blocks_real_estate_looking_for_job_features" USING btree ("_order");
  CREATE INDEX "pages_blocks_real_estate_looking_for_job_features_parent_id_idx" ON "pages_blocks_real_estate_looking_for_job_features" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_real_estate_looking_for_job_features_locale_idx" ON "pages_blocks_real_estate_looking_for_job_features" USING btree ("_locale");
  CREATE INDEX "pages_blocks_real_estate_looking_for_job_order_idx" ON "pages_blocks_real_estate_looking_for_job" USING btree ("_order");
  CREATE INDEX "pages_blocks_real_estate_looking_for_job_parent_id_idx" ON "pages_blocks_real_estate_looking_for_job" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_real_estate_looking_for_job_path_idx" ON "pages_blocks_real_estate_looking_for_job" USING btree ("_path");
  CREATE INDEX "pages_blocks_real_estate_looking_for_job_locale_idx" ON "pages_blocks_real_estate_looking_for_job" USING btree ("_locale");
  CREATE INDEX "pages_blocks_real_estate_contact_order_idx" ON "pages_blocks_real_estate_contact" USING btree ("_order");
  CREATE INDEX "pages_blocks_real_estate_contact_parent_id_idx" ON "pages_blocks_real_estate_contact" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_real_estate_contact_path_idx" ON "pages_blocks_real_estate_contact" USING btree ("_path");
  CREATE INDEX "pages_blocks_real_estate_contact_locale_idx" ON "pages_blocks_real_estate_contact" USING btree ("_locale");`)
}
