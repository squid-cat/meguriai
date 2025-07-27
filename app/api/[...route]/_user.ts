import { Hono } from "hono";
import { getServerSession } from "next-auth";
import { authOptions, prisma } from "@/lib/auth-config";

const app = new Hono()
	// 現在のユーザー情報を取得
	.get("/me", async (c) => {
		try {
			// NextAuthセッションから現在のユーザーを取得
			const session = await getServerSession(authOptions);

			if (!session?.user?.email) {
				return c.json({ error: "Unauthorized" }, 401);
			}

			// データベースからユーザー情報を取得
			const user = await prisma.user.findUnique({
				where: {
					email: session.user.email,
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
				return c.json({ error: "User not found in database" }, 404);
			}

			return c.json({
				user,
				session: {
					name: session.user.name,
					email: session.user.email,
					image: session.user.image,
				},
			});
		} catch (error) {
			console.error("Get current user API error:", error);
			return c.json({ error: "Failed to fetch current user" }, 500);
		}
	})

	// 初回ログイン時のユーザーセットアップ
	.post("/setup", async (c) => {
		try {
			const session = await getServerSession(authOptions);

			if (!session?.user?.email) {
				return c.json({ error: "Unauthorized" }, 401);
			}

			const body = await c.req.json();
			const { name, avatarId } = body;

			if (!name || !avatarId) {
				return c.json({ error: "name and avatarId are required" }, 400);
			}

			// ユーザーが既に存在するかチェック
			const existingUser = await prisma.user.findUnique({
				where: {
					email: session.user.email,
				},
			});

			if (existingUser) {
				return c.json({ error: "User already exists" }, 409);
			}

			// 新しいユーザーを作成
			const user = await prisma.user.create({
				data: {
					email: session.user.email,
					name: name,
					avatarId: parseInt(avatarId),
				},
				select: {
					id: true,
					name: true,
					email: true,
					avatarId: true,
					createdAt: true,
				},
			});

			return c.json({
				message: "User setup completed successfully",
				user,
			});
		} catch (error) {
			console.error("User setup API error:", error);
			return c.json({ error: "Failed to setup user" }, 500);
		}
	})

	// ユーザーの認証状態確認
	.get("/status", async (c) => {
		try {
			const session = await getServerSession(authOptions);

			if (!session?.user?.email) {
				return c.json({
					authenticated: false,
					needsSetup: false,
					user: null,
				});
			}

			// データベースでユーザーを確認
			let user = await prisma.user.findUnique({
				where: {
					email: session.user.email,
				},
				select: {
					id: true,
					name: true,
					email: true,
					avatarId: true,
					createdAt: true,
				},
			});

			// ユーザーがデータベースに存在しない場合は自動作成
			if (!user) {
				user = await prisma.user.create({
					data: {
						email: session.user.email,
						name: session.user.name || "新規ユーザー",
						avatarId: 1, // デフォルトアバター
					},
					select: {
						id: true,
						name: true,
						email: true,
						avatarId: true,
						createdAt: true,
					},
				});
			}

			return c.json({
				authenticated: true,
				needsSetup: false,
				user: {
					id: user.id,
					name: user.name,
					email: user.email,
					avatarId: user.avatarId,
				},
			});
		} catch (error) {
			console.error("Auth status API error:", error);
			return c.json({ error: "Failed to check auth status" }, 500);
		}
	});

export default app;
