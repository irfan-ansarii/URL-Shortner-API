ALTER TABLE "clicks" ADD COLUMN "state" text;--> statement-breakpoint
ALTER TABLE "links" ADD COLUMN "status" text DEFAULT 'active';