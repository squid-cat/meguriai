import { client } from "../utils/api-client";

export const dynamic = "force-dynamic";

export default async function Home() {
  try {
    // 作成した client を使用
    const res = await client.hello.$get();
    const data = await res.json();
    
    return <h1>{data.message}</h1>;
  } catch (error) {
    console.error("Error:", error);
    return <h1>データの取得に失敗しました</h1>;
  }
}
