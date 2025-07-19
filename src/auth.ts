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
			// Twitter (X) のユーザー名を保存するための新しいカラム
			username: {
				type: "string", // 文字列型で定義
				required: false, // 必須ではない場合
			},
			// Twitter (X) のユーザーIDを保存するための新しいカラム
			twitterId: {
				type: "string", // TwitterのIDは通常文字列であるため文字列型で定義
				required: false, // 必須ではない場合
			},
			// 取得したツイートのリストを保存するための新しいカラム
			// PostgreSQLの場合は 'json' または 'jsonb' 型が適しています
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
				return {};
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
