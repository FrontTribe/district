import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
DO $$ BEGIN CREATE TYPE "public"."enum_buildings_units_status" AS ENUM('available', 'reserved', 'sold'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE "public"."enum_buildings_units_unit_type" AS ENUM('garsonijera', 'jednosobni', 'jednoipolsobni', 'dvosobni', 'dvoipolsobni', 'trosobni', 'penthouse', 'other'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE "public"."enum_ln_link_type" AS ENUM('none', 'url', 'email', 'phone'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE "public"."enum_menu_re_landing_defaults_form_method" AS ENUM('POST', 'GET'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE "public"."enum_re_hero_layout" AS ENUM('default', 'split', 'centered'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE "public"."enum_re_mfst_rows_segments_style" AS ENUM('plain', 'mute', 'accent'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE "public"."enum_re_past_layout" AS ENUM('rows', 'grid'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "mmnt_ft" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"_locale" "_locales" NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"logo_text" varchar DEFAULT 'Momento.',
	"tagline" varchar,
	"pages_heading" varchar DEFAULT 'Stranice',
	"contact_heading" varchar DEFAULT 'Kontakt',
	"email" varchar,
	"phone" varchar,
	"social_heading" varchar DEFAULT 'Pratite nas',
	"instagram" varchar,
	"mega_line" varchar DEFAULT '— Vaš trenutak, vaš Momento —',
	"copyright" varchar,
	"made_by" varchar DEFAULT 'Kreirao Front Tribe',
	"block_name" varchar
);
DO $$ BEGIN ALTER TABLE "mmnt_ft" ADD CONSTRAINT "mmnt_ft_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS "mmnt_ft_order_idx" ON "mmnt_ft" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "mmnt_ft_parent_id_idx" ON "mmnt_ft" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "mmnt_ft_path_idx" ON "mmnt_ft" USING btree ("_path");
CREATE INDEX IF NOT EXISTS "mmnt_ft_locale_idx" ON "mmnt_ft" USING btree ("_locale");

CREATE TABLE IF NOT EXISTS "pages_blocks_anchor" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"_locale" "_locales" NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"anchor_id" varchar NOT NULL,
	"block_name" varchar
);
DO $$ BEGIN ALTER TABLE "pages_blocks_anchor" ADD CONSTRAINT "pages_blocks_anchor_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS "pages_blocks_anchor_order_idx" ON "pages_blocks_anchor" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "pages_blocks_anchor_parent_id_idx" ON "pages_blocks_anchor" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "pages_blocks_anchor_path_idx" ON "pages_blocks_anchor" USING btree ("_path");
CREATE INDEX IF NOT EXISTS "pages_blocks_anchor_locale_idx" ON "pages_blocks_anchor" USING btree ("_locale");

CREATE TABLE IF NOT EXISTS "re_curr" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"_locale" "_locales" NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"section_id" varchar,
	"eyebrow" varchar NOT NULL,
	"big_number" varchar NOT NULL,
	"project_meta" varchar NOT NULL,
	"project_name_html" varchar NOT NULL,
	"description" varchar NOT NULL,
	"image_id" integer NOT NULL,
	"image_alt" varchar,
	"cta_label" varchar NOT NULL,
	"cta_href" varchar NOT NULL,
	"cta_open_in_new_tab" boolean DEFAULT false,
	"block_name" varchar
);
DO $$ BEGIN ALTER TABLE "re_curr" ADD CONSTRAINT "re_curr_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "re_curr" ADD CONSTRAINT "re_curr_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS "re_curr_order_idx" ON "re_curr" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "re_curr_parent_id_idx" ON "re_curr" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "re_curr_path_idx" ON "re_curr" USING btree ("_path");
CREATE INDEX IF NOT EXISTS "re_curr_locale_idx" ON "re_curr" USING btree ("_locale");
CREATE INDEX IF NOT EXISTS "re_curr_image_idx" ON "re_curr" USING btree ("image_id");

CREATE TABLE IF NOT EXISTS "re_ftr" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"_locale" "_locales" NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"brand_text" varchar NOT NULL DEFAULT 'district.',
	"copyright_line" varchar NOT NULL DEFAULT '© 2026 — MP BYD D.O.O.',
	"address_line" varchar NOT NULL DEFAULT 'Ulica Ljudevita Posavskog 7, Osijek',
	"block_name" varchar
);
DO $$ BEGIN ALTER TABLE "re_ftr" ADD CONSTRAINT "re_ftr_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS "re_ftr_order_idx" ON "re_ftr" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "re_ftr_parent_id_idx" ON "re_ftr" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "re_ftr_path_idx" ON "re_ftr" USING btree ("_path");
CREATE INDEX IF NOT EXISTS "re_ftr_locale_idx" ON "re_ftr" USING btree ("_locale");

CREATE TABLE IF NOT EXISTS "re_gal" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"_locale" "_locales" NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"section_id" varchar,
	"eyebrow" varchar NOT NULL,
	"intro" varchar NOT NULL,
	"intro_html" varchar,
	"block_name" varchar
);
DO $$ BEGIN ALTER TABLE "re_gal" ADD CONSTRAINT "re_gal_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS "re_gal_order_idx" ON "re_gal" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "re_gal_parent_id_idx" ON "re_gal" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "re_gal_path_idx" ON "re_gal" USING btree ("_path");
CREATE INDEX IF NOT EXISTS "re_gal_locale_idx" ON "re_gal" USING btree ("_locale");

CREATE TABLE IF NOT EXISTS "re_hero" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"_locale" "_locales" NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"hero_section_id" varchar DEFAULT 'top',
	"layout" "enum_re_hero_layout" DEFAULT 'default',
	"eyebrow" varchar NOT NULL,
	"title_line1" varchar NOT NULL,
	"title_line2_html" varchar,
	"hero_image_id" integer NOT NULL,
	"image_alt" varchar,
	"media_caption" varchar,
	"lead" varchar NOT NULL,
	"show_scroll_cue" boolean DEFAULT true,
	"scroll_cue_label" varchar DEFAULT 'Scroll to explore',
	"block_name" varchar
);
DO $$ BEGIN ALTER TABLE "re_hero" ADD CONSTRAINT "re_hero_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "re_hero" ADD CONSTRAINT "re_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS "re_hero_order_idx" ON "re_hero" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "re_hero_parent_id_idx" ON "re_hero" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "re_hero_path_idx" ON "re_hero" USING btree ("_path");
CREATE INDEX IF NOT EXISTS "re_hero_locale_idx" ON "re_hero" USING btree ("_locale");
CREATE INDEX IF NOT EXISTS "re_hero_hero_image_idx" ON "re_hero" USING btree ("hero_image_id");

CREATE TABLE IF NOT EXISTS "re_inq" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"_locale" "_locales" NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"section_id" varchar,
	"eyebrow" varchar,
	"intro_html" varchar,
	"form_id" integer NOT NULL,
	"submit_button_label" varchar DEFAULT '— POŠALJI PORUKU',
	"disabled_submit_help" varchar DEFAULT 'Odaberite obrazac u CMS-u',
	"success_message" varchar DEFAULT 'Hvala — javit ćemo vam se uskoro.',
	"block_name" varchar
);
DO $$ BEGIN ALTER TABLE "re_inq" ADD CONSTRAINT "re_inq_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "re_inq" ADD CONSTRAINT "re_inq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS "re_inq_order_idx" ON "re_inq" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "re_inq_parent_id_idx" ON "re_inq" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "re_inq_path_idx" ON "re_inq" USING btree ("_path");
CREATE INDEX IF NOT EXISTS "re_inq_locale_idx" ON "re_inq" USING btree ("_locale");
CREATE INDEX IF NOT EXISTS "re_inq_form_idx" ON "re_inq" USING btree ("form_id");

CREATE TABLE IF NOT EXISTS "re_mfst" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"_locale" "_locales" NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"section_id" varchar,
	"label_left" varchar NOT NULL,
	"label_num" varchar NOT NULL,
	"top_intro_html" varchar,
	"footnote_html" varchar,
	"block_name" varchar
);
DO $$ BEGIN ALTER TABLE "re_mfst" ADD CONSTRAINT "re_mfst_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS "re_mfst_order_idx" ON "re_mfst" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "re_mfst_parent_id_idx" ON "re_mfst" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "re_mfst_path_idx" ON "re_mfst" USING btree ("_path");
CREATE INDEX IF NOT EXISTS "re_mfst_locale_idx" ON "re_mfst" USING btree ("_locale");

CREATE TABLE IF NOT EXISTS "re_mrq" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"_locale" "_locales" NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"duration_seconds" numeric DEFAULT 60,
	"separator" varchar DEFAULT '·',
	"aria_label" varchar,
	"block_name" varchar
);
DO $$ BEGIN ALTER TABLE "re_mrq" ADD CONSTRAINT "re_mrq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS "re_mrq_order_idx" ON "re_mrq" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "re_mrq_parent_id_idx" ON "re_mrq" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "re_mrq_path_idx" ON "re_mrq" USING btree ("_path");
CREATE INDEX IF NOT EXISTS "re_mrq_locale_idx" ON "re_mrq" USING btree ("_locale");

CREATE TABLE IF NOT EXISTS "re_nav" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"_locale" "_locales" NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"brand_html" varchar DEFAULT '<b>district.</b>',
	"brand_aria_label" varchar,
	"lang_line" varchar DEFAULT 'HR · EN · DE',
	"show_lang_line" boolean DEFAULT true,
	"cta_label" varchar,
	"cta_href" varchar,
	"cta_open_in_new_tab" boolean DEFAULT false,
	"block_name" varchar
);
DO $$ BEGIN ALTER TABLE "re_nav" ADD CONSTRAINT "re_nav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS "re_nav_order_idx" ON "re_nav" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "re_nav_parent_id_idx" ON "re_nav" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "re_nav_path_idx" ON "re_nav" USING btree ("_path");
CREATE INDEX IF NOT EXISTS "re_nav_locale_idx" ON "re_nav" USING btree ("_locale");

CREATE TABLE IF NOT EXISTS "re_past" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"_locale" "_locales" NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"section_id" varchar,
	"layout" "enum_re_past_layout" DEFAULT 'rows',
	"eyebrow" varchar NOT NULL,
	"intro_html" varchar NOT NULL,
	"block_name" varchar
);
DO $$ BEGIN ALTER TABLE "re_past" ADD CONSTRAINT "re_past_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS "re_past_order_idx" ON "re_past" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "re_past_parent_id_idx" ON "re_past" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "re_past_path_idx" ON "re_past" USING btree ("_path");
CREATE INDEX IF NOT EXISTS "re_past_locale_idx" ON "re_past" USING btree ("_locale");

CREATE TABLE IF NOT EXISTS "re_prt" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"_locale" "_locales" NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"section_id" varchar,
	"image_id" integer NOT NULL,
	"image_alt" varchar,
	"eyebrow" varchar NOT NULL,
	"cta_label" varchar NOT NULL,
	"cta_href" varchar NOT NULL,
	"cta_open_in_new_tab" boolean DEFAULT false,
	"secondary_cta_label" varchar,
	"secondary_cta_href" varchar,
	"secondary_cta_open_in_new_tab" boolean DEFAULT false,
	"signature_bold" varchar NOT NULL,
	"signature_sub" varchar NOT NULL,
	"block_name" varchar
);
DO $$ BEGIN ALTER TABLE "re_prt" ADD CONSTRAINT "re_prt_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "re_prt" ADD CONSTRAINT "re_prt_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS "re_prt_order_idx" ON "re_prt" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "re_prt_parent_id_idx" ON "re_prt" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "re_prt_path_idx" ON "re_prt" USING btree ("_path");
CREATE INDEX IF NOT EXISTS "re_prt_locale_idx" ON "re_prt" USING btree ("_locale");
CREATE INDEX IF NOT EXISTS "re_prt_image_idx" ON "re_prt" USING btree ("image_id");

CREATE TABLE IF NOT EXISTS "re_tip" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"_locale" "_locales" NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"section_id" varchar,
	"eyebrow" varchar NOT NULL,
	"intro" varchar NOT NULL,
	"count_suffix_word" varchar,
	"outro_html" varchar,
	"block_name" varchar
);
DO $$ BEGIN ALTER TABLE "re_tip" ADD CONSTRAINT "re_tip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS "re_tip_order_idx" ON "re_tip" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "re_tip_parent_id_idx" ON "re_tip" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "re_tip_path_idx" ON "re_tip" USING btree ("_path");
CREATE INDEX IF NOT EXISTS "re_tip_locale_idx" ON "re_tip" USING btree ("_locale");

CREATE TABLE IF NOT EXISTS "re_ub" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"_locale" "_locales" NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"section_id" varchar,
	"eyebrow" varchar NOT NULL,
	"intro_html" varchar NOT NULL,
	"legend_html" varchar,
	"detail_panel_note_html" varchar,
	"building_id" integer NOT NULL,
	"pdf_meta_line" varchar,
	"browser_copy_dilatation_label" varchar,
	"browser_copy_floor_label" varchar,
	"browser_copy_floor_button_word" varchar,
	"browser_copy_stage_floor_word" varchar,
	"browser_copy_units_total_suffix" varchar,
	"browser_copy_dilatation_stage_prefix" varchar,
	"browser_copy_status_available" varchar,
	"browser_copy_status_reserved" varchar,
	"browser_copy_status_sold" varchar,
	"browser_copy_loading_in_progress" varchar,
	"browser_copy_loading_error_template" varchar,
	"browser_copy_pdf_card_badge" varchar,
	"browser_copy_admin_hint" varchar,
	"browser_copy_default_detail_lead" varchar,
	"browser_copy_pages_range_template" varchar,
	"browser_copy_unexpected_response" varchar,
	"browser_copy_network_failure" varchar,
	"pdf_modal_copy_meta_template" varchar,
	"pdf_modal_copy_close_label" varchar,
	"pdf_modal_copy_modal_unit_word" varchar,
	"pdf_modal_copy_net_label" varchar,
	"pdf_modal_copy_gross_label" varchar,
	"pdf_modal_copy_pdf_page_prefix" varchar,
	"pdf_modal_copy_empty_document_message" varchar,
	"pdf_modal_copy_open_in_new_tab" varchar,
	"pdf_modal_copy_send_inquiry_cta" varchar,
	"pdf_modal_copy_embed_title_template" varchar,
	"block_name" varchar
);
DO $$ BEGIN ALTER TABLE "re_ub" ADD CONSTRAINT "re_ub_building_id_buildings_id_fk" FOREIGN KEY ("building_id") REFERENCES "public"."buildings"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "re_ub" ADD CONSTRAINT "re_ub_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS "re_ub_order_idx" ON "re_ub" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "re_ub_parent_id_idx" ON "re_ub" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "re_ub_path_idx" ON "re_ub" USING btree ("_path");
CREATE INDEX IF NOT EXISTS "re_ub_locale_idx" ON "re_ub" USING btree ("_locale");
CREATE INDEX IF NOT EXISTS "re_ub_building_idx" ON "re_ub" USING btree ("building_id");

CREATE TABLE IF NOT EXISTS "cp_st" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"_locale" "_locales" NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"label" varchar NOT NULL,
	"value" varchar NOT NULL
);
DO $$ BEGIN ALTER TABLE "cp_st" ADD CONSTRAINT "cp_st_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."re_curr"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS "cp_st_order_idx" ON "cp_st" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "cp_st_parent_id_idx" ON "cp_st" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "cp_st_locale_idx" ON "cp_st" USING btree ("_locale");

CREATE TABLE IF NOT EXISTS "mmnt_ft_nav_links" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"_locale" "_locales" NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"label" varchar NOT NULL,
	"href" varchar NOT NULL
);
DO $$ BEGIN ALTER TABLE "mmnt_ft_nav_links" ADD CONSTRAINT "mmnt_ft_nav_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."mmnt_ft"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS "mmnt_ft_nav_links_order_idx" ON "mmnt_ft_nav_links" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "mmnt_ft_nav_links_parent_id_idx" ON "mmnt_ft_nav_links" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "mmnt_ft_nav_links_locale_idx" ON "mmnt_ft_nav_links" USING btree ("_locale");

CREATE TABLE IF NOT EXISTS "pp_prj" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"_locale" "_locales" NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"subtitle" varchar,
	"location" varchar NOT NULL,
	"year" varchar NOT NULL,
	"status_label" varchar NOT NULL,
	"status_active" boolean DEFAULT false,
	"summary_html" varchar,
	"external_url" varchar,
	"external_open_in_new_tab" boolean DEFAULT true,
	"preview_image_id" integer,
	"preview_image_alt" varchar
);
DO $$ BEGIN ALTER TABLE "pp_prj" ADD CONSTRAINT "pp_prj_preview_image_id_media_id_fk" FOREIGN KEY ("preview_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "pp_prj" ADD CONSTRAINT "pp_prj_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."re_past"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS "pp_prj_order_idx" ON "pp_prj" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "pp_prj_parent_id_idx" ON "pp_prj" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "pp_prj_locale_idx" ON "pp_prj" USING btree ("_locale");
CREATE INDEX IF NOT EXISTS "pp_prj_preview_image_idx" ON "pp_prj" USING btree ("preview_image_id");

CREATE TABLE IF NOT EXISTS "re_curr_heading_parts" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"_locale" "_locales" NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"text" varchar NOT NULL,
	"italic" boolean DEFAULT false,
	"line_break" boolean DEFAULT false
);
DO $$ BEGIN ALTER TABLE "re_curr_heading_parts" ADD CONSTRAINT "re_curr_heading_parts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."re_curr"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS "re_curr_heading_parts_order_idx" ON "re_curr_heading_parts" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "re_curr_heading_parts_parent_id_idx" ON "re_curr_heading_parts" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "re_curr_heading_parts_locale_idx" ON "re_curr_heading_parts" USING btree ("_locale");

CREATE TABLE IF NOT EXISTS "re_ftr_columns" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"_locale" "_locales" NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"label" varchar NOT NULL
);
DO $$ BEGIN ALTER TABLE "re_ftr_columns" ADD CONSTRAINT "re_ftr_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."re_ftr"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS "re_ftr_columns_order_idx" ON "re_ftr_columns" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "re_ftr_columns_parent_id_idx" ON "re_ftr_columns" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "re_ftr_columns_locale_idx" ON "re_ftr_columns" USING btree ("_locale");

CREATE TABLE IF NOT EXISTS "re_gal_heading_parts" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"_locale" "_locales" NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"text" varchar NOT NULL,
	"italic" boolean DEFAULT false,
	"line_break" boolean DEFAULT false
);
DO $$ BEGIN ALTER TABLE "re_gal_heading_parts" ADD CONSTRAINT "re_gal_heading_parts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."re_gal"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS "re_gal_heading_parts_order_idx" ON "re_gal_heading_parts" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "re_gal_heading_parts_parent_id_idx" ON "re_gal_heading_parts" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "re_gal_heading_parts_locale_idx" ON "re_gal_heading_parts" USING btree ("_locale");

CREATE TABLE IF NOT EXISTS "re_gal_slides" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"_locale" "_locales" NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"image_id" integer NOT NULL,
	"slide_image_alt" varchar,
	"name" varchar NOT NULL,
	"location" varchar NOT NULL,
	"credit" varchar,
	"link_url" varchar,
	"link_open_in_new_tab" boolean DEFAULT false
);
DO $$ BEGIN ALTER TABLE "re_gal_slides" ADD CONSTRAINT "re_gal_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "re_gal_slides" ADD CONSTRAINT "re_gal_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."re_gal"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS "re_gal_slides_order_idx" ON "re_gal_slides" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "re_gal_slides_parent_id_idx" ON "re_gal_slides" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "re_gal_slides_locale_idx" ON "re_gal_slides" USING btree ("_locale");
CREATE INDEX IF NOT EXISTS "re_gal_slides_image_idx" ON "re_gal_slides" USING btree ("image_id");

CREATE TABLE IF NOT EXISTS "re_hero_meta_rows" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"_locale" "_locales" NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"label" varchar NOT NULL,
	"value" varchar NOT NULL
);
DO $$ BEGIN ALTER TABLE "re_hero_meta_rows" ADD CONSTRAINT "re_hero_meta_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."re_hero"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS "re_hero_meta_rows_order_idx" ON "re_hero_meta_rows" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "re_hero_meta_rows_parent_id_idx" ON "re_hero_meta_rows" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "re_hero_meta_rows_locale_idx" ON "re_hero_meta_rows" USING btree ("_locale");

CREATE TABLE IF NOT EXISTS "re_hero_top_left_lines" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"_locale" "_locales" NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"line" varchar NOT NULL
);
DO $$ BEGIN ALTER TABLE "re_hero_top_left_lines" ADD CONSTRAINT "re_hero_top_left_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."re_hero"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS "re_hero_top_left_lines_order_idx" ON "re_hero_top_left_lines" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "re_hero_top_left_lines_parent_id_idx" ON "re_hero_top_left_lines" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "re_hero_top_left_lines_locale_idx" ON "re_hero_top_left_lines" USING btree ("_locale");

CREATE TABLE IF NOT EXISTS "re_hero_top_right_lines" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"_locale" "_locales" NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"line" varchar NOT NULL
);
DO $$ BEGIN ALTER TABLE "re_hero_top_right_lines" ADD CONSTRAINT "re_hero_top_right_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."re_hero"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS "re_hero_top_right_lines_order_idx" ON "re_hero_top_right_lines" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "re_hero_top_right_lines_parent_id_idx" ON "re_hero_top_right_lines" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "re_hero_top_right_lines_locale_idx" ON "re_hero_top_right_lines" USING btree ("_locale");

CREATE TABLE IF NOT EXISTS "re_inq_heading_parts" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"_locale" "_locales" NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"text" varchar NOT NULL,
	"italic" boolean DEFAULT false,
	"line_break" boolean DEFAULT false
);
DO $$ BEGIN ALTER TABLE "re_inq_heading_parts" ADD CONSTRAINT "re_inq_heading_parts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."re_inq"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS "re_inq_heading_parts_order_idx" ON "re_inq_heading_parts" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "re_inq_heading_parts_parent_id_idx" ON "re_inq_heading_parts" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "re_inq_heading_parts_locale_idx" ON "re_inq_heading_parts" USING btree ("_locale");

CREATE TABLE IF NOT EXISTS "re_mfst_rows" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"_locale" "_locales" NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL
);
DO $$ BEGIN ALTER TABLE "re_mfst_rows" ADD CONSTRAINT "re_mfst_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."re_mfst"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS "re_mfst_rows_order_idx" ON "re_mfst_rows" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "re_mfst_rows_parent_id_idx" ON "re_mfst_rows" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "re_mfst_rows_locale_idx" ON "re_mfst_rows" USING btree ("_locale");

CREATE TABLE IF NOT EXISTS "re_mrq_items" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"_locale" "_locales" NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"text" varchar NOT NULL,
	"italic" boolean DEFAULT false
);
DO $$ BEGIN ALTER TABLE "re_mrq_items" ADD CONSTRAINT "re_mrq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."re_mrq"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS "re_mrq_items_order_idx" ON "re_mrq_items" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "re_mrq_items_parent_id_idx" ON "re_mrq_items" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "re_mrq_items_locale_idx" ON "re_mrq_items" USING btree ("_locale");

CREATE TABLE IF NOT EXISTS "re_nav_links" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"_locale" "_locales" NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"label" varchar NOT NULL,
	"href" varchar NOT NULL,
	"open_in_new_tab" boolean DEFAULT false
);
DO $$ BEGIN ALTER TABLE "re_nav_links" ADD CONSTRAINT "re_nav_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."re_nav"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS "re_nav_links_order_idx" ON "re_nav_links" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "re_nav_links_parent_id_idx" ON "re_nav_links" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "re_nav_links_locale_idx" ON "re_nav_links" USING btree ("_locale");

CREATE TABLE IF NOT EXISTS "re_past_heading_parts" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"_locale" "_locales" NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"text" varchar NOT NULL,
	"italic" boolean DEFAULT false,
	"line_break" boolean DEFAULT false
);
DO $$ BEGIN ALTER TABLE "re_past_heading_parts" ADD CONSTRAINT "re_past_heading_parts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."re_past"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS "re_past_heading_parts_order_idx" ON "re_past_heading_parts" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "re_past_heading_parts_parent_id_idx" ON "re_past_heading_parts" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "re_past_heading_parts_locale_idx" ON "re_past_heading_parts" USING btree ("_locale");

CREATE TABLE IF NOT EXISTS "re_prt_heading_parts" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"_locale" "_locales" NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"text" varchar NOT NULL,
	"italic" boolean DEFAULT false,
	"line_break" boolean DEFAULT false
);
DO $$ BEGIN ALTER TABLE "re_prt_heading_parts" ADD CONSTRAINT "re_prt_heading_parts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."re_prt"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS "re_prt_heading_parts_order_idx" ON "re_prt_heading_parts" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "re_prt_heading_parts_parent_id_idx" ON "re_prt_heading_parts" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "re_prt_heading_parts_locale_idx" ON "re_prt_heading_parts" USING btree ("_locale");

CREATE TABLE IF NOT EXISTS "re_prt_paragraphs" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"_locale" "_locales" NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"text" varchar NOT NULL
);
DO $$ BEGIN ALTER TABLE "re_prt_paragraphs" ADD CONSTRAINT "re_prt_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."re_prt"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS "re_prt_paragraphs_order_idx" ON "re_prt_paragraphs" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "re_prt_paragraphs_parent_id_idx" ON "re_prt_paragraphs" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "re_prt_paragraphs_locale_idx" ON "re_prt_paragraphs" USING btree ("_locale");

CREATE TABLE IF NOT EXISTS "re_tip_heading_parts" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"_locale" "_locales" NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"text" varchar NOT NULL,
	"italic" boolean DEFAULT false,
	"line_break" boolean DEFAULT false
);
DO $$ BEGIN ALTER TABLE "re_tip_heading_parts" ADD CONSTRAINT "re_tip_heading_parts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."re_tip"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS "re_tip_heading_parts_order_idx" ON "re_tip_heading_parts" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "re_tip_heading_parts_parent_id_idx" ON "re_tip_heading_parts" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "re_tip_heading_parts_locale_idx" ON "re_tip_heading_parts" USING btree ("_locale");

CREATE TABLE IF NOT EXISTS "re_tip_items" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"_locale" "_locales" NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"unit_code" varchar NOT NULL DEFAULT '',
	"name" varchar NOT NULL,
	"size" varchar NOT NULL,
	"description" varchar NOT NULL,
	"count" numeric NOT NULL,
	"highlight" boolean DEFAULT false
);
DO $$ BEGIN ALTER TABLE "re_tip_items" ADD CONSTRAINT "re_tip_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."re_tip"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS "re_tip_items_order_idx" ON "re_tip_items" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "re_tip_items_parent_id_idx" ON "re_tip_items" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "re_tip_items_locale_idx" ON "re_tip_items" USING btree ("_locale");

CREATE TABLE IF NOT EXISTS "re_ub_heading_parts" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"_locale" "_locales" NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"text" varchar NOT NULL,
	"italic" boolean DEFAULT false,
	"line_break" boolean DEFAULT false
);
DO $$ BEGIN ALTER TABLE "re_ub_heading_parts" ADD CONSTRAINT "re_ub_heading_parts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."re_ub"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS "re_ub_heading_parts_order_idx" ON "re_ub_heading_parts" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "re_ub_heading_parts_parent_id_idx" ON "re_ub_heading_parts" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "re_ub_heading_parts_locale_idx" ON "re_ub_heading_parts" USING btree ("_locale");

CREATE TABLE IF NOT EXISTS "ln" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"_locale" "_locales" NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"text" varchar NOT NULL,
	"link_type" "enum_ln_link_type" DEFAULT 'none',
	"href" varchar,
	"open_in_new_tab" boolean DEFAULT false
);
DO $$ BEGIN ALTER TABLE "ln" ADD CONSTRAINT "ln_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."re_ftr_columns"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS "ln_order_idx" ON "ln" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "ln_parent_id_idx" ON "ln" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "ln_locale_idx" ON "ln" USING btree ("_locale");

CREATE TABLE IF NOT EXISTS "pp_gl" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"_locale" "_locales" NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"image_id" integer NOT NULL,
	"caption" varchar,
	"alt" varchar,
	"credit" varchar
);
DO $$ BEGIN ALTER TABLE "pp_gl" ADD CONSTRAINT "pp_gl_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "pp_gl" ADD CONSTRAINT "pp_gl_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pp_prj"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS "pp_gl_order_idx" ON "pp_gl" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "pp_gl_parent_id_idx" ON "pp_gl" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "pp_gl_locale_idx" ON "pp_gl" USING btree ("_locale");
CREATE INDEX IF NOT EXISTS "pp_gl_image_idx" ON "pp_gl" USING btree ("image_id");

CREATE TABLE IF NOT EXISTS "re_mfst_rows_segments" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"_locale" "_locales" NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"text" varchar NOT NULL,
	"style" "enum_re_mfst_rows_segments_style" DEFAULT 'plain'
);
DO $$ BEGIN ALTER TABLE "re_mfst_rows_segments" ADD CONSTRAINT "re_mfst_rows_segments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."re_mfst_rows"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS "re_mfst_rows_segments_order_idx" ON "re_mfst_rows_segments" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "re_mfst_rows_segments_parent_id_idx" ON "re_mfst_rows_segments" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "re_mfst_rows_segments_locale_idx" ON "re_mfst_rows_segments" USING btree ("_locale");

ALTER TABLE "forms_blocks_select_locales" ADD COLUMN IF NOT EXISTS "placeholder" varchar;

ALTER TABLE "forms_blocks_text_locales" ADD COLUMN IF NOT EXISTS "placeholder" varchar;

ALTER TABLE "forms_blocks_textarea_locales" ADD COLUMN IF NOT EXISTS "placeholder" varchar;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "ln" CASCADE;
    DROP TABLE IF EXISTS "re_ftr_columns" CASCADE;
    DROP TABLE IF EXISTS "re_ftr" CASCADE;
    DROP TABLE IF EXISTS "re_inq_heading_parts" CASCADE;
    DROP TABLE IF EXISTS "re_inq" CASCADE;
    DROP TABLE IF EXISTS "re_hero_meta_rows" CASCADE;
    DROP TABLE IF EXISTS "re_hero_top_right_lines" CASCADE;
    DROP TABLE IF EXISTS "re_hero_top_left_lines" CASCADE;
    DROP TABLE IF EXISTS "re_hero" CASCADE;
    DROP TABLE IF EXISTS "mmnt_ft_nav_links" CASCADE;
    DROP TABLE IF EXISTS "mmnt_ft" CASCADE;
    ALTER TABLE "forms_blocks_select_locales" DROP COLUMN IF EXISTS "placeholder";
    ALTER TABLE "forms_blocks_text_locales" DROP COLUMN IF EXISTS "placeholder";
    ALTER TABLE "forms_blocks_textarea_locales" DROP COLUMN IF EXISTS "placeholder";
  `)
}
