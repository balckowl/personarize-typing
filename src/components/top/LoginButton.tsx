"use client";
import { authClient } from "@/lib/auth-client";
import { Loader2, Twitter } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

export default function LoginButton() {
	const [isLoading, setIsLoading] = useState(false);

	const handleSignIn = async () => {
		setIsLoading(true);
		try {
			await authClient.signIn.social({
				provider: "twitter",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Button
			className="mx-auto flex cursor-pointer items-center rounded-full"
			size="lg"
			onClick={handleSignIn}
			disabled={isLoading}
		>
			{isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Twitter className="h-5 w-5" />}
			で始める
		</Button>
	);
}
