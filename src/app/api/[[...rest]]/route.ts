import { initialORPCContext } from "@/server/context";
import { router } from "@/server/routers";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { onError } from "@orpc/server";
import {
	experimental_ZodSmartCoercionPlugin as ZodSmartCoercionPlugin,
	ZodToJsonSchemaConverter,
} from "@orpc/zod/zod4";

const openAPIHandler = new OpenAPIHandler(router, {
	interceptors: [
		onError((error) => {
			console.error(error);
		}),
	],
	plugins: [
		new ZodToJsonSchemaConverter(),
		new OpenAPIReferencePlugin({
			schemaConverters: [new ZodToJsonSchemaConverter()],
			specGenerateOptions: {
				info: {
					title: "Typing API",
					version: "1.0.0",
				},
			},
			docsPath: "/doc",
			specPath: "/doc/spec.json",
		}),
	],
});

async function handleRequest(request: Request) {
	const { response } = await openAPIHandler.handle(request, {
		prefix: "/api",
		context: await initialORPCContext(),
	});

	return response ?? new Response("Not found", { status: 404 });
}

export const HEAD = handleRequest;
export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
