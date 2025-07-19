import { user } from "@/db/schema";
import { authed } from "@/server/orpc";
import { SettingsOutputSchema } from "@/server/schemas/user.schema";
import { eq } from "drizzle-orm";

export const getSettingsByUserId = authed
	.route({
		method: "GET",
		path: "/settings",
		summary: "設定を取得する",
		tags: ["User"],
	})
	.output(SettingsOutputSchema)
	.handler(async ({ context }) => {
		const settings = await context.db.query.user.findFirst({
			where: eq(user.id, context.session.user.id),
			columns: {
				prompt: true,
			},
		});

		if (!settings) {
			throw Error("ユーザーが見つかりません");
		}

		return settings;
	});
