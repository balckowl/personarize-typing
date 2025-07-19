import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		TWITTER_CLIENT_ID: z.string(),
		TWITTER_CLIENT_SECRET: z.string(),
		DATABASE_URL: z.string().url(),
		GEMINI_API_KEY: z.string(),
	},
	client: {
		NEXT_PUBLIC_APP_URL: z.string().url(),
	},
	runtimeEnv: {
		TWITTER_CLIENT_ID: process.env.TWITTER_CLIENT_ID,
		TWITTER_CLIENT_SECRET: process.env.TWITTER_CLIENT_SECRET,
		DATABASE_URL: process.env.DATABASE_URL,
		NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
		GEMINI_API_KEY: process.env.GEMINI_API_KEY,
	},
});
