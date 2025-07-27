import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// グローバルなPrismaクライアント（開発環境で複数インスタンス化を防ぐ）
const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID || "",
			clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
		}),
	],
	callbacks: {
		async session({ session, user }) {
			// データベースからユーザー情報を取得してセッションに含める
			if (session.user && user?.id) {
				try {
					const dbUser = await prisma.user.findUnique({
						where: { id: user.id },
						select: {
							id: true,
							name: true,
							email: true,
							avatarId: true,
						},
					});

					if (dbUser) {
						(session.user as any) = {
							...session.user,
							id: dbUser.id,
							name: dbUser.name || session.user.name,
							email: dbUser.email || session.user.email,
							avatarId: dbUser.avatarId || 1,
						};
					}
				} catch (error) {
					console.error("Failed to fetch user data for session:", error);
					// エラーが発生してもセッションは返す
					(session.user as any) = {
						...session.user,
						id: user.id,
						avatarId: 1,
					};
				}
			}
			return session;
		},
		async signIn() {
			return true;
		},
	},
};
