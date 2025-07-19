import { auth } from "@/auth";
import LoginButton from "@/components/top/LoginButton";
import SettingsDialogWrapper from "@/components/top/SettingsDialogWrapper";
import { Button } from "@/components/ui/button";
import { headers } from "next/headers";
import Link from "next/link";

export default async function Page() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	return (
		<div className="flex h-screen items-center justify-center">
			{/* {session && <SettingsDialogWrapper />} */}
			<div className="text-center">
				<h2 className="mb-4 font-bold text-7xl">MYPING</h2>
				<p className="mb-10">自分の過去のツイートでタイピング 練習することができます</p>
				{session ? (
					<Button asChild size="lg" className="cursor-pointer rounded-full">
						<Link href="/game">ゲームスタート</Link>
					</Button>
				) : (
					<LoginButton />
				)}
			</div>
		</div>
	);
}
