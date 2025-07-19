ALTER TABLE "user" ADD COLUMN "tweets" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "prompt" text NOT NULL;