"use client";

import { useEffect, useState } from "react";
import type { GratitudeMessage, TeamMember } from "../types";
import { MessageList } from "./MessageList";
import { MessageSendForm } from "./MessageSendForm";
import { NotificationPopup } from "./NotificationPopup";
import { SuccessNotification } from "./SuccessNotification";
import { NeuralCard } from "./ui/NeuralCard";
import { QuantumButton } from "./ui/QuantumButton";
import { QuantumField } from "./ui/QuantumField";

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
				const userDismissedMessages =
					dismissedInitialMessages.get(currentUserId) || new Set();
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
		<QuantumField
			className="min-h-screen py-8"
			particleCount={80}
			enableGravity={true}
			enableMagneticField={true}
		>
			<div className="max-w-4xl mx-auto space-y-8">
				{/* ユーザー切り替えセクション */}
				<NeuralCard variant="tertiary" className="p-2">
					<div className="flex items-center justify-between">
						<div className="flex items-center">
							{currentUser?.avatar ? (
								<img
									src={currentUser.avatar}
									alt={currentUser.name}
									className="w-16 h-16 rounded-full mr-6 ring-4 ring-emerald-300/50 shadow-2xl"
								/>
							) : (
								<div className="w-16 h-16 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 rounded-full mr-6 flex items-center justify-center ring-4 ring-emerald-300/50 shadow-2xl relative overflow-hidden">
									<div className="absolute inset-0 bg-white/20 animate-pulse" />
									<span className="text-white font-bold text-xl relative z-10">
										{currentUser?.name.charAt(0)}
									</span>
								</div>
							)}
							<div>
								<p className="font-bold bg-gradient-to-r from-emerald-800 to-teal-800 bg-clip-text text-transparent text-2xl">
									{currentUser?.name}さん
								</p>
								<p className="text-sm text-slate-500 font-medium">アカウント切り替え</p>
							</div>
						</div>
						<div className="flex space-x-3">
							{members.map((member) => (
								<QuantumButton
									key={member.id}
									onClick={() => handleUserChange(member.id)}
									variant={
										currentUserId === member.id ? "success" : "secondary"
									}
									className="px-6 py-3 text-sm"
								>
									{member.name}
								</QuantumButton>
							))}
						</div>
					</div>
				</NeuralCard>
				{/* 感謝メッセージ送信フォーム */}
				<NeuralCard variant="primary" className="p-4">
					<div className="text-center mb-10">
						<div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 rounded-full mb-6 shadow-2xl">
							<div className="absolute inset-0 bg-white/20 rounded-full animate-pulse" />
							<span className="text-3xl relative z-10">✨</span>
							<div
								className="absolute -inset-2 bg-gradient-to-r from-orange-400/30 to-purple-600/30 rounded-full blur-xl animate-spin"
								style={{ animationDuration: "8s" }}
							/>
						</div>
						<h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
							「ありがとう」を伝える
						</h2>
						<p className="text-slate-700 leading-relaxed text-lg font-medium">
							あなたの「ありがとう」が、チームをもっと素敵にします！
						</p>
					</div>
					<MessageSendForm
						members={members}
						currentUserId={currentUserId}
						onMessageSent={handleMessageSent}
						onSendSuccess={handleSendSuccess}
					/>
				</NeuralCard>

				{/* 受信メッセージ */}
				<NeuralCard variant="secondary" className="p-4">
					<div className="text-center mb-10">
						<div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-400 via-pink-500 to-orange-600 rounded-full mb-6 shadow-2xl">
							<div className="absolute inset-0 bg-white/20 rounded-full animate-pulse" />
							<span className="text-3xl relative z-10">💖</span>
							<div
								className="absolute -inset-2 bg-gradient-to-r from-purple-400/30 to-orange-600/30 rounded-full blur-xl animate-spin"
								style={{ animationDuration: "10s" }}
							/>
						</div>
						<h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-4">
							メッセージ一覧
						</h2>
						<p className="text-slate-700 leading-relaxed text-lg font-medium">
							みんなからの心温まるメッセージです
						</p>
					</div>
					<MessageList messages={messages} currentUserId={currentUserId} />
				</NeuralCard>

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
		</QuantumField>
	);
}
