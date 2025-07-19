import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { user } from "./db/schema";
import { env } from "./env";
import type { RawPost } from "./types";

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
		twitter: {
			clientId: env.TWITTER_CLIENT_ID,
			clientSecret: env.TWITTER_CLIENT_SECRET,
			mapProfileToUser: (profile) => {
				// 'profile' オブジェクトの具体的な構造はTwitter (X) のAPIドキュメントで確認してください。
				// ここでは、仮にTwitter (X) のプロフィールから 'name' や 'screen_name' を取得する例です。
				const data = profile.data;
				return {
					username: data.username,
					twitterId: data.id,
				};
			},
		},
	},
	databaseHooks: {
		user: {
			create: {
				after: async (userInfo) => {
					// const maxResult = 5;
					//   const url = `https://api.twitter.com/2/users/${user.id}/tweets?max_results=${maxResult}&tweet.fields=text`;
					const url = "http://localhost:8080/data";
					const response = await fetch(url, {
						headers: {
							//   Authorization: `Bearer ${env.TWITTER_BEARER_TOKEN}`,
						},
						method: "GET",
					});

					if (!response.ok) {
						throw new Error("Failed to fetch tweets");
					}

					const postList: RawPost[] = await response.json();
					// Process the fetched tweets as needed
					const newPostList = postList.map((post) => {
						return { id: post.id, text: post.text };
					});
					await db.update(user).set({ tweets: newPostList });
				},
			},
		},
	},
});
