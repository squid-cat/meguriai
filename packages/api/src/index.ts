import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import hello from "./routes/hello";
import test from "./routes/test";

const app = new Hono();

app.use("*", logger());
app.use("*", cors());

app.get("/", (c) => {
	return c.json({ message: "Meguriai API Server" });
});

app.get("/health", (c) => {
	return c.json({ status: "OK", timestamp: new Date().toISOString() });
});

// API routes
const apiRoutes = app
	.basePath("/api")
	.route("/hello", hello)
	.route("/test", test);

export type AppType = typeof apiRoutes;

const port = Number(process.env.PORT) || 8000;

console.log(`🚀 Server is running on http://localhost:${port}`);

serve({
	fetch: app.fetch,
	port,
});
