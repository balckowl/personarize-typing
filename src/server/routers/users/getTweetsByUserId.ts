import { user } from "@/db/schema";
import { customAI } from "@/server/lib/customAI";
import { authed } from "@/server/orpc";
import { ResponseTweetsSchema } from "@/server/schemas/user.schema";
import { eq } from "drizzle-orm";

export const getTweetsByUserId = authed
	.route({
		method: "GET",
		path: "/tweets",
		summary: "ツイートを取得する",
		tags: ["User"],
	})
	.output(ResponseTweetsSchema)
	.handler(async ({ context }) => {
		const base = await context.db.query.user.findFirst({
			where: eq(user.id, context.session.user.id),
			columns: {
				tweets: true,
				prompt: true,
			},
		});

		if (!base) {
			throw Error("ユーザーが見つかりません");
		}

		const text = await customAI({
			prompt: base.prompt,
			tweets: base.tweets,
		});

		if (!text) {
			throw new Error("Response.text is undefined");
		}

		const result: Array<{ id: number; base: string; baseToHiragana: string }> = JSON.parse(text);

		return result;
	});
