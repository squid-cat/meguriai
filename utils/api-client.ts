import { hc } from "hono/client";
import type { AppType } from "@/app/api/[...route]/route";

function getBaseURL(): string {
	// ブラウザ環境では相対パスを使用（同一オリジンのAPI呼び出し）
	if (typeof window !== "undefined") {
		return "";
	}
	
	// サーバーサイドでは絶対URLが必要
	// 本番環境ではNEXTAUTH_URL、開発環境ではlocalhost
	if (process.env.NODE_ENV === "production") {
		return process.env.NEXTAUTH_URL || "https://meguriai-squid-pom.up.railway.app";
	} else {
		return "http://localhost:3000";
	}
}

export const client = hc<AppType>(getBaseURL());
