import { HttpResponse, http } from "msw";

// モックデータ
const members = [
	{ id: "1", name: "田中太郎", avatar: null },
	{ id: "2", name: "佐藤花子", avatar: null },
	{ id: "3", name: "山田次郎", avatar: null },
	{ id: "4", name: "鈴木美咲", avatar: null },
];

const messages: Array<{
	id: string;
	from: { id: string; name: string; avatar: string | null };
	to: Array<{ id: string; name: string; avatar: string | null }>;
	message: string;
	createdAt: string;
}> = [];

export const handlers = [
	// チームメンバー一覧取得
	http.get("/api/members", () => {
		return HttpResponse.json(members);
	}),

	// 感謝メッセージ送信
	http.post("/api/messages", async ({ request }) => {
		const body = (await request.json()) as {
			to: string[];
			message: string;
			from: string;
		};

		const fromMember = members.find((m) => m.id === body.from);
		const toMembers = members.filter((m) => body.to.includes(m.id));

		if (!fromMember || toMembers.length === 0) {
			return HttpResponse.json(
				{ error: "送信者または受信者が見つかりません" },
				{ status: 400 },
			);
		}

		const newMessage = {
			id: crypto.randomUUID(),
			from: fromMember,
			to: toMembers,
			message: body.message,
			createdAt: new Date().toISOString(),
		};

		messages.push(newMessage);

		return HttpResponse.json(newMessage, { status: 201 });
	}),

	// メッセージ一覧取得
	http.get("/api/messages", ({ request }) => {
		const url = new URL(request.url);
		const userId = url.searchParams.get("userId");

		if (!userId) {
			return HttpResponse.json(messages);
		}

		// 特定ユーザーが関与するメッセージのみ
		const userMessages = messages.filter(
			(msg) => msg.from.id === userId || msg.to.some((to) => to.id === userId),
		);

		return HttpResponse.json(userMessages);
	}),

	// 新着メッセージ確認（受信者向け）
	http.get("/api/messages/new", ({ request }) => {
		const url = new URL(request.url);
		const userId = url.searchParams.get("userId");
		const since = url.searchParams.get("since");

		if (!userId) {
			return HttpResponse.json([]);
		}

		let filteredMessages = messages.filter((msg) =>
			msg.to.some((to) => to.id === userId),
		);

		// since パラメータがある場合は、それ以降のメッセージのみ
		if (since) {
			filteredMessages = filteredMessages.filter(
				(msg) => new Date(msg.createdAt) > new Date(since),
			);
		}

		return HttpResponse.json(filteredMessages);
	}),
];
