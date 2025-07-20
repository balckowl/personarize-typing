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
	databaseHooks: {
		user: {
			create: {
				after: async (userInfo) => {
					const compUserInfo = userInfo as UserSchemaType;
					// console.log("---------userinf-------------");
					// console.log(compUserInfo.twitterId);
					// const url = `https://api.twitter.com/2/users/${user.id}/tweets?max_results=${maxResult}&tweet.fields=text`;
					//   const url = `https://api.twitter.com/2/users/${user.id}/tweets?max_results=${maxResult}&tweet.fields=text`;

					const maxResult = 5;
					const response = await fetch(
						`https://api.twitter.com/2/users/${compUserInfo.twitterId}/tweets?max_results=${maxResult}&tweet.fields=text`,
						{
							headers: {
								Authorization: `Bearer ${env.TWITTER_BEARER_TOKEN_1}`,
							},
						},
					);

					if (response.ok) {
						const data: { data: RawPost[] } = await response.json();
						const postList = data.data;
						const newPostList = postList.map((post) => {
							return { id: post.id, text: post.text };
						});
						await db.update(user).set({ tweets: newPostList }).where(eq(user.id, userInfo.id));
						return;
					}

					const url = "http://localhost:8080/data";
					const mockResponse = await fetch(url, {
						headers: {
							//   Authorization: `Bearer ${env.TWITTER_BEARER_TOKEN}`,
						},
						method: "GET",
					});
					if (!mockResponse.ok) {
						throw new Error("Failed to fetch tweets");
					}

					const postList: RawPost[] = await response.json();
					// Process the fetched tweets as needed
					const newPostList = postList.map((post) => {
						return { id: post.id, text: post.text };
					});

					// console.log("モックから取得");
					await db.update(user).set({ tweets: newPostList }).where(eq(user.id, userInfo.id));
				},
			},
		},
	},
});
