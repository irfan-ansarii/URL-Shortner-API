CREATE TABLE IF NOT EXISTS "links" (
	"id" serial PRIMARY KEY NOT NULL,
	"short_id" text,
	"long_url" text,
	"short_url" text,
	"user_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DROP TABLE "urls";--> statement-breakpoint
ALTER TABLE "clicks" DROP CONSTRAINT "clicks_url_id_urls_id_fk";
--> statement-breakpoint
ALTER TABLE "clicks" ADD COLUMN "link_id" integer;--> statement-breakpoint
ALTER TABLE "clicks" ADD COLUMN "referrer" text;--> statement-breakpoint
ALTER TABLE "clicks" ADD COLUMN "country" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clicks" ADD CONSTRAINT "clicks_link_id_links_id_fk" FOREIGN KEY ("link_id") REFERENCES "links"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "clicks" DROP COLUMN IF EXISTS "url_id";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "role";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "token";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "otp_created_at";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "otp_expires_at";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "links" ADD CONSTRAINT "links_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
