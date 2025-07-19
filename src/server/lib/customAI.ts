import { env } from "@/env";
import { GoogleGenAI } from "@google/genai";
import type { SettingsOutputSchemaType, TweetSchemaType } from "../schemas/user.schema";

const schema = {
	type: "array",
	items: {
		type: "object",
		properties: {
			id: { type: "integer" },
			base: { type: "string" },
			baseToHiragana: { type: "string" },
		},
		required: ["id", "base", "baseToHiragana"],
	},
};

export const customAI = async ({
	prompt,
	tweets,
}: { prompt: SettingsOutputSchemaType["prompt"]; tweets: TweetSchemaType["tweets"] }) => {
	const ai = new GoogleGenAI({
		apiKey: env.GEMINI_API_KEY,
	});

	const response = await ai.models.generateContent({
		model: "gemini-1.5-flash", // プロジェクトで利用可能な最新モデルを指定
		contents: `
以下の JSON 配列を処理し、
1. 各オブジェクトの base をすべてひらがなに変換し、
2. 絵文字や記号は除去し、
3. グローバルな指示に従って出力してください。
Global Prompt: "${prompt}"

入力:
${JSON.stringify(tweets, null, 2)}

変換後は次の形で出力してください。  
[
  { id: 1, base: "...", baseToHiragana: "..." },
  ...
]
    `.trim(),
		config: {
			responseMimeType: "application/json",
			responseSchema: schema,
		},
	});

	const text = response.text;
	return text;
};
