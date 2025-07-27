import { Hono } from "hono";
import { prisma } from "@/lib/auth-config";

const app = new Hono()
	// 特定ユーザーの情報を取得
	.get("/:userId", async (c) => {
		try {
			const userId = c.req.param("userId");

			const user = await prisma.user.findUnique({
				where: {
					id: userId,
				},
				select: {
					id: true,
					name: true,
					email: true,
					avatarId: true,
					createdAt: true,
					updatedAt: true,
				},
			});

			if (!user) {
				return c.json({ error: "User not found" }, 404);
			}

			return c.json({ user });
		} catch (error) {
			console.error("Get user API error:", error);
			return c.json({ error: "Failed to fetch user" }, 500);
		}
	})

	// ユーザー情報を更新
	.put("/:userId", async (c) => {
		try {
			const userId = c.req.param("userId");
			const body = await c.req.json();
			const { name, avatarId } = body;

			if (!name) {
				return c.json({ error: "name is required" }, 400);
			}

			const user = await prisma.user.update({
				where: {
					id: userId,
				},
				data: {
					name: name,
					avatarId: avatarId ? parseInt(avatarId) : undefined,
				},
				select: {
					id: true,
					name: true,
					email: true,
					avatarId: true,
					updatedAt: true,
				},
			});

			return c.json({
				message: "User updated successfully",
				user,
			});
		} catch (error) {
			console.error("Update user API error:", error);
			return c.json({ error: "Failed to update user" }, 500);
		}
	})

	// ユーザーの今日の統計を取得
	.get("/:userId/today", async (c) => {
		try {
			const userId = c.req.param("userId");

			const today = new Date();
			today.setHours(0, 0, 0, 0);
			const tomorrow = new Date(today);
			tomorrow.setDate(tomorrow.getDate() + 1);

			const todayRecords = await prisma.workRecord.findMany({
				where: {
					userId: userId,
					recordedAt: {
						gte: today,
						lt: tomorrow,
					},
				},
				select: {
					recordType: true,
					workMinutes: true,
				},
			});

			const totalMinutes = todayRecords.reduce(
				(sum, record) => sum + record.workMinutes,
				0,
			);
			const pomodoroCount = todayRecords.filter(
				(record) => record.recordType === "POMODORO",
			).length;
			const manualCount = todayRecords.filter(
				(record) => record.recordType === "MANUAL",
			).length;

			return c.json({
				date: today.toISOString().split("T")[0],
				totalMinutes,
				pomodoroCount,
				manualCount,
				totalRecords: todayRecords.length,
			});
		} catch (error) {
			console.error("Get user today stats API error:", error);
			return c.json({ error: "Failed to fetch today's stats" }, 500);
		}
	})

	// 全ユーザー一覧を取得
	.get("/", async (c) => {
		try {
			const limit = parseInt(c.req.query("limit") || "50");
			const offset = parseInt(c.req.query("offset") || "0");

			const users = await prisma.user.findMany({
				select: {
					id: true,
					name: true,
					avatarId: true,
					createdAt: true,
				},
				orderBy: {
					createdAt: "desc",
				},
				take: limit,
				skip: offset,
			});

			return c.json({
				users,
				total: users.length,
			});
		} catch (error) {
			console.error("Get users API error:", error);
			return c.json({ error: "Failed to fetch users" }, 500);
		}
	});

export default app;
