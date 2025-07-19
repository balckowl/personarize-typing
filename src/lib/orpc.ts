import { env } from "@/env";
import type { router } from "@/server/routers";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import type { headers } from "next/headers";

declare global {
	var $headers: typeof headers;
}

type ClientContext = {
	cache?: RequestCache;
	next?: {
		revalidate?: number | false;
		tags?: string[];
	};
};

const link = new RPCLink<ClientContext>({
	url: `${env.NEXT_PUBLIC_APP_URL}/rpc`,
	headers: async () => {
		return globalThis.$headers
			? Object.fromEntries(await globalThis.$headers()) // use this on ssr
			: {}; // use this on browser
	},
	method: ({ context }) => {
		if (context?.cache || context?.next) {
			return "GET";
		}
		return "POST";
	},
	fetch: async (request, init, { context }) =>
		globalThis.fetch(request, {
			...init,
			cache: context?.cache,
			...(context?.next ? { next: context.next } : {}),
		}),
});

export const orpc: RouterClient<typeof router, ClientContext> = createORPCClient(link);
