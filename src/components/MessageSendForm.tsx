"use client";

import { useState } from "react";
import type { GratitudeMessage, TeamMember } from "../types";
import { MemberSelector } from "./MemberSelector";

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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

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
			const recipients = members.filter(member => selectedMembers.includes(member.id));
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
					className="block text-lg font-bold text-slate-800 mb-3"
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
            w-full px-5 py-4 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-200 focus:border-orange-400 transition-all resize-none bg-gradient-to-br from-orange-50/70 to-pink-50/70 backdrop-blur-sm
            ${errors.message ? "border-red-300 bg-gradient-to-br from-red-50/70 to-pink-50/70" : "border-orange-200 hover:border-orange-300"}
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
				<button
					type="submit"
					disabled={
						isSubmitting || selectedMembers.length === 0 || !message.trim()
					}
					className={`
						px-8 py-4 rounded-2xl text-base font-bold transition-all transform
						${
							isSubmitting || selectedMembers.length === 0 || !message.trim()
								? "bg-slate-300 text-slate-500 cursor-not-allowed"
								: "bg-gradient-to-r from-orange-400 to-pink-500 text-white shadow-xl hover:shadow-2xl hover:scale-105 hover:from-orange-500 hover:to-pink-600"
						}
					`}
				>
					<span className="flex items-center justify-center">
						{isSubmitting ? (
							<>
								<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
									<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								送信中...
							</>
						) : (
							<>
								「ありがとう」を送る
							</>
						)}
					</span>
				</button>
			</div>
		</form>
	);
}
