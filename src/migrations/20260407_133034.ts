import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('hr', 'en', 'de');
  CREATE TYPE "public"."enum_users_role" AS ENUM('superadmin', 'tenant-admin');
  CREATE TYPE "public"."enum_pages_blocks_hero_background_media_type" AS ENUM('none', 'image', 'video');
  CREATE TYPE "public"."enum_pages_blocks_hero_background_media_overlay" AS ENUM('none', 'light', 'medium', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_text_font_size" AS ENUM('small', 'medium', 'large', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_three_columns_columns_gradient_type" AS ENUM('linear', 'radial');
  CREATE TYPE "public"."enum_pages_blocks_three_columns_columns_gradient_direction" AS ENUM('to-bottom', 'to-top', 'to-right', 'to-left', 'to-bottom-right', 'to-bottom-left', 'to-top-right', 'to-top-left');
  CREATE TYPE "public"."enum_pages_blocks_three_columns_columns_gradient_position" AS ENUM('center', 'top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right');
  CREATE TYPE "public"."enum_pages_blocks_location_working_hours_day" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
  CREATE TYPE "public"."enum_pages_blocks_image_layout" AS ENUM('full', 'contained');
  CREATE TYPE "public"."enum_pages_blocks_image_align" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum_pages_blocks_image_grid_images_position" AS ENUM('top-left', 'top-right', 'bottom-left', 'bottom-right');
  CREATE TYPE "public"."enum_menu_identifier" AS ENUM('main-menu', 'tenant-menu');
  CREATE TYPE "public"."enum_menu_positioning" AS ENUM('fixed', 'absolute', 'relative');
  CREATE TYPE "public"."enum_forms_confirmation_type" AS ENUM('message', 'redirect');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"role" "enum_users_role" DEFAULT 'tenant-admin' NOT NULL,
  	"tenant_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"tenant_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_xs_url" varchar,
  	"sizes_xs_width" numeric,
  	"sizes_xs_height" numeric,
  	"sizes_xs_mime_type" varchar,
  	"sizes_xs_filesize" numeric,
  	"sizes_xs_filename" varchar,
  	"sizes_sm_url" varchar,
  	"sizes_sm_width" numeric,
  	"sizes_sm_height" numeric,
  	"sizes_sm_mime_type" varchar,
  	"sizes_sm_filesize" numeric,
  	"sizes_sm_filename" varchar,
  	"sizes_md_url" varchar,
  	"sizes_md_width" numeric,
  	"sizes_md_height" numeric,
  	"sizes_md_mime_type" varchar,
  	"sizes_md_filesize" numeric,
  	"sizes_md_filename" varchar,
  	"sizes_lg_url" varchar,
  	"sizes_lg_width" numeric,
  	"sizes_lg_height" numeric,
  	"sizes_lg_mime_type" varchar,
  	"sizes_lg_filesize" numeric,
  	"sizes_lg_filename" varchar,
  	"sizes_xl_url" varchar,
  	"sizes_xl_width" numeric,
  	"sizes_xl_height" numeric,
  	"sizes_xl_mime_type" varchar,
  	"sizes_xl_filesize" numeric,
  	"sizes_xl_filename" varchar,
  	"sizes_xxl_url" varchar,
  	"sizes_xxl_width" numeric,
  	"sizes_xxl_height" numeric,
  	"sizes_xxl_mime_type" varchar,
  	"sizes_xxl_filesize" numeric,
  	"sizes_xxl_filename" varchar,
  	"sizes_square_url" varchar,
  	"sizes_square_width" numeric,
  	"sizes_square_height" numeric,
  	"sizes_square_mime_type" varchar,
  	"sizes_square_filesize" numeric,
  	"sizes_square_filename" varchar,
  	"sizes_portrait34_url" varchar,
  	"sizes_portrait34_width" numeric,
  	"sizes_portrait34_height" numeric,
  	"sizes_portrait34_mime_type" varchar,
  	"sizes_portrait34_filesize" numeric,
  	"sizes_portrait34_filename" varchar,
  	"sizes_landscape43_url" varchar,
  	"sizes_landscape43_width" numeric,
  	"sizes_landscape43_height" numeric,
  	"sizes_landscape43_mime_type" varchar,
  	"sizes_landscape43_filesize" numeric,
  	"sizes_landscape43_filename" varchar,
  	"sizes_landscape169_url" varchar,
  	"sizes_landscape169_width" numeric,
  	"sizes_landscape169_height" numeric,
  	"sizes_landscape169_mime_type" varchar,
  	"sizes_landscape169_filesize" numeric,
  	"sizes_landscape169_filename" varchar
  );
  
  CREATE TABLE "documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "tenants" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"subdomain" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "pages_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"subheading" varchar,
  	"background_media_type" "enum_pages_blocks_hero_background_media_type" DEFAULT 'none',
  	"background_media_image_id" integer,
  	"background_media_video_id" integer,
  	"background_media_overlay" "enum_pages_blocks_hero_background_media_overlay" DEFAULT 'none',
  	"section_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_features_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Features',
  	"section_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" varchar NOT NULL,
  	"font_size" "enum_pages_blocks_text_font_size" DEFAULT 'medium',
  	"section_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_three_columns_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"background_image_id" integer,
  	"full_height" boolean DEFAULT false,
  	"gradient_enabled" boolean DEFAULT false,
  	"gradient_type" "enum_pages_blocks_three_columns_columns_gradient_type" DEFAULT 'linear',
  	"gradient_direction" "enum_pages_blocks_three_columns_columns_gradient_direction" DEFAULT 'to-bottom',
  	"gradient_position" "enum_pages_blocks_three_columns_columns_gradient_position" DEFAULT 'center',
  	"gradient_start_color" varchar DEFAULT '#000000',
  	"gradient_end_color" varchar DEFAULT '#ffffff',
  	"gradient_opacity" numeric DEFAULT 0.7,
  	"coming_soon" boolean DEFAULT false,
  	"link_tenant_id" integer,
  	"link_text" varchar NOT NULL,
  	"link_open_in_new_tab" boolean DEFAULT false,
  	"social_networks_facebook" varchar,
  	"social_networks_instagram" varchar
  );
  
  CREATE TABLE "pages_blocks_three_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"section_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_botique_intro" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar NOT NULL,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"media_top_right_id" integer,
  	"media_bottom_left_id" integer,
  	"media_bottom_right_id" integer,
  	"parallax_top_right" numeric DEFAULT -15,
  	"parallax_bottom_left" numeric DEFAULT 10,
  	"parallax_bottom_right" numeric DEFAULT -8,
  	"section_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_boutique_contact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_eyebrow" varchar,
  	"heading" varchar NOT NULL,
  	"left_text" varchar,
  	"address" varchar,
  	"email" varchar,
  	"phone" varchar,
  	"form_id" integer NOT NULL,
  	"section_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_rooms_rooms_badges" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_rooms_rooms_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"alt" varchar
  );
  
  CREATE TABLE "pages_blocks_rooms_rooms" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rentlio_property_id" varchar,
  	"rentlio_sales_channel_id" varchar DEFAULT '45',
  	"rentlio_unit_type_id" varchar,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_rooms" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar NOT NULL,
  	"subheading" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"section_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_rooftop_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer NOT NULL,
  	"alt" varchar,
  	"caption" varchar
  );
  
  CREATE TABLE "pages_blocks_rooftop" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"base_duration" numeric DEFAULT 20,
  	"section_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_rooftop_features_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_rooftop_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"section_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_location_working_hours" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"day" "enum_pages_blocks_location_working_hours_day" NOT NULL,
  	"is_open" boolean DEFAULT true,
  	"open_time" varchar,
  	"close_time" varchar,
  	"is_closed" boolean
  );
  
  CREATE TABLE "pages_blocks_location" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"address" varchar NOT NULL,
  	"coordinates_lat" numeric NOT NULL,
  	"coordinates_lng" numeric NOT NULL,
  	"section_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_concept_bar_menu_menu_categories_menu_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item_name" varchar NOT NULL,
  	"item_description" varchar,
  	"item_price" varchar,
  	"is_popular" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_blocks_concept_bar_menu_menu_categories" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"category_name" varchar NOT NULL,
  	"category_description" varchar,
  	"category_image_id" integer NOT NULL
  );
  
  CREATE TABLE "pages_blocks_concept_bar_menu" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"popular_badge_text" varchar DEFAULT 'Popular' NOT NULL,
  	"section_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_job_opportunity_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"feature_text" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_job_opportunity" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Looking for a job?' NOT NULL,
  	"subtitle" varchar DEFAULT 'Join our team at Concept Bar',
  	"description" varchar DEFAULT 'We''re always looking for passionate people to join our team. If you love hospitality, great food, and creating memorable experiences, we''d love to hear from you.' NOT NULL,
  	"button_text" varchar DEFAULT 'Apply Now' NOT NULL,
  	"button_url" varchar DEFAULT 'mailto:jobs@conceptbar.com' NOT NULL,
  	"badge_text" varchar DEFAULT 'We''re Hiring' NOT NULL,
  	"cta_note" varchar DEFAULT 'Send us your CV and let''s talk!' NOT NULL,
  	"background_image_id" integer,
  	"section_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer NOT NULL,
  	"alt" varchar,
  	"caption" varchar,
  	"layout" "enum_pages_blocks_image_layout" DEFAULT 'full',
  	"align" "enum_pages_blocks_image_align" DEFAULT 'center',
  	"section_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_intro" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" varchar NOT NULL,
  	"section_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_image_grid_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"position" "enum_pages_blocks_image_grid_images_position" NOT NULL
  );
  
  CREATE TABLE "pages_blocks_image_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"subtitle" varchar NOT NULL,
  	"button_text" varchar,
  	"button_url" varchar,
  	"section_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_floor_plan" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"building_id" integer NOT NULL,
  	"section_id" varchar,
  	"block_name" varchar
  );
  
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
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"tenant_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "pages_locales" (
  	"title" varchar NOT NULL,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "menu_menu_items_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"link" varchar NOT NULL,
  	"scroll_target" varchar,
  	"external" boolean DEFAULT false
  );
  
  CREATE TABLE "menu_menu_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"link" varchar NOT NULL,
  	"scroll_target" varchar,
  	"external" boolean DEFAULT false
  );
  
  CREATE TABLE "menu" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"identifier" "enum_menu_identifier" DEFAULT 'main-menu' NOT NULL,
  	"tenant_id" integer,
  	"logo_id" integer,
  	"positioning" "enum_menu_positioning" DEFAULT 'fixed',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "menu_locales" (
  	"title" varchar NOT NULL,
  	"logo_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "footer_bottom_content_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"open_in_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "footer_locales" (
  	"title" varchar NOT NULL,
  	"left_content_heading" varchar NOT NULL,
  	"left_content_subheading" varchar,
  	"right_content_contact_heading" varchar NOT NULL,
  	"right_content_contact_email" varchar NOT NULL,
  	"right_content_contact_phone" varchar,
  	"right_content_contact_instagram" varchar,
  	"right_content_address_heading" varchar NOT NULL,
  	"right_content_address_venue" varchar NOT NULL,
  	"right_content_address_street" varchar NOT NULL,
  	"right_content_address_city" varchar NOT NULL,
  	"right_content_address_country" varchar NOT NULL,
  	"bottom_content_copyright" varchar DEFAULT 'All Rights Reserved © 2025' NOT NULL,
  	"bottom_content_made_by" varchar DEFAULT 'Designed with passion by De Jongens van Boven' NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "buildings_units_shape_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"x" numeric NOT NULL,
  	"y" numeric NOT NULL
  );
  
  CREATE TABLE "buildings_units" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"detail_page_number" numeric NOT NULL
  );
  
  CREATE TABLE "buildings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"floor_plan_image_id" integer NOT NULL,
  	"unit_details_pdf_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "forms_blocks_checkbox" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"default_value" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_checkbox_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_country" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_country_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_email" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_email_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_message" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_message_locales" (
  	"message" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_number" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"default_value" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_number_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_select_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_select_options_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_select" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"placeholder" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_select_locales" (
  	"label" varchar,
  	"default_value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_state" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_state_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_text_locales" (
  	"label" varchar,
  	"default_value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_textarea" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_textarea_locales" (
  	"label" varchar,
  	"default_value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_emails" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"email_to" varchar,
  	"cc" varchar,
  	"bcc" varchar,
  	"reply_to" varchar,
  	"email_from" varchar
  );
  
  CREATE TABLE "forms_emails_locales" (
  	"subject" varchar DEFAULT 'You''ve received a new message.' NOT NULL,
  	"message" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"confirmation_type" "enum_forms_confirmation_type" DEFAULT 'message',
  	"redirect_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "forms_locales" (
  	"submit_button_label" varchar,
  	"confirmation_message" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "form_submissions_submission_data" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "form_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"documents_id" integer,
  	"tenants_id" integer,
  	"pages_id" integer,
  	"menu_id" integer,
  	"footer_id" integer,
  	"buildings_id" integer,
  	"forms_id" integer,
  	"form_submissions_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users" ADD CONSTRAINT "users_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_background_media_image_id_media_id_fk" FOREIGN KEY ("background_media_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_background_media_video_id_media_id_fk" FOREIGN KEY ("background_media_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_features_features" ADD CONSTRAINT "pages_blocks_features_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_features" ADD CONSTRAINT "pages_blocks_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_text" ADD CONSTRAINT "pages_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_three_columns_columns" ADD CONSTRAINT "pages_blocks_three_columns_columns_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_three_columns_columns" ADD CONSTRAINT "pages_blocks_three_columns_columns_link_tenant_id_tenants_id_fk" FOREIGN KEY ("link_tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_three_columns_columns" ADD CONSTRAINT "pages_blocks_three_columns_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_three_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_three_columns" ADD CONSTRAINT "pages_blocks_three_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_botique_intro" ADD CONSTRAINT "pages_blocks_botique_intro_media_top_right_id_media_id_fk" FOREIGN KEY ("media_top_right_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_botique_intro" ADD CONSTRAINT "pages_blocks_botique_intro_media_bottom_left_id_media_id_fk" FOREIGN KEY ("media_bottom_left_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_botique_intro" ADD CONSTRAINT "pages_blocks_botique_intro_media_bottom_right_id_media_id_fk" FOREIGN KEY ("media_bottom_right_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_botique_intro" ADD CONSTRAINT "pages_blocks_botique_intro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_boutique_contact" ADD CONSTRAINT "pages_blocks_boutique_contact_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_boutique_contact" ADD CONSTRAINT "pages_blocks_boutique_contact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rooms_rooms_badges" ADD CONSTRAINT "pages_blocks_rooms_rooms_badges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_rooms_rooms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rooms_rooms_images" ADD CONSTRAINT "pages_blocks_rooms_rooms_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_rooms_rooms_images" ADD CONSTRAINT "pages_blocks_rooms_rooms_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_rooms_rooms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rooms_rooms" ADD CONSTRAINT "pages_blocks_rooms_rooms_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_rooms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rooms" ADD CONSTRAINT "pages_blocks_rooms_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rooftop_images" ADD CONSTRAINT "pages_blocks_rooftop_images_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_rooftop_images" ADD CONSTRAINT "pages_blocks_rooftop_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_rooftop"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rooftop" ADD CONSTRAINT "pages_blocks_rooftop_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rooftop_features_features" ADD CONSTRAINT "pages_blocks_rooftop_features_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_rooftop_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rooftop_features" ADD CONSTRAINT "pages_blocks_rooftop_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_location_working_hours" ADD CONSTRAINT "pages_blocks_location_working_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_location"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_location" ADD CONSTRAINT "pages_blocks_location_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_concept_bar_menu_menu_categories_menu_items" ADD CONSTRAINT "pages_blocks_concept_bar_menu_menu_categories_menu_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_concept_bar_menu_menu_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_concept_bar_menu_menu_categories" ADD CONSTRAINT "pages_blocks_concept_bar_menu_menu_categories_category_image_id_media_id_fk" FOREIGN KEY ("category_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_concept_bar_menu_menu_categories" ADD CONSTRAINT "pages_blocks_concept_bar_menu_menu_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_concept_bar_menu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_concept_bar_menu" ADD CONSTRAINT "pages_blocks_concept_bar_menu_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_job_opportunity_features" ADD CONSTRAINT "pages_blocks_job_opportunity_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_job_opportunity"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_job_opportunity" ADD CONSTRAINT "pages_blocks_job_opportunity_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_job_opportunity" ADD CONSTRAINT "pages_blocks_job_opportunity_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image" ADD CONSTRAINT "pages_blocks_image_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_image" ADD CONSTRAINT "pages_blocks_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_intro" ADD CONSTRAINT "pages_blocks_intro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_grid_images" ADD CONSTRAINT "pages_blocks_image_grid_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_grid_images" ADD CONSTRAINT "pages_blocks_image_grid_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_image_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_grid" ADD CONSTRAINT "pages_blocks_image_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_floor_plan" ADD CONSTRAINT "pages_blocks_floor_plan_building_id_buildings_id_fk" FOREIGN KEY ("building_id") REFERENCES "public"."buildings"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_floor_plan" ADD CONSTRAINT "pages_blocks_floor_plan_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
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
  ALTER TABLE "pages" ADD CONSTRAINT "pages_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "menu_menu_items_children" ADD CONSTRAINT "menu_menu_items_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."menu_menu_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "menu_menu_items" ADD CONSTRAINT "menu_menu_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."menu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "menu" ADD CONSTRAINT "menu_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "menu" ADD CONSTRAINT "menu_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "menu_locales" ADD CONSTRAINT "menu_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."menu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_bottom_content_links" ADD CONSTRAINT "footer_bottom_content_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer" ADD CONSTRAINT "footer_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_locales" ADD CONSTRAINT "footer_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "buildings_units_shape_points" ADD CONSTRAINT "buildings_units_shape_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."buildings_units"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "buildings_units" ADD CONSTRAINT "buildings_units_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."buildings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "buildings" ADD CONSTRAINT "buildings_floor_plan_image_id_media_id_fk" FOREIGN KEY ("floor_plan_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "buildings" ADD CONSTRAINT "buildings_unit_details_pdf_id_documents_id_fk" FOREIGN KEY ("unit_details_pdf_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "forms_blocks_checkbox" ADD CONSTRAINT "forms_blocks_checkbox_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_checkbox_locales" ADD CONSTRAINT "forms_blocks_checkbox_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_checkbox"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_country" ADD CONSTRAINT "forms_blocks_country_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_country_locales" ADD CONSTRAINT "forms_blocks_country_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_country"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_email" ADD CONSTRAINT "forms_blocks_email_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_email_locales" ADD CONSTRAINT "forms_blocks_email_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_email"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_message" ADD CONSTRAINT "forms_blocks_message_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_message_locales" ADD CONSTRAINT "forms_blocks_message_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_message"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_number" ADD CONSTRAINT "forms_blocks_number_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_number_locales" ADD CONSTRAINT "forms_blocks_number_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_number"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_options" ADD CONSTRAINT "forms_blocks_select_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_options_locales" ADD CONSTRAINT "forms_blocks_select_options_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select_options"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select" ADD CONSTRAINT "forms_blocks_select_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_locales" ADD CONSTRAINT "forms_blocks_select_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_state" ADD CONSTRAINT "forms_blocks_state_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_state_locales" ADD CONSTRAINT "forms_blocks_state_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_state"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_text" ADD CONSTRAINT "forms_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_text_locales" ADD CONSTRAINT "forms_blocks_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_textarea" ADD CONSTRAINT "forms_blocks_textarea_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_textarea_locales" ADD CONSTRAINT "forms_blocks_textarea_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_textarea"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_emails" ADD CONSTRAINT "forms_emails_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_emails_locales" ADD CONSTRAINT "forms_emails_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_emails"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_locales" ADD CONSTRAINT "forms_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions_submission_data" ADD CONSTRAINT "form_submissions_submission_data_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_documents_fk" FOREIGN KEY ("documents_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tenants_fk" FOREIGN KEY ("tenants_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_menu_fk" FOREIGN KEY ("menu_id") REFERENCES "public"."menu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_footer_fk" FOREIGN KEY ("footer_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_buildings_fk" FOREIGN KEY ("buildings_id") REFERENCES "public"."buildings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_forms_fk" FOREIGN KEY ("forms_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_form_submissions_fk" FOREIGN KEY ("form_submissions_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_tenant_idx" ON "users" USING btree ("tenant_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_tenant_idx" ON "media" USING btree ("tenant_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_xs_sizes_xs_filename_idx" ON "media" USING btree ("sizes_xs_filename");
  CREATE INDEX "media_sizes_sm_sizes_sm_filename_idx" ON "media" USING btree ("sizes_sm_filename");
  CREATE INDEX "media_sizes_md_sizes_md_filename_idx" ON "media" USING btree ("sizes_md_filename");
  CREATE INDEX "media_sizes_lg_sizes_lg_filename_idx" ON "media" USING btree ("sizes_lg_filename");
  CREATE INDEX "media_sizes_xl_sizes_xl_filename_idx" ON "media" USING btree ("sizes_xl_filename");
  CREATE INDEX "media_sizes_xxl_sizes_xxl_filename_idx" ON "media" USING btree ("sizes_xxl_filename");
  CREATE INDEX "media_sizes_square_sizes_square_filename_idx" ON "media" USING btree ("sizes_square_filename");
  CREATE INDEX "media_sizes_portrait34_sizes_portrait34_filename_idx" ON "media" USING btree ("sizes_portrait34_filename");
  CREATE INDEX "media_sizes_landscape43_sizes_landscape43_filename_idx" ON "media" USING btree ("sizes_landscape43_filename");
  CREATE INDEX "media_sizes_landscape169_sizes_landscape169_filename_idx" ON "media" USING btree ("sizes_landscape169_filename");
  CREATE INDEX "documents_updated_at_idx" ON "documents" USING btree ("updated_at");
  CREATE INDEX "documents_created_at_idx" ON "documents" USING btree ("created_at");
  CREATE UNIQUE INDEX "documents_filename_idx" ON "documents" USING btree ("filename");
  CREATE UNIQUE INDEX "tenants_subdomain_idx" ON "tenants" USING btree ("subdomain");
  CREATE INDEX "tenants_updated_at_idx" ON "tenants" USING btree ("updated_at");
  CREATE INDEX "tenants_created_at_idx" ON "tenants" USING btree ("created_at");
  CREATE INDEX "pages_blocks_hero_order_idx" ON "pages_blocks_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_parent_id_idx" ON "pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_path_idx" ON "pages_blocks_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_locale_idx" ON "pages_blocks_hero" USING btree ("_locale");
  CREATE INDEX "pages_blocks_hero_background_media_background_media_imag_idx" ON "pages_blocks_hero" USING btree ("background_media_image_id");
  CREATE INDEX "pages_blocks_hero_background_media_background_media_vide_idx" ON "pages_blocks_hero" USING btree ("background_media_video_id");
  CREATE INDEX "pages_blocks_features_features_order_idx" ON "pages_blocks_features_features" USING btree ("_order");
  CREATE INDEX "pages_blocks_features_features_parent_id_idx" ON "pages_blocks_features_features" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_features_features_locale_idx" ON "pages_blocks_features_features" USING btree ("_locale");
  CREATE INDEX "pages_blocks_features_order_idx" ON "pages_blocks_features" USING btree ("_order");
  CREATE INDEX "pages_blocks_features_parent_id_idx" ON "pages_blocks_features" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_features_path_idx" ON "pages_blocks_features" USING btree ("_path");
  CREATE INDEX "pages_blocks_features_locale_idx" ON "pages_blocks_features" USING btree ("_locale");
  CREATE INDEX "pages_blocks_text_order_idx" ON "pages_blocks_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_text_parent_id_idx" ON "pages_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_text_path_idx" ON "pages_blocks_text" USING btree ("_path");
  CREATE INDEX "pages_blocks_text_locale_idx" ON "pages_blocks_text" USING btree ("_locale");
  CREATE INDEX "pages_blocks_three_columns_columns_order_idx" ON "pages_blocks_three_columns_columns" USING btree ("_order");
  CREATE INDEX "pages_blocks_three_columns_columns_parent_id_idx" ON "pages_blocks_three_columns_columns" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_three_columns_columns_locale_idx" ON "pages_blocks_three_columns_columns" USING btree ("_locale");
  CREATE INDEX "pages_blocks_three_columns_columns_background_image_idx" ON "pages_blocks_three_columns_columns" USING btree ("background_image_id");
  CREATE INDEX "pages_blocks_three_columns_columns_link_link_tenant_idx" ON "pages_blocks_three_columns_columns" USING btree ("link_tenant_id");
  CREATE INDEX "pages_blocks_three_columns_order_idx" ON "pages_blocks_three_columns" USING btree ("_order");
  CREATE INDEX "pages_blocks_three_columns_parent_id_idx" ON "pages_blocks_three_columns" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_three_columns_path_idx" ON "pages_blocks_three_columns" USING btree ("_path");
  CREATE INDEX "pages_blocks_three_columns_locale_idx" ON "pages_blocks_three_columns" USING btree ("_locale");
  CREATE INDEX "pages_blocks_botique_intro_order_idx" ON "pages_blocks_botique_intro" USING btree ("_order");
  CREATE INDEX "pages_blocks_botique_intro_parent_id_idx" ON "pages_blocks_botique_intro" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_botique_intro_path_idx" ON "pages_blocks_botique_intro" USING btree ("_path");
  CREATE INDEX "pages_blocks_botique_intro_locale_idx" ON "pages_blocks_botique_intro" USING btree ("_locale");
  CREATE INDEX "pages_blocks_botique_intro_media_top_right_idx" ON "pages_blocks_botique_intro" USING btree ("media_top_right_id");
  CREATE INDEX "pages_blocks_botique_intro_media_bottom_left_idx" ON "pages_blocks_botique_intro" USING btree ("media_bottom_left_id");
  CREATE INDEX "pages_blocks_botique_intro_media_bottom_right_idx" ON "pages_blocks_botique_intro" USING btree ("media_bottom_right_id");
  CREATE INDEX "pages_blocks_boutique_contact_order_idx" ON "pages_blocks_boutique_contact" USING btree ("_order");
  CREATE INDEX "pages_blocks_boutique_contact_parent_id_idx" ON "pages_blocks_boutique_contact" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_boutique_contact_path_idx" ON "pages_blocks_boutique_contact" USING btree ("_path");
  CREATE INDEX "pages_blocks_boutique_contact_locale_idx" ON "pages_blocks_boutique_contact" USING btree ("_locale");
  CREATE INDEX "pages_blocks_boutique_contact_form_idx" ON "pages_blocks_boutique_contact" USING btree ("form_id");
  CREATE INDEX "pages_blocks_rooms_rooms_badges_order_idx" ON "pages_blocks_rooms_rooms_badges" USING btree ("_order");
  CREATE INDEX "pages_blocks_rooms_rooms_badges_parent_id_idx" ON "pages_blocks_rooms_rooms_badges" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rooms_rooms_badges_locale_idx" ON "pages_blocks_rooms_rooms_badges" USING btree ("_locale");
  CREATE INDEX "pages_blocks_rooms_rooms_images_order_idx" ON "pages_blocks_rooms_rooms_images" USING btree ("_order");
  CREATE INDEX "pages_blocks_rooms_rooms_images_parent_id_idx" ON "pages_blocks_rooms_rooms_images" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rooms_rooms_images_locale_idx" ON "pages_blocks_rooms_rooms_images" USING btree ("_locale");
  CREATE INDEX "pages_blocks_rooms_rooms_images_image_idx" ON "pages_blocks_rooms_rooms_images" USING btree ("image_id");
  CREATE INDEX "pages_blocks_rooms_rooms_order_idx" ON "pages_blocks_rooms_rooms" USING btree ("_order");
  CREATE INDEX "pages_blocks_rooms_rooms_parent_id_idx" ON "pages_blocks_rooms_rooms" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rooms_rooms_locale_idx" ON "pages_blocks_rooms_rooms" USING btree ("_locale");
  CREATE INDEX "pages_blocks_rooms_order_idx" ON "pages_blocks_rooms" USING btree ("_order");
  CREATE INDEX "pages_blocks_rooms_parent_id_idx" ON "pages_blocks_rooms" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rooms_path_idx" ON "pages_blocks_rooms" USING btree ("_path");
  CREATE INDEX "pages_blocks_rooms_locale_idx" ON "pages_blocks_rooms" USING btree ("_locale");
  CREATE INDEX "pages_blocks_rooftop_images_order_idx" ON "pages_blocks_rooftop_images" USING btree ("_order");
  CREATE INDEX "pages_blocks_rooftop_images_parent_id_idx" ON "pages_blocks_rooftop_images" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rooftop_images_locale_idx" ON "pages_blocks_rooftop_images" USING btree ("_locale");
  CREATE INDEX "pages_blocks_rooftop_images_media_idx" ON "pages_blocks_rooftop_images" USING btree ("media_id");
  CREATE INDEX "pages_blocks_rooftop_order_idx" ON "pages_blocks_rooftop" USING btree ("_order");
  CREATE INDEX "pages_blocks_rooftop_parent_id_idx" ON "pages_blocks_rooftop" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rooftop_path_idx" ON "pages_blocks_rooftop" USING btree ("_path");
  CREATE INDEX "pages_blocks_rooftop_locale_idx" ON "pages_blocks_rooftop" USING btree ("_locale");
  CREATE INDEX "pages_blocks_rooftop_features_features_order_idx" ON "pages_blocks_rooftop_features_features" USING btree ("_order");
  CREATE INDEX "pages_blocks_rooftop_features_features_parent_id_idx" ON "pages_blocks_rooftop_features_features" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rooftop_features_features_locale_idx" ON "pages_blocks_rooftop_features_features" USING btree ("_locale");
  CREATE INDEX "pages_blocks_rooftop_features_order_idx" ON "pages_blocks_rooftop_features" USING btree ("_order");
  CREATE INDEX "pages_blocks_rooftop_features_parent_id_idx" ON "pages_blocks_rooftop_features" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rooftop_features_path_idx" ON "pages_blocks_rooftop_features" USING btree ("_path");
  CREATE INDEX "pages_blocks_rooftop_features_locale_idx" ON "pages_blocks_rooftop_features" USING btree ("_locale");
  CREATE INDEX "pages_blocks_location_working_hours_order_idx" ON "pages_blocks_location_working_hours" USING btree ("_order");
  CREATE INDEX "pages_blocks_location_working_hours_parent_id_idx" ON "pages_blocks_location_working_hours" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_location_working_hours_locale_idx" ON "pages_blocks_location_working_hours" USING btree ("_locale");
  CREATE INDEX "pages_blocks_location_order_idx" ON "pages_blocks_location" USING btree ("_order");
  CREATE INDEX "pages_blocks_location_parent_id_idx" ON "pages_blocks_location" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_location_path_idx" ON "pages_blocks_location" USING btree ("_path");
  CREATE INDEX "pages_blocks_location_locale_idx" ON "pages_blocks_location" USING btree ("_locale");
  CREATE INDEX "pages_blocks_concept_bar_menu_menu_categories_menu_items_order_idx" ON "pages_blocks_concept_bar_menu_menu_categories_menu_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_concept_bar_menu_menu_categories_menu_items_parent_id_idx" ON "pages_blocks_concept_bar_menu_menu_categories_menu_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_concept_bar_menu_menu_categories_menu_items_locale_idx" ON "pages_blocks_concept_bar_menu_menu_categories_menu_items" USING btree ("_locale");
  CREATE INDEX "pages_blocks_concept_bar_menu_menu_categories_order_idx" ON "pages_blocks_concept_bar_menu_menu_categories" USING btree ("_order");
  CREATE INDEX "pages_blocks_concept_bar_menu_menu_categories_parent_id_idx" ON "pages_blocks_concept_bar_menu_menu_categories" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_concept_bar_menu_menu_categories_locale_idx" ON "pages_blocks_concept_bar_menu_menu_categories" USING btree ("_locale");
  CREATE INDEX "pages_blocks_concept_bar_menu_menu_categories_category_i_idx" ON "pages_blocks_concept_bar_menu_menu_categories" USING btree ("category_image_id");
  CREATE INDEX "pages_blocks_concept_bar_menu_order_idx" ON "pages_blocks_concept_bar_menu" USING btree ("_order");
  CREATE INDEX "pages_blocks_concept_bar_menu_parent_id_idx" ON "pages_blocks_concept_bar_menu" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_concept_bar_menu_path_idx" ON "pages_blocks_concept_bar_menu" USING btree ("_path");
  CREATE INDEX "pages_blocks_concept_bar_menu_locale_idx" ON "pages_blocks_concept_bar_menu" USING btree ("_locale");
  CREATE INDEX "pages_blocks_job_opportunity_features_order_idx" ON "pages_blocks_job_opportunity_features" USING btree ("_order");
  CREATE INDEX "pages_blocks_job_opportunity_features_parent_id_idx" ON "pages_blocks_job_opportunity_features" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_job_opportunity_features_locale_idx" ON "pages_blocks_job_opportunity_features" USING btree ("_locale");
  CREATE INDEX "pages_blocks_job_opportunity_order_idx" ON "pages_blocks_job_opportunity" USING btree ("_order");
  CREATE INDEX "pages_blocks_job_opportunity_parent_id_idx" ON "pages_blocks_job_opportunity" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_job_opportunity_path_idx" ON "pages_blocks_job_opportunity" USING btree ("_path");
  CREATE INDEX "pages_blocks_job_opportunity_locale_idx" ON "pages_blocks_job_opportunity" USING btree ("_locale");
  CREATE INDEX "pages_blocks_job_opportunity_background_image_idx" ON "pages_blocks_job_opportunity" USING btree ("background_image_id");
  CREATE INDEX "pages_blocks_image_order_idx" ON "pages_blocks_image" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_parent_id_idx" ON "pages_blocks_image" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_path_idx" ON "pages_blocks_image" USING btree ("_path");
  CREATE INDEX "pages_blocks_image_locale_idx" ON "pages_blocks_image" USING btree ("_locale");
  CREATE INDEX "pages_blocks_image_media_idx" ON "pages_blocks_image" USING btree ("media_id");
  CREATE INDEX "pages_blocks_intro_order_idx" ON "pages_blocks_intro" USING btree ("_order");
  CREATE INDEX "pages_blocks_intro_parent_id_idx" ON "pages_blocks_intro" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_intro_path_idx" ON "pages_blocks_intro" USING btree ("_path");
  CREATE INDEX "pages_blocks_intro_locale_idx" ON "pages_blocks_intro" USING btree ("_locale");
  CREATE INDEX "pages_blocks_image_grid_images_order_idx" ON "pages_blocks_image_grid_images" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_grid_images_parent_id_idx" ON "pages_blocks_image_grid_images" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_grid_images_locale_idx" ON "pages_blocks_image_grid_images" USING btree ("_locale");
  CREATE INDEX "pages_blocks_image_grid_images_image_idx" ON "pages_blocks_image_grid_images" USING btree ("image_id");
  CREATE INDEX "pages_blocks_image_grid_order_idx" ON "pages_blocks_image_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_grid_parent_id_idx" ON "pages_blocks_image_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_grid_path_idx" ON "pages_blocks_image_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_image_grid_locale_idx" ON "pages_blocks_image_grid" USING btree ("_locale");
  CREATE INDEX "pages_blocks_floor_plan_order_idx" ON "pages_blocks_floor_plan" USING btree ("_order");
  CREATE INDEX "pages_blocks_floor_plan_parent_id_idx" ON "pages_blocks_floor_plan" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_floor_plan_path_idx" ON "pages_blocks_floor_plan" USING btree ("_path");
  CREATE INDEX "pages_blocks_floor_plan_locale_idx" ON "pages_blocks_floor_plan" USING btree ("_locale");
  CREATE INDEX "pages_blocks_floor_plan_building_idx" ON "pages_blocks_floor_plan" USING btree ("building_id");
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
  CREATE INDEX "pages_blocks_real_estate_contact_locale_idx" ON "pages_blocks_real_estate_contact" USING btree ("_locale");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_tenant_idx" ON "pages" USING btree ("tenant_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "menu_menu_items_children_order_idx" ON "menu_menu_items_children" USING btree ("_order");
  CREATE INDEX "menu_menu_items_children_parent_id_idx" ON "menu_menu_items_children" USING btree ("_parent_id");
  CREATE INDEX "menu_menu_items_children_locale_idx" ON "menu_menu_items_children" USING btree ("_locale");
  CREATE INDEX "menu_menu_items_order_idx" ON "menu_menu_items" USING btree ("_order");
  CREATE INDEX "menu_menu_items_parent_id_idx" ON "menu_menu_items" USING btree ("_parent_id");
  CREATE INDEX "menu_menu_items_locale_idx" ON "menu_menu_items" USING btree ("_locale");
  CREATE INDEX "menu_tenant_idx" ON "menu" USING btree ("tenant_id");
  CREATE INDEX "menu_logo_idx" ON "menu" USING btree ("logo_id");
  CREATE INDEX "menu_updated_at_idx" ON "menu" USING btree ("updated_at");
  CREATE INDEX "menu_created_at_idx" ON "menu" USING btree ("created_at");
  CREATE UNIQUE INDEX "menu_locales_locale_parent_id_unique" ON "menu_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_bottom_content_links_order_idx" ON "footer_bottom_content_links" USING btree ("_order");
  CREATE INDEX "footer_bottom_content_links_parent_id_idx" ON "footer_bottom_content_links" USING btree ("_parent_id");
  CREATE INDEX "footer_bottom_content_links_locale_idx" ON "footer_bottom_content_links" USING btree ("_locale");
  CREATE INDEX "footer_tenant_idx" ON "footer" USING btree ("tenant_id");
  CREATE INDEX "footer_updated_at_idx" ON "footer" USING btree ("updated_at");
  CREATE INDEX "footer_created_at_idx" ON "footer" USING btree ("created_at");
  CREATE UNIQUE INDEX "footer_locales_locale_parent_id_unique" ON "footer_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "buildings_units_shape_points_order_idx" ON "buildings_units_shape_points" USING btree ("_order");
  CREATE INDEX "buildings_units_shape_points_parent_id_idx" ON "buildings_units_shape_points" USING btree ("_parent_id");
  CREATE INDEX "buildings_units_order_idx" ON "buildings_units" USING btree ("_order");
  CREATE INDEX "buildings_units_parent_id_idx" ON "buildings_units" USING btree ("_parent_id");
  CREATE INDEX "buildings_floor_plan_image_idx" ON "buildings" USING btree ("floor_plan_image_id");
  CREATE INDEX "buildings_unit_details_pdf_idx" ON "buildings" USING btree ("unit_details_pdf_id");
  CREATE INDEX "buildings_updated_at_idx" ON "buildings" USING btree ("updated_at");
  CREATE INDEX "buildings_created_at_idx" ON "buildings" USING btree ("created_at");
  CREATE INDEX "forms_blocks_checkbox_order_idx" ON "forms_blocks_checkbox" USING btree ("_order");
  CREATE INDEX "forms_blocks_checkbox_parent_id_idx" ON "forms_blocks_checkbox" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_checkbox_path_idx" ON "forms_blocks_checkbox" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_checkbox_locales_locale_parent_id_unique" ON "forms_blocks_checkbox_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_country_order_idx" ON "forms_blocks_country" USING btree ("_order");
  CREATE INDEX "forms_blocks_country_parent_id_idx" ON "forms_blocks_country" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_country_path_idx" ON "forms_blocks_country" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_country_locales_locale_parent_id_unique" ON "forms_blocks_country_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_email_order_idx" ON "forms_blocks_email" USING btree ("_order");
  CREATE INDEX "forms_blocks_email_parent_id_idx" ON "forms_blocks_email" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_email_path_idx" ON "forms_blocks_email" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_email_locales_locale_parent_id_unique" ON "forms_blocks_email_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_message_order_idx" ON "forms_blocks_message" USING btree ("_order");
  CREATE INDEX "forms_blocks_message_parent_id_idx" ON "forms_blocks_message" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_message_path_idx" ON "forms_blocks_message" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_message_locales_locale_parent_id_unique" ON "forms_blocks_message_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_number_order_idx" ON "forms_blocks_number" USING btree ("_order");
  CREATE INDEX "forms_blocks_number_parent_id_idx" ON "forms_blocks_number" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_number_path_idx" ON "forms_blocks_number" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_number_locales_locale_parent_id_unique" ON "forms_blocks_number_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_select_options_order_idx" ON "forms_blocks_select_options" USING btree ("_order");
  CREATE INDEX "forms_blocks_select_options_parent_id_idx" ON "forms_blocks_select_options" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_select_options_locales_locale_parent_id_unique" ON "forms_blocks_select_options_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_select_order_idx" ON "forms_blocks_select" USING btree ("_order");
  CREATE INDEX "forms_blocks_select_parent_id_idx" ON "forms_blocks_select" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_select_path_idx" ON "forms_blocks_select" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_select_locales_locale_parent_id_unique" ON "forms_blocks_select_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_state_order_idx" ON "forms_blocks_state" USING btree ("_order");
  CREATE INDEX "forms_blocks_state_parent_id_idx" ON "forms_blocks_state" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_state_path_idx" ON "forms_blocks_state" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_state_locales_locale_parent_id_unique" ON "forms_blocks_state_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_text_order_idx" ON "forms_blocks_text" USING btree ("_order");
  CREATE INDEX "forms_blocks_text_parent_id_idx" ON "forms_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_text_path_idx" ON "forms_blocks_text" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_text_locales_locale_parent_id_unique" ON "forms_blocks_text_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_textarea_order_idx" ON "forms_blocks_textarea" USING btree ("_order");
  CREATE INDEX "forms_blocks_textarea_parent_id_idx" ON "forms_blocks_textarea" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_textarea_path_idx" ON "forms_blocks_textarea" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_textarea_locales_locale_parent_id_unique" ON "forms_blocks_textarea_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_emails_order_idx" ON "forms_emails" USING btree ("_order");
  CREATE INDEX "forms_emails_parent_id_idx" ON "forms_emails" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "forms_emails_locales_locale_parent_id_unique" ON "forms_emails_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_updated_at_idx" ON "forms" USING btree ("updated_at");
  CREATE INDEX "forms_created_at_idx" ON "forms" USING btree ("created_at");
  CREATE UNIQUE INDEX "forms_locales_locale_parent_id_unique" ON "forms_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "form_submissions_submission_data_order_idx" ON "form_submissions_submission_data" USING btree ("_order");
  CREATE INDEX "form_submissions_submission_data_parent_id_idx" ON "form_submissions_submission_data" USING btree ("_parent_id");
  CREATE INDEX "form_submissions_form_idx" ON "form_submissions" USING btree ("form_id");
  CREATE INDEX "form_submissions_updated_at_idx" ON "form_submissions" USING btree ("updated_at");
  CREATE INDEX "form_submissions_created_at_idx" ON "form_submissions" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_documents_id_idx" ON "payload_locked_documents_rels" USING btree ("documents_id");
  CREATE INDEX "payload_locked_documents_rels_tenants_id_idx" ON "payload_locked_documents_rels" USING btree ("tenants_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_menu_id_idx" ON "payload_locked_documents_rels" USING btree ("menu_id");
  CREATE INDEX "payload_locked_documents_rels_footer_id_idx" ON "payload_locked_documents_rels" USING btree ("footer_id");
  CREATE INDEX "payload_locked_documents_rels_buildings_id_idx" ON "payload_locked_documents_rels" USING btree ("buildings_id");
  CREATE INDEX "payload_locked_documents_rels_forms_id_idx" ON "payload_locked_documents_rels" USING btree ("forms_id");
  CREATE INDEX "payload_locked_documents_rels_form_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("form_submissions_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "documents" CASCADE;
  DROP TABLE "tenants" CASCADE;
  DROP TABLE "pages_blocks_hero" CASCADE;
  DROP TABLE "pages_blocks_features_features" CASCADE;
  DROP TABLE "pages_blocks_features" CASCADE;
  DROP TABLE "pages_blocks_text" CASCADE;
  DROP TABLE "pages_blocks_three_columns_columns" CASCADE;
  DROP TABLE "pages_blocks_three_columns" CASCADE;
  DROP TABLE "pages_blocks_botique_intro" CASCADE;
  DROP TABLE "pages_blocks_boutique_contact" CASCADE;
  DROP TABLE "pages_blocks_rooms_rooms_badges" CASCADE;
  DROP TABLE "pages_blocks_rooms_rooms_images" CASCADE;
  DROP TABLE "pages_blocks_rooms_rooms" CASCADE;
  DROP TABLE "pages_blocks_rooms" CASCADE;
  DROP TABLE "pages_blocks_rooftop_images" CASCADE;
  DROP TABLE "pages_blocks_rooftop" CASCADE;
  DROP TABLE "pages_blocks_rooftop_features_features" CASCADE;
  DROP TABLE "pages_blocks_rooftop_features" CASCADE;
  DROP TABLE "pages_blocks_location_working_hours" CASCADE;
  DROP TABLE "pages_blocks_location" CASCADE;
  DROP TABLE "pages_blocks_concept_bar_menu_menu_categories_menu_items" CASCADE;
  DROP TABLE "pages_blocks_concept_bar_menu_menu_categories" CASCADE;
  DROP TABLE "pages_blocks_concept_bar_menu" CASCADE;
  DROP TABLE "pages_blocks_job_opportunity_features" CASCADE;
  DROP TABLE "pages_blocks_job_opportunity" CASCADE;
  DROP TABLE "pages_blocks_image" CASCADE;
  DROP TABLE "pages_blocks_intro" CASCADE;
  DROP TABLE "pages_blocks_image_grid_images" CASCADE;
  DROP TABLE "pages_blocks_image_grid" CASCADE;
  DROP TABLE "pages_blocks_floor_plan" CASCADE;
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
  DROP TABLE "pages_blocks_real_estate_contact" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_locales" CASCADE;
  DROP TABLE "menu_menu_items_children" CASCADE;
  DROP TABLE "menu_menu_items" CASCADE;
  DROP TABLE "menu" CASCADE;
  DROP TABLE "menu_locales" CASCADE;
  DROP TABLE "footer_bottom_content_links" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "footer_locales" CASCADE;
  DROP TABLE "buildings_units_shape_points" CASCADE;
  DROP TABLE "buildings_units" CASCADE;
  DROP TABLE "buildings" CASCADE;
  DROP TABLE "forms_blocks_checkbox" CASCADE;
  DROP TABLE "forms_blocks_checkbox_locales" CASCADE;
  DROP TABLE "forms_blocks_country" CASCADE;
  DROP TABLE "forms_blocks_country_locales" CASCADE;
  DROP TABLE "forms_blocks_email" CASCADE;
  DROP TABLE "forms_blocks_email_locales" CASCADE;
  DROP TABLE "forms_blocks_message" CASCADE;
  DROP TABLE "forms_blocks_message_locales" CASCADE;
  DROP TABLE "forms_blocks_number" CASCADE;
  DROP TABLE "forms_blocks_number_locales" CASCADE;
  DROP TABLE "forms_blocks_select_options" CASCADE;
  DROP TABLE "forms_blocks_select_options_locales" CASCADE;
  DROP TABLE "forms_blocks_select" CASCADE;
  DROP TABLE "forms_blocks_select_locales" CASCADE;
  DROP TABLE "forms_blocks_state" CASCADE;
  DROP TABLE "forms_blocks_state_locales" CASCADE;
  DROP TABLE "forms_blocks_text" CASCADE;
  DROP TABLE "forms_blocks_text_locales" CASCADE;
  DROP TABLE "forms_blocks_textarea" CASCADE;
  DROP TABLE "forms_blocks_textarea_locales" CASCADE;
  DROP TABLE "forms_emails" CASCADE;
  DROP TABLE "forms_emails_locales" CASCADE;
  DROP TABLE "forms" CASCADE;
  DROP TABLE "forms_locales" CASCADE;
  DROP TABLE "form_submissions_submission_data" CASCADE;
  DROP TABLE "form_submissions" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_pages_blocks_hero_background_media_type";
  DROP TYPE "public"."enum_pages_blocks_hero_background_media_overlay";
  DROP TYPE "public"."enum_pages_blocks_text_font_size";
  DROP TYPE "public"."enum_pages_blocks_three_columns_columns_gradient_type";
  DROP TYPE "public"."enum_pages_blocks_three_columns_columns_gradient_direction";
  DROP TYPE "public"."enum_pages_blocks_three_columns_columns_gradient_position";
  DROP TYPE "public"."enum_pages_blocks_location_working_hours_day";
  DROP TYPE "public"."enum_pages_blocks_image_layout";
  DROP TYPE "public"."enum_pages_blocks_image_align";
  DROP TYPE "public"."enum_pages_blocks_image_grid_images_position";
  DROP TYPE "public"."enum_menu_identifier";
  DROP TYPE "public"."enum_menu_positioning";
  DROP TYPE "public"."enum_forms_confirmation_type";`)
}
