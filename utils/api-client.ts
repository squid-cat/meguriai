import { hc } from "hono/client";
import type { AppType } from "../app/api/[...route]/route";

function getBaseUrl(): string {
	// 環境変数が設定されていればそれを使用、なければ相対パス
	return process.env.NEXT_PUBLIC_API_BASE_URL || "";
}

// クライアントを作成する関数
export function createClient() {
	const baseUrl = getBaseUrl();
	return hc<AppType>(baseUrl).api;
}
