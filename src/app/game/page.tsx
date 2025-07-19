import { auth } from "@/auth";
import GameUIWrapper from "@/components/game/GameUIWrapper";
import { orpc } from "@/lib/orpc";
import { safe } from "@orpc/client";
import { headers } from "next/headers";

export default async function Page() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		return <div>認証してください。</div>;
	}

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
			userIcon={session.user.image ?? ""}
			userName={session.user.username}
			displayName={session.user.name}
			tweets={tweets}
			sentences={sentences}
		/>
	);
}
