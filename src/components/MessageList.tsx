"use client";

import type { GratitudeMessage } from "../types";

interface MessageListProps {
	messages: GratitudeMessage[];
	currentUserId: string;
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
	if (messages.length === 0) {
		return (
			<div className="text-center py-16">
				<div className="mb-8">
					<div className="w-20 h-20 mx-auto bg-gradient-to-r from-orange-100 to-pink-100 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
						<span className="text-3xl">😊</span>
					</div>
				</div>
				<p className="text-xl font-bold text-slate-700 mb-3">
					まだメッセージがありません
				</p>
				<p className="text-slate-500 text-lg">最初の「ありがとう」を送ってみましょう！</p>
			</div>
		);
	}

	// メッセージを新しい順に並び替え
	const sortedMessages = [...messages].sort(
		(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
	);

	return (
		<div className="space-y-4">
			{sortedMessages.map((message) => {
				const isFromCurrentUser = message.from.id === currentUserId;
				const isToCurrentUser = message.to.some(
					(member) => member.id === currentUserId,
				);

				return (
					<div
						key={message.id}
						className={`
              border-2 rounded-3xl p-6 transition-all hover:shadow-xl transform hover:scale-105 backdrop-blur-md
              ${
								isFromCurrentUser
									? "bg-gradient-to-br from-orange-100/80 via-pink-100/80 to-orange-50/80 border-orange-300 shadow-xl"
									: isToCurrentUser
										? "bg-gradient-to-br from-purple-100/80 via-pink-100/80 to-purple-50/80 border-purple-300 shadow-xl"
										: "bg-gradient-to-br from-orange-50/60 to-pink-50/60 border-orange-200 shadow-md"
							}
            `}
					>
						{/* メッセージヘッダー */}
						<div className="flex items-start justify-between mb-4">
							<div className="flex items-center">
								{/* 送信者アバター */}
								{message.from.avatar ? (
									<img
										src={message.from.avatar}
										alt={message.from.name}
										className="w-10 h-10 rounded-full mr-3"
									/>
								) : (
									<div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full mr-3 flex items-center justify-center shadow-lg">
										<span className="text-white font-semibold text-sm">
											{message.from.name.charAt(0)}
										</span>
									</div>
								)}

								<div>
									<div className="flex items-center space-x-2">
										<span className="font-semibold text-slate-800">
											{message.from.name}
										</span>
										<span className="text-slate-400">→</span>
										<span className="text-sm text-slate-600">
											{message.to.map((member) => member.name).join("、")}
										</span>
									</div>
									<div className="text-sm text-slate-500 mt-1">
										{new Date(message.createdAt).toLocaleString("ja-JP", {
											year: "numeric",
											month: "short",
											day: "numeric",
											hour: "2-digit",
											minute: "2-digit",
										})}
									</div>
								</div>
							</div>

							{/* メッセージタイプインジケーター */}
							<div className="flex items-center space-x-1">
								{isFromCurrentUser && (
									<span className="px-2 py-1 bg-gradient-to-r from-orange-100 to-pink-100 text-orange-700 text-xs font-medium rounded-full border border-orange-200">
										送信済み
									</span>
								)}
								{isToCurrentUser && !isFromCurrentUser && (
									<span className="px-2 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-xs font-medium rounded-full border border-purple-200">
										受信
									</span>
								)}
							</div>
						</div>

						{/* メッセージ内容 */}
						<div className="ml-13">
							<div className="bg-gradient-to-r from-white/80 to-pink-50/80 border-2 border-orange-200 p-4 rounded-2xl backdrop-blur-sm shadow-inner">
								<p className="text-slate-800 leading-relaxed whitespace-pre-wrap font-medium">
									{message.message}
								</p>
							</div>
						</div>

						{/* 受信者リスト（複数人の場合の詳細表示） */}
						{message.to.length > 1 && (
							<div className="ml-13 mt-3">
								<div className="flex flex-wrap gap-2">
									{message.to.map((member) => (
										<div
											key={member.id}
											className="flex items-center bg-slate-100 rounded-full px-3 py-1 border border-slate-200"
										>
											{member.avatar ? (
												<img
													src={member.avatar}
													alt={member.name}
													className="w-4 h-4 rounded-full mr-2"
												/>
											) : (
												<div className="w-4 h-4 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full mr-2 flex items-center justify-center">
													<span className="text-white text-xs font-medium">
														{member.name.charAt(0)}
													</span>
												</div>
											)}
											<span className="text-xs text-slate-700">
												{member.name}
											</span>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
}
