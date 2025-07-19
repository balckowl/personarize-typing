ALTER TABLE "user" ADD COLUMN "twitter_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "twitter_username" text NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_twitter_id_unique" UNIQUE("twitter_id");--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_twitter_username_unique" UNIQUE("twitter_username");