import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_boutique_contact_channels_type" AS ENUM('email', 'phone', 'whatsapp', 'instagram');
  CREATE TYPE "public"."enum_pages_blocks_rooftop_layout_variant" AS ENUM('editorial', 'marquee');
  CREATE TABLE "pages_blocks_botique_intro_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" numeric NOT NULL,
  	"suffix" varchar,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_botique_intro_collage_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_boutique_contact_channels" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_pages_blocks_boutique_contact_channels_type" NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_boutique_contact_intel_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_rooftop_meta_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_rooftop_manifest_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_rooftop_stack_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer NOT NULL,
  	"alt" varchar
  );
  
  CREATE TABLE "btq_ft_info_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "btq_ft_contact_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "btq_ft_distance_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "btq_ft_marquee_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "btq_ft_legal_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "btq_ft" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"time_label" varchar DEFAULT 'Vrijeme u Osijeku',
  	"signoff_eyebrow" varchar,
  	"signoff_heading" varchar,
  	"coordinates_lat" varchar DEFAULT '45.5550° N',
  	"coordinates_lng" varchar DEFAULT '18.6955° E',
  	"address_heading" varchar DEFAULT 'Adresa & dolazak',
  	"address_html" varchar,
  	"address_map_url" varchar,
  	"contact_heading" varchar DEFAULT 'Razgovor',
  	"newsletter_heading" varchar,
  	"newsletter_note" varchar,
  	"map_heading" varchar DEFAULT 'Karta',
  	"map_cta" varchar,
  	"wordmark" varchar DEFAULT 'district.',
  	"copyright" varchar,
  	"made_by" varchar DEFAULT 'Kreirao Front Tribe · redesign concept',
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_botique_intro" ALTER COLUMN "section_id" SET DEFAULT 'o-nama';
  ALTER TABLE "pages_blocks_boutique_contact" ALTER COLUMN "section_id" SET DEFAULT 'kontakt';
  ALTER TABLE "pages_blocks_rooms" ALTER COLUMN "section_id" SET DEFAULT 'sobe';
  ALTER TABLE "pages_blocks_rooftop_images" ALTER COLUMN "media_id" DROP NOT NULL;
  ALTER TABLE "pages_blocks_rooftop" ALTER COLUMN "section_id" SET DEFAULT 'krov';
  ALTER TABLE "pages_blocks_rooftop_features" ALTER COLUMN "heading" DROP NOT NULL;
  ALTER TABLE "pages_blocks_botique_intro" ADD COLUMN "chapter_num" varchar;
  ALTER TABLE "pages_blocks_botique_intro" ADD COLUMN "chapter_label" varchar;
  ALTER TABLE "pages_blocks_botique_intro" ADD COLUMN "pull_quote" varchar;
  ALTER TABLE "pages_blocks_botique_intro" ADD COLUMN "pull_quote_cite" varchar;
  ALTER TABLE "pages_blocks_boutique_contact" ADD COLUMN "chapter_num" varchar;
  ALTER TABLE "pages_blocks_boutique_contact" ADD COLUMN "chapter_label" varchar;
  ALTER TABLE "pages_blocks_boutique_contact" ADD COLUMN "lead_text" varchar;
  ALTER TABLE "pages_blocks_boutique_contact" ADD COLUMN "form_note" varchar;
  ALTER TABLE "pages_blocks_boutique_contact" ADD COLUMN "success_heading" varchar;
  ALTER TABLE "pages_blocks_boutique_contact" ADD COLUMN "success_message" varchar;
  ALTER TABLE "pages_blocks_rooms_rooms" ADD COLUMN "room_number" varchar;
  ALTER TABLE "pages_blocks_rooms_rooms" ADD COLUMN "display_price" numeric;
  ALTER TABLE "pages_blocks_rooms_rooms" ADD COLUMN "display_price_suffix" varchar DEFAULT '€/noć';
  ALTER TABLE "pages_blocks_rooms" ADD COLUMN "chapter_num" varchar DEFAULT 'ii.';
  ALTER TABLE "pages_blocks_rooms" ADD COLUMN "chapter_label" varchar DEFAULT 'Capitulum · Sobe';
  ALTER TABLE "pages_blocks_rooftop" ADD COLUMN "layout_variant" "enum_pages_blocks_rooftop_layout_variant" DEFAULT 'editorial';
  ALTER TABLE "pages_blocks_rooftop" ADD COLUMN "chapter_num" varchar;
  ALTER TABLE "pages_blocks_rooftop" ADD COLUMN "chapter_label" varchar;
  ALTER TABLE "pages_blocks_rooftop" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_rooftop" ADD COLUMN "masthead_media_id" integer;
  ALTER TABLE "pages_blocks_rooftop" ADD COLUMN "manifest_eyebrow" varchar DEFAULT 'Manifest';
  ALTER TABLE "pages_blocks_rooftop" ADD COLUMN "manifest_heading" varchar;
  ALTER TABLE "pages_blocks_rooftop" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "pages_blocks_rooftop" ADD COLUMN "cta_href" varchar DEFAULT '#kontakt';
  ALTER TABLE "pages_blocks_rooftop_features_features" ADD COLUMN "roman_numeral" varchar;
  ALTER TABLE "pages_blocks_rooftop_features_features" ADD COLUMN "tag" varchar;
  ALTER TABLE "pages_blocks_rooftop_features_features" ADD COLUMN "media_id" integer;
  ALTER TABLE "pages_blocks_rooftop_features_features" ADD COLUMN "reverse_layout" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_botique_intro_stats" ADD CONSTRAINT "pages_blocks_botique_intro_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_botique_intro"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_botique_intro_collage_tags" ADD CONSTRAINT "pages_blocks_botique_intro_collage_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_botique_intro"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_boutique_contact_channels" ADD CONSTRAINT "pages_blocks_boutique_contact_channels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_boutique_contact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_boutique_contact_intel_rows" ADD CONSTRAINT "pages_blocks_boutique_contact_intel_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_boutique_contact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rooftop_meta_rows" ADD CONSTRAINT "pages_blocks_rooftop_meta_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_rooftop"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rooftop_manifest_items" ADD CONSTRAINT "pages_blocks_rooftop_manifest_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_rooftop"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rooftop_stack_images" ADD CONSTRAINT "pages_blocks_rooftop_stack_images_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_rooftop_stack_images" ADD CONSTRAINT "pages_blocks_rooftop_stack_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_rooftop"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "btq_ft_info_rows" ADD CONSTRAINT "btq_ft_info_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."btq_ft"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "btq_ft_contact_links" ADD CONSTRAINT "btq_ft_contact_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."btq_ft"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "btq_ft_distance_rows" ADD CONSTRAINT "btq_ft_distance_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."btq_ft"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "btq_ft_marquee_items" ADD CONSTRAINT "btq_ft_marquee_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."btq_ft"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "btq_ft_legal_links" ADD CONSTRAINT "btq_ft_legal_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."btq_ft"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "btq_ft" ADD CONSTRAINT "btq_ft_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_botique_intro_stats_order_idx" ON "pages_blocks_botique_intro_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_botique_intro_stats_parent_id_idx" ON "pages_blocks_botique_intro_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_botique_intro_stats_locale_idx" ON "pages_blocks_botique_intro_stats" USING btree ("_locale");
  CREATE INDEX "pages_blocks_botique_intro_collage_tags_order_idx" ON "pages_blocks_botique_intro_collage_tags" USING btree ("_order");
  CREATE INDEX "pages_blocks_botique_intro_collage_tags_parent_id_idx" ON "pages_blocks_botique_intro_collage_tags" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_botique_intro_collage_tags_locale_idx" ON "pages_blocks_botique_intro_collage_tags" USING btree ("_locale");
  CREATE INDEX "pages_blocks_boutique_contact_channels_order_idx" ON "pages_blocks_boutique_contact_channels" USING btree ("_order");
  CREATE INDEX "pages_blocks_boutique_contact_channels_parent_id_idx" ON "pages_blocks_boutique_contact_channels" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_boutique_contact_channels_locale_idx" ON "pages_blocks_boutique_contact_channels" USING btree ("_locale");
  CREATE INDEX "pages_blocks_boutique_contact_intel_rows_order_idx" ON "pages_blocks_boutique_contact_intel_rows" USING btree ("_order");
  CREATE INDEX "pages_blocks_boutique_contact_intel_rows_parent_id_idx" ON "pages_blocks_boutique_contact_intel_rows" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_boutique_contact_intel_rows_locale_idx" ON "pages_blocks_boutique_contact_intel_rows" USING btree ("_locale");
  CREATE INDEX "pages_blocks_rooftop_meta_rows_order_idx" ON "pages_blocks_rooftop_meta_rows" USING btree ("_order");
  CREATE INDEX "pages_blocks_rooftop_meta_rows_parent_id_idx" ON "pages_blocks_rooftop_meta_rows" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rooftop_meta_rows_locale_idx" ON "pages_blocks_rooftop_meta_rows" USING btree ("_locale");
  CREATE INDEX "pages_blocks_rooftop_manifest_items_order_idx" ON "pages_blocks_rooftop_manifest_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_rooftop_manifest_items_parent_id_idx" ON "pages_blocks_rooftop_manifest_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rooftop_manifest_items_locale_idx" ON "pages_blocks_rooftop_manifest_items" USING btree ("_locale");
  CREATE INDEX "pages_blocks_rooftop_stack_images_order_idx" ON "pages_blocks_rooftop_stack_images" USING btree ("_order");
  CREATE INDEX "pages_blocks_rooftop_stack_images_parent_id_idx" ON "pages_blocks_rooftop_stack_images" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rooftop_stack_images_locale_idx" ON "pages_blocks_rooftop_stack_images" USING btree ("_locale");
  CREATE INDEX "pages_blocks_rooftop_stack_images_media_idx" ON "pages_blocks_rooftop_stack_images" USING btree ("media_id");
  CREATE INDEX "btq_ft_info_rows_order_idx" ON "btq_ft_info_rows" USING btree ("_order");
  CREATE INDEX "btq_ft_info_rows_parent_id_idx" ON "btq_ft_info_rows" USING btree ("_parent_id");
  CREATE INDEX "btq_ft_info_rows_locale_idx" ON "btq_ft_info_rows" USING btree ("_locale");
  CREATE INDEX "btq_ft_contact_links_order_idx" ON "btq_ft_contact_links" USING btree ("_order");
  CREATE INDEX "btq_ft_contact_links_parent_id_idx" ON "btq_ft_contact_links" USING btree ("_parent_id");
  CREATE INDEX "btq_ft_contact_links_locale_idx" ON "btq_ft_contact_links" USING btree ("_locale");
  CREATE INDEX "btq_ft_distance_rows_order_idx" ON "btq_ft_distance_rows" USING btree ("_order");
  CREATE INDEX "btq_ft_distance_rows_parent_id_idx" ON "btq_ft_distance_rows" USING btree ("_parent_id");
  CREATE INDEX "btq_ft_distance_rows_locale_idx" ON "btq_ft_distance_rows" USING btree ("_locale");
  CREATE INDEX "btq_ft_marquee_items_order_idx" ON "btq_ft_marquee_items" USING btree ("_order");
  CREATE INDEX "btq_ft_marquee_items_parent_id_idx" ON "btq_ft_marquee_items" USING btree ("_parent_id");
  CREATE INDEX "btq_ft_marquee_items_locale_idx" ON "btq_ft_marquee_items" USING btree ("_locale");
  CREATE INDEX "btq_ft_legal_links_order_idx" ON "btq_ft_legal_links" USING btree ("_order");
  CREATE INDEX "btq_ft_legal_links_parent_id_idx" ON "btq_ft_legal_links" USING btree ("_parent_id");
  CREATE INDEX "btq_ft_legal_links_locale_idx" ON "btq_ft_legal_links" USING btree ("_locale");
  CREATE INDEX "btq_ft_order_idx" ON "btq_ft" USING btree ("_order");
  CREATE INDEX "btq_ft_parent_id_idx" ON "btq_ft" USING btree ("_parent_id");
  CREATE INDEX "btq_ft_path_idx" ON "btq_ft" USING btree ("_path");
  CREATE INDEX "btq_ft_locale_idx" ON "btq_ft" USING btree ("_locale");
  ALTER TABLE "pages_blocks_rooftop" ADD CONSTRAINT "pages_blocks_rooftop_masthead_media_id_media_id_fk" FOREIGN KEY ("masthead_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_rooftop_features_features" ADD CONSTRAINT "pages_blocks_rooftop_features_features_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_rooftop_masthead_media_idx" ON "pages_blocks_rooftop" USING btree ("masthead_media_id");
  CREATE INDEX "pages_blocks_rooftop_features_features_media_idx" ON "pages_blocks_rooftop_features_features" USING btree ("media_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_botique_intro_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_botique_intro_collage_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_boutique_contact_channels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_boutique_contact_intel_rows" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_rooftop_meta_rows" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_rooftop_manifest_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_rooftop_stack_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "btq_ft_info_rows" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "btq_ft_contact_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "btq_ft_distance_rows" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "btq_ft_marquee_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "btq_ft_legal_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "btq_ft" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_botique_intro_stats" CASCADE;
  DROP TABLE "pages_blocks_botique_intro_collage_tags" CASCADE;
  DROP TABLE "pages_blocks_boutique_contact_channels" CASCADE;
  DROP TABLE "pages_blocks_boutique_contact_intel_rows" CASCADE;
  DROP TABLE "pages_blocks_rooftop_meta_rows" CASCADE;
  DROP TABLE "pages_blocks_rooftop_manifest_items" CASCADE;
  DROP TABLE "pages_blocks_rooftop_stack_images" CASCADE;
  DROP TABLE "btq_ft_info_rows" CASCADE;
  DROP TABLE "btq_ft_contact_links" CASCADE;
  DROP TABLE "btq_ft_distance_rows" CASCADE;
  DROP TABLE "btq_ft_marquee_items" CASCADE;
  DROP TABLE "btq_ft_legal_links" CASCADE;
  DROP TABLE "btq_ft" CASCADE;
  ALTER TABLE "pages_blocks_rooftop" DROP CONSTRAINT "pages_blocks_rooftop_masthead_media_id_media_id_fk";
  
  ALTER TABLE "pages_blocks_rooftop_features_features" DROP CONSTRAINT "pages_blocks_rooftop_features_features_media_id_media_id_fk";
  
  DROP INDEX "pages_blocks_rooftop_masthead_media_idx";
  DROP INDEX "pages_blocks_rooftop_features_features_media_idx";
  ALTER TABLE "pages_blocks_botique_intro" ALTER COLUMN "section_id" DROP DEFAULT;
  ALTER TABLE "pages_blocks_boutique_contact" ALTER COLUMN "section_id" DROP DEFAULT;
  ALTER TABLE "pages_blocks_rooms" ALTER COLUMN "section_id" DROP DEFAULT;
  ALTER TABLE "pages_blocks_rooftop_images" ALTER COLUMN "media_id" SET NOT NULL;
  ALTER TABLE "pages_blocks_rooftop" ALTER COLUMN "section_id" DROP DEFAULT;
  ALTER TABLE "pages_blocks_rooftop_features" ALTER COLUMN "heading" SET NOT NULL;
  ALTER TABLE "pages_blocks_botique_intro" DROP COLUMN "chapter_num";
  ALTER TABLE "pages_blocks_botique_intro" DROP COLUMN "chapter_label";
  ALTER TABLE "pages_blocks_botique_intro" DROP COLUMN "pull_quote";
  ALTER TABLE "pages_blocks_botique_intro" DROP COLUMN "pull_quote_cite";
  ALTER TABLE "pages_blocks_boutique_contact" DROP COLUMN "chapter_num";
  ALTER TABLE "pages_blocks_boutique_contact" DROP COLUMN "chapter_label";
  ALTER TABLE "pages_blocks_boutique_contact" DROP COLUMN "lead_text";
  ALTER TABLE "pages_blocks_boutique_contact" DROP COLUMN "form_note";
  ALTER TABLE "pages_blocks_boutique_contact" DROP COLUMN "success_heading";
  ALTER TABLE "pages_blocks_boutique_contact" DROP COLUMN "success_message";
  ALTER TABLE "pages_blocks_rooms_rooms" DROP COLUMN "room_number";
  ALTER TABLE "pages_blocks_rooms_rooms" DROP COLUMN "display_price";
  ALTER TABLE "pages_blocks_rooms_rooms" DROP COLUMN "display_price_suffix";
  ALTER TABLE "pages_blocks_rooms" DROP COLUMN "chapter_num";
  ALTER TABLE "pages_blocks_rooms" DROP COLUMN "chapter_label";
  ALTER TABLE "pages_blocks_rooftop" DROP COLUMN "layout_variant";
  ALTER TABLE "pages_blocks_rooftop" DROP COLUMN "chapter_num";
  ALTER TABLE "pages_blocks_rooftop" DROP COLUMN "chapter_label";
  ALTER TABLE "pages_blocks_rooftop" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_rooftop" DROP COLUMN "masthead_media_id";
  ALTER TABLE "pages_blocks_rooftop" DROP COLUMN "manifest_eyebrow";
  ALTER TABLE "pages_blocks_rooftop" DROP COLUMN "manifest_heading";
  ALTER TABLE "pages_blocks_rooftop" DROP COLUMN "cta_label";
  ALTER TABLE "pages_blocks_rooftop" DROP COLUMN "cta_href";
  ALTER TABLE "pages_blocks_rooftop_features_features" DROP COLUMN "roman_numeral";
  ALTER TABLE "pages_blocks_rooftop_features_features" DROP COLUMN "tag";
  ALTER TABLE "pages_blocks_rooftop_features_features" DROP COLUMN "media_id";
  ALTER TABLE "pages_blocks_rooftop_features_features" DROP COLUMN "reverse_layout";
  DROP TYPE "public"."enum_pages_blocks_boutique_contact_channels_type";
  DROP TYPE "public"."enum_pages_blocks_rooftop_layout_variant";`)
}
