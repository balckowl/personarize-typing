import { user } from "@/db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

const UserInsertSchema = createInsertSchema(user);
export const SettingsInputSchema = UserInsertSchema.pick({
	prompt: true,
}).extend({
	prompt: z.string().max(15, { message: "最大15文字でお願いします。" }),
});

const UserSelectSchema = createSelectSchema(user);
export const SettingsOutputSchema = UserSelectSchema.pick({
	prompt: true,
}).extend({
	prompt: z.string().max(15, { message: "最大15文字でお願いします。" }),
});

export const TweetSchema = UserSelectSchema.pick({
	tweets: true,
});
export const ResponseTweetSchema = z.object({
	id: z.number(),
	base: z.string(),
	baseToHiragana: z.string(),
	baseToKangi: z.string(),
});

export const ResponseTweetsSchema = z.array(ResponseTweetSchema);
export const SuccessResponseSchema = z.object({
	message: z.string(),
});

export type TweetSchemaType = z.infer<typeof TweetSchema>;
export type SettingsInputSchemaType = z.infer<typeof SettingsInputSchema>;
export type SettingsOutputSchemaType = z.infer<typeof SettingsOutputSchema>;
export type ResponseTweetsSchemaType = z.infer<typeof ResponseTweetsSchema>;
export type UserSchemaType = z.infer<typeof UserSelectSchema>;
