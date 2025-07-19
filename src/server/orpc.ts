import { os } from "@orpc/server";
import type { ORPCContext } from "./context";

const base = os.$context<ORPCContext>();
export const pub = base;
export const authed = pub
	.errors({
		UNAUTHORIZED: {
			message: "認証してください。",
		},
	})
	.use(async ({ context, next, errors }) => {
		if (!context.session) {
			throw errors.UNAUTHORIZED();
		}

		return next({
			context: {
				session: context.session,
			},
		});
	});
