import { client } from "../utils/api-client";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function Home() {
  try {
    // 作成した client を使用
    const res = await client.hello.$get();
    const data = await res.json();

    return (
      <div>
        <h1>{data.message}</h1>
        <Button variant="outline" className="bg-blue-500 text-white">
          Click me
        </Button>
      </div>
    );
  } catch (error) {
    console.error("Error:", error);
    return <h1>データの取得に失敗しました</h1>;
  }
}
