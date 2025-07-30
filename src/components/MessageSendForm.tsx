"use client";

import { useState } from "react";
import type { GratitudeMessage, TeamMember } from "../types";
import { MemberSelector } from "./MemberSelector";
import { QuantumButton } from "./ui/QuantumButton";

interface MessageSendFormProps {
	members: TeamMember[];
	currentUserId: string;
	onMessageSent: (message: GratitudeMessage) => void;
	onSendSuccess: (recipients: TeamMember[]) => void;
}

export function MessageSendForm({
	members,
	currentUserId,
	onMessageSent,
	onSendSuccess,
}: MessageSendFormProps) {
	const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
	const [message, setMessage] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errors, setErrors] = useState<{
		members?: string;
		message?: string;
		submit?: string;
	}>({});

	const validateForm = () => {
		const newErrors: typeof errors = {};

		if (selectedMembers.length === 0) {
			newErrors.members = "感謝を送る相手を選択してください";
		}

		if (!message.trim()) {
			newErrors.message = "メッセージを入力してください";
		} else if (message.trim().length > 500) {
			newErrors.message = "メッセージは500文字以内で入力してください";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
		e?.preventDefault();

		if (!validateForm()) {
			return;
		}

		setIsSubmitting(true);
		setErrors({});

		try {
			const response = await fetch("/api/messages", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					to: selectedMembers,
					message: message.trim(),
					from: currentUserId,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "メッセージ送信に失敗しました");
			}

			const newMessage = await response.json();

			// 成功時の処理
			onMessageSent({
				...newMessage,
				createdAt: new Date(newMessage.createdAt),
			});

			// 受信者情報を取得してサクセスコールバックを呼び出し
			const recipients = members.filter((member) =>
				selectedMembers.includes(member.id),
			);
			onSendSuccess(recipients);

			// フォームリセット
			setSelectedMembers([]);
			setMessage("");
		} catch (error) {
			console.error("メッセージ送信エラー:", error);
			setErrors({
				submit:
					error instanceof Error
						? error.message
						: "メッセージ送信に失敗しました",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			{/* メンバー選択 */}
			<div>
				<MemberSelector
					members={members}
					selectedMembers={selectedMembers}
					onSelectionChange={setSelectedMembers}
					currentUserId={currentUserId}
				/>
				{errors.members && (
					<p className="mt-3 text-sm text-red-600 bg-gradient-to-r from-red-50/80 to-pink-50/80 p-3 rounded-2xl border-2 border-red-200 backdrop-blur-sm">
						{errors.members}
					</p>
				)}
			</div>

			{/* メッセージ入力 */}
			<div>
				<label
					htmlFor="message"
					className="block text-xl font-bold bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-4"
				>
					💬 メッセージ
				</label>
				<textarea
					id="message"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					placeholder="あなたの「ありがとう」を、心を込めて伝えてください..."
					rows={4}
					className={`
            w-full px-6 py-5 border-3 rounded-3xl focus:outline-none focus:ring-4 focus:ring-orange-300/50 focus:border-orange-500 transition-all resize-none bg-gradient-to-br from-orange-50/80 via-pink-50/80 to-purple-50/80 backdrop-blur-xl shadow-xl font-medium text-slate-800 placeholder-slate-500
            ${errors.message ? "border-red-400 bg-gradient-to-br from-red-50/80 to-pink-50/80 shadow-red-200/50" : "border-orange-300/50 hover:border-orange-400/70 shadow-orange-200/30"}
          `}
					disabled={isSubmitting}
				/>
				<div className="mt-2 flex justify-between items-center">
					{errors.message ? (
						<p className="text-sm text-red-600">{errors.message}</p>
					) : (
						<p className="text-sm text-slate-500">{message.length}/500文字</p>
					)}
				</div>
			</div>

			{/* エラーメッセージ */}
			{errors.submit && (
				<div className="p-4 bg-gradient-to-r from-red-50/80 to-pink-50/80 border-2 border-red-200 rounded-2xl backdrop-blur-sm">
					<p className="text-sm text-red-600">{errors.submit}</p>
				</div>
			)}

			{/* 送信ボタン */}
			<div className="flex justify-center">
				<QuantumButton
					onClick={() => handleSubmit()}
					disabled={
						isSubmitting || selectedMembers.length === 0 || !message.trim()
					}
					variant="primary"
					className="px-12 py-5 text-lg"
				>
					<span className="flex items-center justify-center gap-3">
						{isSubmitting ? (
							<>
								<div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
								送信中...
							</>
						) : (
							<>
								<span className="text-2xl">✨</span>
								「ありがとう」を送る
							</>
						)}
					</span>
				</QuantumButton>
			</div>
		</form>
	);
}
