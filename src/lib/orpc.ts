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
	headers?: Headers;
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
	fetch: async (request, init, { context }) => {
		const finalHeaders = new Headers((init as RequestInit).headers);
		if (context?.headers) {
			context.headers.forEach((value, key) => {
				finalHeaders.set(key, value);
			});
		}

		return globalThis.fetch(request, {
			...init,
			headers: finalHeaders,
			cache: context?.cache,
			...(context?.next ? { next: context.next } : {}),
		});
	},
});

export const orpc: RouterClient<typeof router, ClientContext> = createORPCClient(link);
