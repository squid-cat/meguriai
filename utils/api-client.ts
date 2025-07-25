import { hc } from "hono/client";
import type { AppType } from "../app/api/[...route]/route";

function getBaseUrl(): string {
	// 開発環境では環境変数を使用
	if (process.env.NODE_ENV === 'development') {
		return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
	}
	
	// 本番環境ではクライアント側で動的に取得
	if (typeof window !== "undefined") {
		return window.location.origin;
	}
	
	// サーバー側（SSR）では相対パスを使用
	return "";
}

// クライアントを作成する関数
export function createClient() {
	const baseUrl = getBaseUrl();
	return hc<AppType>(baseUrl).api;
}
