ALTER TABLE "links" ADD COLUMN "click_count" integer;--> statement-breakpoint
ALTER TABLE "links" ADD COLUMN "last_clicked_at" timestamp DEFAULT now();