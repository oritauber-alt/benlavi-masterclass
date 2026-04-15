CREATE TABLE "ximus_leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"business" text,
	"source" text NOT NULL DEFAULT 'ximus-landing',
	"created_at" timestamp DEFAULT now()
);
