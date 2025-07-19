import { user } from "@/db/schema";
import { authed } from "@/server/orpc";
import { SettingsInputSchema, SuccessResponseSchema } from "@/server/schemas/user.schema";

export const updateSettingsByUserId = authed
	.route({
		method: "PUT",
		path: "/settings",
		summary: "設定を更新する",
		tags: ["User"],
	})
	.input(SettingsInputSchema)
	.output(SuccessResponseSchema)
	.handler(async ({ context, input }) => {
		await context.db.update(user).set({
			prompt: input.prompt,
		});

		return { message: "更新成功" };
	});
