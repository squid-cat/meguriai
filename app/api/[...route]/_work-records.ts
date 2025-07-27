import { Hono } from "hono";
import { prisma } from "@/lib/auth-config";

const app = new Hono()
	// ユーザーの作業記録を取得
	.get("/", async (c) => {
		try {
			const userId = c.req.query("userId");
			const limit = parseInt(c.req.query("limit") || "20");
			const offset = parseInt(c.req.query("offset") || "0");

			if (!userId) {
				return c.json({ error: "userId is required" }, 400);
			}

			const records = await prisma.workRecord.findMany({
				where: {
					userId: userId,
				},
				orderBy: {
					recordedAt: "desc",
				},
				take: limit,
				skip: offset,
				select: {
					id: true,
					recordType: true,
					workMinutes: true,
					memo: true,
					recordedAt: true,
				},
			});

			return c.json({
				records,
				total: records.length,
			});
		} catch (error) {
			console.error("Get work records API error:", error);
			return c.json({ error: "Failed to fetch work records" }, 500);
		}
	})

	// 手動で作業記録を作成
	.post("/", async (c) => {
		try {
			const body = await c.req.json();
			const { userId, workPoints, memo } = body;

			if (!userId || !workPoints) {
				return c.json({ error: "userId and workPoints are required" }, 400);
			}

			const record = await prisma.workRecord.create({
				data: {
					userId: userId,
					recordType: "MANUAL",
					workMinutes: parseInt(workPoints),
					memo: memo,
					recordedAt: new Date(),
				},
				select: {
					id: true,
					recordType: true,
					workMinutes: true,
					memo: true,
					recordedAt: true,
				},
			});

			return c.json({
				message: "Work record created successfully",
				record,
			});
		} catch (error) {
			console.error("Create work record API error:", error);
			return c.json({ error: "Failed to create work record" }, 500);
		}
	})

	// ポモドーロセッション完了の記録
	.post("/pomodoro-complete", async (c) => {
		try {
			const body = await c.req.json();
			const { userId, workPoints } = body;

			if (!userId || !workPoints) {
				return c.json({ error: "userId and workPoints are required" }, 400);
			}

			const record = await prisma.workRecord.create({
				data: {
					userId: userId,
					recordType: "POMODORO",
					workMinutes: parseInt(workPoints),
					recordedAt: new Date(),
				},
				select: {
					id: true,
					recordType: true,
					workMinutes: true,
					recordedAt: true,
				},
			});

			return c.json({
				message: "Pomodoro session recorded successfully",
				record,
			});
		} catch (error) {
			console.error("Record pomodoro completion API error:", error);
			return c.json({ error: "Failed to record pomodoro completion" }, 500);
		}
	})

	// ユーザーの作業統計を取得
	.get("/stats/:userId", async (c) => {
		try {
			const userId = c.req.param("userId");

			if (!userId) {
				return c.json({ error: "userId is required" }, 400);
			}

			// 過去7日間の統計
			const sevenDaysAgo = new Date();
			sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

			const records = await prisma.workRecord.findMany({
				where: {
					userId: userId,
					recordedAt: {
						gte: sevenDaysAgo,
					},
				},
				select: {
					recordType: true,
					workMinutes: true,
					recordedAt: true,
				},
			});

			// 統計を計算
			const totalMinutes = records.reduce(
				(sum, record) => sum + record.workMinutes,
				0,
			);
			const pomodoroCount = records.filter(
				(record) => record.recordType === "POMODORO",
			).length;
			const manualCount = records.filter(
				(record) => record.recordType === "MANUAL",
			).length;

			// 日別の作業時間
			const dailyStats = records.reduce(
				(
					acc: Record<
						string,
						{ totalMinutes: number; pomodoroCount: number; manualCount: number }
					>,
					record,
				) => {
					const date = record.recordedAt.toISOString().split("T")[0];
					if (!acc[date]) {
						acc[date] = { totalMinutes: 0, pomodoroCount: 0, manualCount: 0 };
					}
					acc[date].totalMinutes += record.workMinutes;
					if (record.recordType === "POMODORO") {
						acc[date].pomodoroCount++;
					} else {
						acc[date].manualCount++;
					}
					return acc;
				},
				{},
			);

			return c.json({
				totalMinutes,
				pomodoroCount,
				manualCount,
				workDays: Object.keys(dailyStats).length,
				dailyStats,
			});
		} catch (error) {
			console.error("Get work stats API error:", error);
			return c.json({ error: "Failed to fetch work stats" }, 500);
		}
	});

export default app;
