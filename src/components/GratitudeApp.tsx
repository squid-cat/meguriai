"use client";

import { useEffect, useState } from "react";
import type { GratitudeMessage, TeamMember } from "../types";
import { MessageList } from "./MessageList";
import { MessageSendForm } from "./MessageSendForm";
import { NotificationPopup } from "./NotificationPopup";
import { SuccessNotification } from "./SuccessNotification";

export function GratitudeApp() {
	const [currentUserId, setCurrentUserId] = useState("1"); // デモ用ユーザー切り替え
	const [members, setMembers] = useState<TeamMember[]>([]);
	const [messages, setMessages] = useState<GratitudeMessage[]>([]);
	const [newMessages, setNewMessages] = useState<GratitudeMessage[]>([]);
	const [initialMessages, setInitialMessages] = useState<GratitudeMessage[]>(
		[],
	); // 初回ロード時のメッセージ
	const [dismissedInitialMessages, setDismissedInitialMessages] = useState<
		Map<string, Set<string>>
	>(new Map()); // ユーザーごとに表示済みメッセージを管理
	const [loading, setLoading] = useState(true);
	const [successNotification, setSuccessNotification] = useState<{
		isVisible: boolean;
		recipients: TeamMember[];
	}>({ isVisible: false, recipients: [] });

	// メンバー一覧取得
	useEffect(() => {
		const fetchMembers = async () => {
			try {
				const response = await fetch("/api/members");
				const data = await response.json();
				setMembers(data);
			} catch (error) {
				console.error("メンバー取得エラー:", error);
			}
		};

		fetchMembers();
	}, []);

	// メッセージ一覧取得
	useEffect(() => {
		const fetchMessages = async () => {
			try {
				const response = await fetch(`/api/messages?userId=${currentUserId}`);
				const data = await response.json();
				setMessages(data);

				// 初回ロード時に受信メッセージがあればポップアップ表示（このユーザーで未表示のもののみ）
				const userDismissedMessages = dismissedInitialMessages.get(currentUserId) || new Set();
				const receivedMessages = data.filter(
					(msg: GratitudeMessage) =>
						msg.to.some(
							(member: { id: string }) => member.id === currentUserId,
						) &&
						msg.from.id !== currentUserId &&
						!userDismissedMessages.has(msg.id),
				);

				if (receivedMessages.length > 0 && initialMessages.length === 0) {
					setInitialMessages(receivedMessages);
				}

				setLoading(false);
			} catch (error) {
				console.error("メッセージ取得エラー:", error);
				setLoading(false);
			}
		};

		fetchMessages();
	}, [currentUserId, initialMessages.length]);

	// 新着メッセージのポーリング
	useEffect(() => {
		const interval = setInterval(async () => {
			try {
				const lastMessageTime =
					messages.length > 0
						? new Date(messages[messages.length - 1].createdAt).toISOString()
						: new Date(Date.now() - 3600000).toISOString(); // 1時間前

				const response = await fetch(
					`/api/messages/new?userId=${currentUserId}&since=${lastMessageTime}`,
				);
				const newData = await response.json();

				if (newData.length > 0) {
					setNewMessages(newData);
					setMessages((prev) => [...prev, ...newData]);
				}
			} catch (error) {
				console.error("新着メッセージ取得エラー:", error);
			}
		}, 3000); // 3秒間隔でポーリング

		return () => clearInterval(interval);
	}, [messages, currentUserId]);

	const handleMessageSent = (newMessage: GratitudeMessage) => {
		setMessages((prev) => [...prev, newMessage]);
	};

	const handleSendSuccess = (recipients: TeamMember[]) => {
		setSuccessNotification({ isVisible: true, recipients });
	};

	const handleSuccessNotificationDismiss = () => {
		setSuccessNotification({ isVisible: false, recipients: [] });
	};

	const handleNotificationDismiss = () => {
		setNewMessages([]);
	};

	const handleUserChange = (userId: string) => {
		setCurrentUserId(userId);
		setNewMessages([]); // 通知をクリア
		setInitialMessages([]); // 初期メッセージもクリア
	};

	const handleInitialMessagesDismiss = () => {
		// 現在のユーザーで表示済みメッセージのIDを記録
		const messageIds = initialMessages.map((msg) => msg.id);
		setDismissedInitialMessages((prev) => {
			const newMap = new Map(prev);
			const userDismissedMessages = newMap.get(currentUserId) || new Set();
			messageIds.forEach((id) => userDismissedMessages.add(id));
			newMap.set(currentUserId, userDismissedMessages);
			return newMap;
		});
		setInitialMessages([]);
	};

	const currentUser = members.find((member) => member.id === currentUserId);

	if (loading) {
		return (
			<div className="text-center py-8">
				<div className="text-lg text-gray-600">読み込み中...</div>
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto space-y-6">
			{/* ユーザー切り替えセクション */}
			<div className="bg-gradient-to-r from-orange-50/90 to-pink-50/90 backdrop-blur-md rounded-3xl shadow-xl border-2 border-orange-200/50 p-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center">
						{currentUser?.avatar ? (
							<img
								src={currentUser.avatar}
								alt={currentUser.name}
								className="w-14 h-14 rounded-full mr-4 ring-4 ring-orange-200"
							/>
						) : (
							<div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full mr-4 flex items-center justify-center ring-4 ring-orange-200 shadow-lg">
								<span className="text-white font-bold text-lg">
									{currentUser?.name.charAt(0)}
								</span>
							</div>
						)}
						<div>
							<p className="font-bold text-slate-800 text-xl">
								{currentUser?.name}さん
							</p>
							<p className="text-sm text-slate-500 font-medium">アカウント切り替え</p>
						</div>
					</div>
					<div className="flex space-x-2">
						{members.map((member) => (
							<button
								type="button"
								key={member.id}
								onClick={() => handleUserChange(member.id)}
								className={`
									px-4 py-2 rounded-2xl text-sm font-semibold transition-all transform hover:scale-105
									${
										currentUserId === member.id
											? "bg-gradient-to-r from-orange-400 to-pink-500 text-white shadow-lg"
											: "bg-white/70 text-slate-700 hover:bg-white border border-orange-200 shadow-sm"
									}
								`}
							>
								{member.name}
							</button>
						))}
					</div>
				</div>
			</div>
			{/* 感謝メッセージ送信フォーム */}
			<div className="bg-gradient-to-br from-orange-50/90 via-pink-50/90 to-purple-50/90 backdrop-blur-md rounded-3xl shadow-xl border-2 border-orange-200/50 p-8">
				<div className="text-center mb-8">
					<div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-400 to-pink-500 rounded-2xl mb-4 shadow-lg">
						<span className="text-xl">✨</span>
					</div>
					<h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-3">
						「ありがとう」を伝える
					</h2>
					<p className="text-slate-600 leading-relaxed">
						あなたの「ありがとう」が、チームをもっと素敵にします
					</p>
				</div>
				<MessageSendForm
					members={members}
					currentUserId={currentUserId}
					onMessageSent={handleMessageSent}
					onSendSuccess={handleSendSuccess}
				/>
			</div>

			{/* 受信メッセージ */}
			<div className="bg-gradient-to-br from-purple-50/90 via-pink-50/90 to-orange-50/90 backdrop-blur-md rounded-3xl shadow-xl border-2 border-purple-200/50 p-8">
				<div className="text-center mb-8">
					<div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl mb-4 shadow-lg">
						<span className="text-xl">💖</span>
					</div>
					<h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
						メッセージ一覧
					</h2>
					<p className="text-slate-600 leading-relaxed">みんなからの心温まるメッセージです</p>
				</div>
				<MessageList messages={messages} currentUserId={currentUserId} />
			</div>

			{/* 初回メッセージ表示 */}
			{initialMessages.length > 0 && (
				<NotificationPopup
					messages={initialMessages}
					onDismiss={handleInitialMessagesDismiss}
					isInitial={true}
				/>
			)}

			{/* 新着メッセージ通知 */}
			{newMessages.length > 0 && (
				<NotificationPopup
					messages={newMessages}
					onDismiss={handleNotificationDismiss}
					isInitial={false}
				/>
			)}

			{/* サクセス通知 */}
			<SuccessNotification
				isVisible={successNotification.isVisible}
				recipients={successNotification.recipients}
				onDismiss={handleSuccessNotificationDismiss}
			/>
		</div>
	);
}
