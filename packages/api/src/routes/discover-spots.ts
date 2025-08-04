import Anthropic from "@anthropic-ai/sdk";
import { OpenAPIHono } from "@hono/zod-openapi";
import { z } from "zod";

const anthropic = new Anthropic({
	apiKey: process.env.ANTHROPIC_API_KEY,
});

const app = new OpenAPIHono();

// リクエストスキーマ
const DiscoverSpotsRequestSchema = z.object({
	destination: z.string().min(1, "行き先を入力してください"),
	duration: z.string().min(1, "期間を選択してください"),
	budget: z.string().min(1, "予算を選択してください"),
	chaosLevel: z.number().min(1).max(5),
	avoidTouristSpots: z.boolean(),
	avoidJapaneseServices: z.boolean(),
	avoidCrowdedAreas: z.boolean(),
});

// 隠れ名所スキーマ
const HiddenSpotSchema = z.object({
	id: z.number(),
	name: z.string(),
	type: z.string(),
	description: z.string(),
	localRating: z.number(),
	reviewsCount: z.number(),
	language: z.string(),
	priceRange: z.string(),
	specialty: z.string(),
	image: z.string(),
});

// 旅程スキーマ
const ActivitySchema = z.object({
	time: z.string(),
	activity: z.string(),
	type: z.string(),
});

const ItineraryDaySchema = z.object({
	date: z.string(),
	day: z.number(),
	title: z.string(),
	activities: z.array(ActivitySchema),
});

// レスポンススキーマ
const DiscoverSpotsResponseSchema = z.object({
	tripData: z.object({
		destination: z.string(),
		duration: z.string(),
		chaosLevel: z.number(),
		totalSpots: z.number(),
		hiddenSpots: z.number(),
		localRating: z.number(),
	}),
	hiddenSpots: z.array(HiddenSpotSchema),
	itinerary: z.array(ItineraryDaySchema),
});

// OpenAPIルート定義
app.openapi(
	{
		method: "post",
		path: "/discover-spots",
		request: {
			body: {
				content: {
					"application/json": {
						schema: DiscoverSpotsRequestSchema,
					},
				},
			},
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: DiscoverSpotsResponseSchema,
					},
				},
				description: "隠れ名所の発見に成功",
			},
			400: {
				description: "リクエストが無効",
			},
			500: {
				description: "サーバーエラー",
			},
		},
		tags: ["Travel"],
	},
	async (c) => {
		try {
			const requestData = c.req.valid("json");

			// Anthropic APIキーが設定されているかチェック
			if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === "your_anthropic_api_key_here") {
				console.error("Anthropic APIキーが設定されていません");
				return c.json({ error: "AI APIが設定されていないため、隠れ名所を検索できませんでした。" }, 500);
			}

			// Anthropic APIへのプロンプト作成
			const prompt = createDiscoveryPrompt(requestData);

			// Anthropic APIに隠れ名所発見を依頼
			const completion = await anthropic.messages.create({
				model: "claude-3-5-sonnet-20241022",
				max_tokens: 3000,
				temperature: 0.8,
				system:
					"あなたは現地の隠れ名所に詳しい旅行エキスパートです。観光地化されていない、現地人だけが知る真の隠れ名所を提案してください。日本語で回答してください。",
				messages: [
					{
						role: "user",
						content: prompt,
					},
				],
			});

			const aiResponse =
				completion.content[0]?.type === "text"
					? completion.content[0].text
					: null;

			if (!aiResponse) {
				throw new Error("Anthropic APIからの応答が取得できませんでした");
			}

			// AI応答をログ出力
			console.log("AI応答:", aiResponse);

			// AIの応答を解析して構造化データに変換
			const structuredData = parseAIResponse(aiResponse, requestData);

			return c.json(structuredData);
		} catch (error) {
			console.error("隠れ名所発見エラー:", error);
			console.error("エラー詳細:", error instanceof Error ? error.message : "不明なエラー");
			
			return c.json({ error: "隠れ名所の検索中にエラーが発生しました。しばらく時間をおいてからお試しください。" }, 500);
		}
	},
);

// プロンプト作成関数
function createDiscoveryPrompt(
	requestData: z.infer<typeof DiscoverSpotsRequestSchema>,
): string {
	const chaosDescriptions = [
		"安全で予測可能な",
		"軽い冒険を含む",
		"バランスの取れた",
		"冒険重視の予測不可能な",
		"完全にカオスで何が起こるか分からない",
	];

	const chaosDescription = chaosDescriptions[requestData.chaosLevel - 1];

	return `
${requestData.destination}での${requestData.duration}の旅行で、${chaosDescription}隠れ名所を発見してください。

条件:
- 予算: ${requestData.budget}
- カオス度: ${requestData.chaosLevel}/5
- 有名観光地を避ける: ${requestData.avoidTouristSpots ? "はい" : "いいえ"}
- 日本語対応店舗を避ける: ${requestData.avoidJapaneseServices ? "はい" : "いいえ"}
- 混雑エリアを避ける: ${requestData.avoidCrowdedAreas ? "はい" : "いいえ"}

以下のJSONスキーマに従って、厳密にJSON形式で回答してください。他のテキストは一切含めないでください:

{
  "hiddenSpots": [
    {
      "id": 1,
      "name": "現地語での名前（英語併記も可）",
      "type": "レストラン/自然スポット/市場/工芸体験/歴史スポット",
      "description": "200文字程度の詳細説明",
      "localRating": 4.5から4.9の数値,
      "reviewsCount": 20から150の整数,
      "language": "使用言語の説明",
      "priceRange": "価格帯",
      "specialty": "特色や専門性",
      "image": "その場所に適したUnsplash画像URL（https://images.unsplash.com/photo-xxxxx?w=600&h=400&fit=crop&auto=format&q=80形式）"
    }
  ],
  "itinerary": [
    {
      "date": "YYYY-MM-DD形式",
      "day": 日数の数値,
      "title": "その日のテーマ",
      "activities": [
        {
          "time": "HH:MM",
          "activity": "活動内容",
          "type": "移動/食事/探索/体験/冒険/準備"
        }
      ]
    }
  ]
}

条件:
- hiddenSpotsは必ず3つ提案
- itineraryは2日間分作成
- 現地語のレビューのみで高評価のスポット
- 観光客がほとんど知らない場所
- 現地人に愛され続けている場所
- 独特の体験ができる場所
- 名前は現地語で提案し、可能であれば英語併記
- 画像は実際のUnsplash画像IDを使用（例: photo-1234567890123）
- 各スポットのタイプに適した高品質な画像を選択

必ずJSONのみを返してください。説明文やその他のテキストは含めないでください。
`;
}

// AI応答の解析と構造化
function parseAIResponse(
	aiResponse: string,
	requestData: z.infer<typeof DiscoverSpotsRequestSchema>,
) {
	try {
		// AIがJSONで返した場合の解析
		const parsedResponse = JSON.parse(aiResponse);

		// AIの応答にtripDataを追加
		const result = {
			tripData: {
				destination: requestData.destination,
				duration: requestData.duration,
				chaosLevel: requestData.chaosLevel,
				totalSpots: parsedResponse.hiddenSpots?.length || 3,
				hiddenSpots: parsedResponse.hiddenSpots?.length || 3,
				localRating:
					parsedResponse.hiddenSpots?.reduce(
						(sum: number, spot: any) => sum + spot.localRating,
						0,
					) / (parsedResponse.hiddenSpots?.length || 1) || 4.7,
			},
			hiddenSpots: parsedResponse.hiddenSpots || [],
			itinerary: parsedResponse.itinerary || [],
		};

		return result;
	} catch (error) {
		console.error("JSON解析エラー:", error);
		console.error("AI応答:", aiResponse);

		// JSON解析に失敗した場合はエラーを投げる
		throw new Error("AIからの応答を解析できませんでした");
	}
}


export default app;
