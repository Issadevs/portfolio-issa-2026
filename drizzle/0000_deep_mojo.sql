CREATE TABLE "portfolio_settings" (
	"id" text PRIMARY KEY NOT NULL,
	"status" text NOT NULL,
	"contract_type" text NOT NULL,
	"available_from" date,
	"location" text NOT NULL,
	"show_contact_cta" boolean NOT NULL,
	"headline_fr" text NOT NULL,
	"headline_en" text NOT NULL,
	"note_fr" text NOT NULL,
	"note_en" text NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
