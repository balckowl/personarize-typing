import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { user } from "./db/schema";
import { env } from "./env";
import type { UserSchemaType } from "./server/schemas/user.schema";
import type { RawPost } from "./types";

const TWITTER_BEARER_TOKEN_List = [
	env.TWITTER_BEARER_TOKEN_1,
	env.TWITTER_BEARER_TOKEN_2,
	env.TWITTER_BEARER_TOKEN_3,
	env.TWITTER_BEARER_TOKEN_4,
];

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
	}),
	user: {
		// userモデルの設定を追加
		additionalFields: {
			username: {
				type: "string",
				required: true,
			},
			twitterId: {
				type: "string",
				required: true,
			},
		},
	},
	socialProviders: {
		github: {
			clientId: env.GITHUB_CLIENT_ID,
			clientSecret: env.GITHUB_CLIENT_SECRET,
			// mapProfileToUser: (profile) => {
			// 	// 'profile' オブジェクトの具体的な構造はTwitter (X) のAPIドキュメントで確認してください。
			// 	// ここでは、仮にTwitter (X) のプロフィールから 'name' や 'screen_name' を取得する例です。
			// 	const data = profile.data;
			// 	return {
			// 		username: data.username,
			// 		twitterId: data.id,
			// 	};
			// },
		},
	},
});
