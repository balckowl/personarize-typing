ALTER TABLE "user" DROP CONSTRAINT "user_twitter_id_unique";--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "user_twitter_username_unique";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "twitter_id";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "twitter_username";