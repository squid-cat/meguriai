import { PrismaClient } from "@prisma/client";
import { Hono } from "hono";

const prisma = new PrismaClient();

const app = new Hono()
	.get("/", async (c) => {
		const tests = await prisma.test.findMany({
			orderBy: { createdAt: "desc" },
		});
		return c.json({ tests });
	})
	.post("/", async (c) => {
		const body = await c.req.json();
		const test = await prisma.test.create({
			data: {
				text: body.text,
			},
		});

		return c.json({ message: "created", test });
	});

export default app;
