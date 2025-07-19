"use client";
import { signIn } from "@/lib/auth-client";
import { Button } from "./ui/button";

export default function LoginButton() {
	return (
		<Button
			onClick={async () => {
				await signIn();
			}}
		>
			Twitterで始める
		</Button>
	);
}
