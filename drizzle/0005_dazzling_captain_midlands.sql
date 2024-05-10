CREATE TABLE IF NOT EXISTS "urls" (
	"id" serial PRIMARY KEY NOT NULL,
	"short_id" text,
	"long_url" text,
	"short_url" text,
	"created_by" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "session" RENAME TO "clicks";--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "name" TO "first_name";--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "last_name" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "phone" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "status" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "token" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "recovery_otp" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "otp_created_at" timestamp;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "otp_expires_at" timestamp;--> statement-breakpoint
ALTER TABLE "clicks" ADD COLUMN "url_id" integer;--> statement-breakpoint
ALTER TABLE "clicks" ADD COLUMN "user_agent" text;--> statement-breakpoint
ALTER TABLE "clicks" ADD COLUMN "ip_address" text;--> statement-breakpoint
ALTER TABLE "clicks" ADD COLUMN "browser" text;--> statement-breakpoint
ALTER TABLE "clicks" ADD COLUMN "device_type" text;--> statement-breakpoint
ALTER TABLE "clicks" ADD COLUMN "operating_system" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clicks" ADD CONSTRAINT "clicks_url_id_urls_id_fk" FOREIGN KEY ("url_id") REFERENCES "urls"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "clicks" DROP COLUMN IF EXISTS "name";--> statement-breakpoint
ALTER TABLE "clicks" DROP COLUMN IF EXISTS "email";--> statement-breakpoint
ALTER TABLE "clicks" DROP COLUMN IF EXISTS "password";--> statement-breakpoint
ALTER TABLE "clicks" DROP COLUMN IF EXISTS "role";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "urls" ADD CONSTRAINT "urls_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
