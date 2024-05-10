ALTER TABLE "links" ALTER COLUMN "title" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "links" ALTER COLUMN "short_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "links" ALTER COLUMN "long_url" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "links" ALTER COLUMN "short_url" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "links" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "links" ALTER COLUMN "last_clicked_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "clicks" ADD COLUMN "user_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clicks" ADD CONSTRAINT "clicks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
