CREATE TABLE "kosice_extras" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"price" text NOT NULL,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kosice_menu_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"order" integer NOT NULL,
	"type_id" integer,
	CONSTRAINT "kosice_menu_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "kosice_menu_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"price" text NOT NULL,
	"category_id" integer,
	"order" integer NOT NULL,
	"is_combo_menu" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kosice_menu_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"image" text,
	"order" integer NOT NULL,
	CONSTRAINT "kosice_menu_types_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "kosice_menu_categories" ADD CONSTRAINT "kosice_menu_categories_type_id_kosice_menu_types_id_fk" FOREIGN KEY ("type_id") REFERENCES "public"."kosice_menu_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kosice_menu_items" ADD CONSTRAINT "kosice_menu_items_category_id_kosice_menu_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."kosice_menu_categories"("id") ON DELETE no action ON UPDATE no action;