import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { serve } from "@hono/node-server";

const app = new Hono();

app.use("*", logger());
app.use("*", cors());

app.get("/", (c) => {
	return c.json({ message: "Hello from Hono API!" });
});

app.get("/health", (c) => {
	return c.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.get("/api/users", (c) => {
	return c.json({
		users: [
			{ id: 1, name: "太郎", email: "taro@example.com" },
			{ id: 2, name: "花子", email: "hanako@example.com" },
		],
	});
});

const port = Number(process.env.PORT) || 8000;

console.log(`🚀 Server is running on http://localhost:${port}`);

serve({
	fetch: app.fetch,
	port,
});