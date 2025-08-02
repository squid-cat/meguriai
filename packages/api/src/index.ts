import { serve } from "@hono/node-server";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import hello from "./routes/hello";
import test from "./routes/test";

const app = new OpenAPIHono();

app.use("*", logger());
app.use("*", cors());

app.get("/", (c) => {
	return c.json({ message: "Meguriai API Server" });
});

app.get("/health", (c) => {
	return c.json({ status: "OK", timestamp: new Date().toISOString() });
});

// API routes
app.route("/api/hello", hello);
app.route("/api/test", test);

// OpenAPI documentation
app.doc("/doc", {
	openapi: "3.0.0",
	info: {
		title: "Meguriai API",
		version: "1.0.0",
		description: "Meguriai API Server",
	},
});

app.get("/swagger", swaggerUI({ url: "/doc" }));

const apiRoutes = app.basePath("/api");

export type AppType = typeof apiRoutes;

const port = Number(process.env.PORT) || 8000;

console.log(`🚀 Server is running on http://localhost:${port}`);

serve({
	fetch: app.fetch,
	port,
});
