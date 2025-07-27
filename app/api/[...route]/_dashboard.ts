import { Hono } from "hono";
import { prisma } from "@/lib/auth-config";

const app = new Hono()
	// 今日の総作業ポイントとアクティブユーザーを取得
	.get("/", async (c) => {
		try {
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			const tomorrow = new Date(today);
			tomorrow.setDate(tomorrow.getDate() + 1);

			// 今日の作業記録から総ポイントを計算
			const todayRecords = await prisma.workRecord.findMany({
				where: {
					recordedAt: {
						gte: today,
						lt: tomorrow,
					},
				},
				select: {
					workMinutes: true,
				},
			});

			const totalPoints = todayRecords.reduce(
				(sum, record) => sum + record.workMinutes,
				0,
			);

			// 今日アクティブなユーザーを取得（作業記録がある人）
			const activeUsers = await prisma.user.findMany({
				where: {
					workRecords: {
						some: {
							recordedAt: {
								gte: today,
								lt: tomorrow,
							},
						},
					},
				},
				select: {
					id: true,
					name: true,
					avatarId: true,
				},
				take: 10, // 最大10人まで表示
			});

			// レスポンス形式を調整
			const formattedActiveUsers = activeUsers.map((user) => ({
				id: user.id,
				name: user.name || "未設定",
				avatarId: user.avatarId,
			}));

			return c.json({
				totalPoints,
				activeUsers: formattedActiveUsers,
				date: today.toISOString().split("T")[0],
			});
		} catch (error) {
			console.error("Dashboard API error:", error);
			return c.json({ error: "Failed to fetch dashboard data" }, 500);
		}
	})

	// 日別統計の更新
	.post("/update-stats", async (c) => {
		try {
			const today = new Date();
			today.setHours(0, 0, 0, 0);

			// 今日の統計を更新（まだ統計機能は未実装）
			return c.json({
				message: "Stats update functionality not implemented yet",
			});
		} catch (error) {
			console.error("Update stats API error:", error);
			return c.json({ error: "Failed to update stats" }, 500);
		}
	});

export default app;
