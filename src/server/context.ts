import { auth } from "@/auth";
import { db } from "@/db";
import { headers } from "next/headers";

export const initialORPCContext = async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	return {
		session,
		db,
	};
};

export type ORPCContext = Awaited<ReturnType<typeof initialORPCContext>>;
