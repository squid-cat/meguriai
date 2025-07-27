import { Hono } from "hono";
import { prisma } from "@/lib/auth-config";

const app = new Hono()
	// アバター一覧を取得
	.get("/", async (c) => {
		try {
			const avatars = await prisma.avatar.findMany({
				orderBy: {
					id: "asc",
				},
				select: {
					id: true,
					name: true,
					svgPath: true,
					category: true,
				},
			});

			return c.json({ avatars });
		} catch (error) {
			console.error("Get avatars API error:", error);
			return c.json({ error: "Failed to fetch avatars" }, 500);
		}
	})

	// 特定のアバターを取得
	.get("/:avatarId", async (c) => {
		try {
			const avatarId = parseInt(c.req.param("avatarId"));

			if (Number.isNaN(avatarId)) {
				return c.json({ error: "Invalid avatar ID" }, 400);
			}

			const avatar = await prisma.avatar.findUnique({
				where: {
					id: avatarId,
				},
				select: {
					id: true,
					name: true,
					svgPath: true,
					category: true,
				},
			});

			if (!avatar) {
				return c.json({ error: "Avatar not found" }, 404);
			}

			return c.json({ avatar });
		} catch (error) {
			console.error("Get avatar API error:", error);
			return c.json({ error: "Failed to fetch avatar" }, 500);
		}
	})

	// アバターの初期データを作成
	.post("/initialize", async (c) => {
		try {
			// 既存のアバターがあるかチェック
			const existingCount = await prisma.avatar.count();

			if (existingCount > 0) {
				return c.json({
					message: "Avatars already initialized",
					count: existingCount,
				});
			}

			// アバターデータを作成
			const avatarsData = [
				{
					id: 1,
					name: "人間（茶髪）",
					svgPath: "/images/avatars/human-1.svg",
					category: "human",
				},
				{
					id: 2,
					name: "人間（金髪）",
					svgPath: "/images/avatars/human-2.svg",
					category: "human",
				},
				{
					id: 3,
					name: "オレンジ猫",
					svgPath: "/images/avatars/cat-1.svg",
					category: "cat",
				},
				{
					id: 4,
					name: "黒猫",
					svgPath: "/images/avatars/cat-2.svg",
					category: "cat",
				},
				{
					id: 5,
					name: "茶色い犬",
					svgPath: "/images/avatars/dog-1.svg",
					category: "dog",
				},
				{
					id: 6,
					name: "白い犬",
					svgPath: "/images/avatars/dog-2.svg",
					category: "dog",
				},
				{
					id: 7,
					name: "うさぎ",
					svgPath: "/images/avatars/rabbit-1.svg",
					category: "rabbit",
				},
				{
					id: 8,
					name: "くま",
					svgPath: "/images/avatars/bear-1.svg",
					category: "bear",
				},
				{
					id: 9,
					name: "パンダ",
					svgPath: "/images/avatars/panda-1.svg",
					category: "panda",
				},
				{
					id: 10,
					name: "きつね",
					svgPath: "/images/avatars/fox-1.svg",
					category: "fox",
				},
			];

			const createdAvatars = await Promise.all(
				avatarsData.map((avatar) =>
					prisma.avatar.create({
						data: avatar,
					}),
				),
			);

			return c.json({
				message: "Avatars initialized successfully",
				count: createdAvatars.length,
				avatars: createdAvatars,
			});
		} catch (error) {
			console.error("Initialize avatars API error:", error);
			return c.json({ error: "Failed to initialize avatars" }, 500);
		}
	});

export default app;
