import { orpc } from "@/lib/orpc";
import { safe } from "@orpc/client";
import type { Session, User } from "better-auth";
import { headers } from "next/headers";
import GameUIWrapper from "./GameUIWrapper";

type Props = {
	userIcon: string | undefined;
	displayName: string;
	userName: string;
};
export default async function GameWrapper({ userIcon, displayName, userName }: Props) {
	const { data: tweets, error } = await safe(
		orpc.users.getTweetsByUserId(
			{},
			{
				context: {
					cache: "no-store",
					headers: await headers(),
				},
			},
		),
	);

	if (error) throw error;

	const sentences = tweets.map((tweet) => tweet.baseToHiragana);

	return (
		<GameUIWrapper
			userIcon={userIcon}
			userName={userName}
			displayName={displayName}
			tweets={tweets}
			sentences={sentences}
		/>
	);
}
