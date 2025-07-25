import { hc } from "hono/client";
import { headers } from "next/headers";
import type { AppType } from "../app/api/[...route]/route";

async function getBaseUrl(): Promise<string> {
  // クライアント側の場合
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  
  // サーバー側の場合
  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = headersList.get('x-forwarded-proto') || 'http';
  return `${protocol}://${host}`;
}

// 非同期でクライアントを作成する関数
export async function createClient() {
  const baseUrl = await getBaseUrl();
  return hc<AppType>(baseUrl).api;
}
