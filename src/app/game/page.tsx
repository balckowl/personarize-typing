import { auth } from "@/auth";
import GameWrapper from "@/components/game/GameWrapper";
import { Loader2 } from "lucide-react";
import { headers } from "next/headers";
import { Suspense } from "react";

export default async function Page() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		return <div>認証してください。</div>;
	}

	return (
		<Suspense
			fallback={
				<div className="flex h-screen items-center justify-center">
					<Loader2 className="h-15 w-15 animate-spin" />
				</div>
			}
		>
			<GameWrapper
				userIcon={session.user.image ?? ""}
				userName={session.user.username}
				displayName={session.user.name}
			/>
		</Suspense>
	);
}
