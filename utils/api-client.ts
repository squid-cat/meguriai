import { hc } from "hono/client";
import type { AppType } from "@/app/api/[...route]/route";

function getBaseURL(): string {
	// ブラウザ環境では環境変数または相対パスを使用
	if (typeof window !== "undefined") {
		return process.env.NEXT_PUBLIC_API_BASE_URL || "";
	}
	
	// サーバーサイドでは環境変数を使用
	return process.env.NEXTAUTH_URL || "http://localhost:3000";
}

export const client = hc<AppType>(getBaseURL());
