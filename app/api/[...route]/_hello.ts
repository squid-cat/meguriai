import { Hono } from "hono";

const app = new Hono().get("/", (c) =>
	c.json({ message: "Hello from Hono API (Next.js App Router)!" }),
);

export default app;
