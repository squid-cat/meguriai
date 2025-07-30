"use client";

import { useEffect, useState } from "react";
import type { GratitudeMessage } from "../types";
import { QuantumButton } from "./ui/QuantumButton";

interface NotificationPopupProps {
	messages: GratitudeMessage[];
	onDismiss: () => void;
	isInitial?: boolean;
}

export function NotificationPopup({
	messages,
	onDismiss,
	isInitial = false,
}: NotificationPopupProps) {
	const [isVisible, setIsVisible] = useState(false);
	const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

	useEffect(() => {
		if (messages.length > 0) {
			setIsVisible(true);
			setCurrentMessageIndex(0);
		}
	}, [messages]);

	const handleClose = () => {
		setIsVisible(false);
		setTimeout(() => {
			onDismiss();
		}, 300); // アニメーション完了を待つ
	};

	const handleNext = () => {
		if (currentMessageIndex < messages.length - 1) {
			setCurrentMessageIndex(currentMessageIndex + 1);
		} else {
			handleClose();
		}
	};

	const handlePrevious = () => {
		if (currentMessageIndex > 0) {
			setCurrentMessageIndex(currentMessageIndex - 1);
		}
	};

	if (messages.length === 0) {
		return null;
	}

	const currentMessage = messages[currentMessageIndex];

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			{/* オーバーレイ */}
			<div
				className={`
          fixed inset-0 bg-black/50 transition-opacity duration-300
          ${isVisible ? "opacity-100" : "opacity-0"}
        `}
				onClick={handleClose}
				onKeyDown={(e) => e.key === "Escape" && handleClose()}
				role="button"
				tabIndex={0}
			/>

			{/* ポップアップコンテンツ */}
			<div
				className={`
          relative bg-gradient-to-br from-orange-50/95 via-pink-50/95 to-purple-50/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 mx-4 max-w-lg w-full border-2 border-orange-300
          transform transition-all duration-300
          ${isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"}
        `}
			>
				{/* ヘッダー */}
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center">
						<h3 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
							{isInitial ? "サプライズメッセージ" : "新しいメッセージ"}
						</h3>
					</div>
					<button
						type="button"
						onClick={handleClose}
						className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-2xl hover:bg-gradient-to-r hover:from-orange-50/80 hover:to-pink-50/80 hover:backdrop-blur-sm"
					>
						<svg
							className="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-label="閉じる"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>

				{/* 送信者情報 */}
				<div className="mb-6">
					<div className="flex items-center mb-4">
						{currentMessage.from.avatar ? (
							<img
								src={currentMessage.from.avatar}
								alt={currentMessage.from.name}
								className="w-16 h-16 rounded-full mr-4 ring-4 ring-orange-200 shadow-lg"
							/>
						) : (
							<div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full mr-4 flex items-center justify-center ring-4 ring-orange-200 shadow-xl">
								<span className="text-white font-bold text-xl">
									{currentMessage.from.name.charAt(0)}
								</span>
							</div>
						)}
						<div>
							<p className="font-semibold text-slate-800 text-lg">
								{currentMessage.from.name}さんから
							</p>
							<p className="text-sm text-slate-500">
								{new Date(currentMessage.createdAt).toLocaleString("ja-JP")}
							</p>
						</div>
					</div>
				</div>

				{/* メッセージ内容 */}
				<div className="mb-6">
					<div className="bg-gradient-to-br from-orange-100/80 via-pink-100/80 to-purple-100/80 border-2 border-orange-300 p-6 rounded-2xl shadow-inner backdrop-blur-sm">
						<p className="text-slate-800 leading-relaxed text-lg font-semibold">
							{currentMessage.message}
						</p>
					</div>
				</div>

				{/* 受信者表示（複数人の場合） */}
				{currentMessage.to.length > 1 && (
					<div className="mb-6 text-center">
						<p className="text-sm text-slate-600 bg-gradient-to-r from-orange-100/80 to-pink-100/80 p-3 rounded-2xl border border-orange-200 backdrop-blur-sm">
							{currentMessage.to.map((member) => member.name).join("、")}
							さんにも送られました
						</p>
					</div>
				)}

				{/* ナビゲーション（複数メッセージがある場合） */}
				{messages.length > 1 && (
					<div className="flex items-center justify-between mb-6">
						<QuantumButton
							onClick={handlePrevious}
							disabled={currentMessageIndex === 0}
							variant="secondary"
							className="px-5 py-2 text-sm"
						>
							← 前へ
						</QuantumButton>
						<span className="text-sm text-slate-600 bg-gradient-to-r from-orange-100/80 to-pink-100/80 px-4 py-2 rounded-2xl border border-orange-200 shadow-sm backdrop-blur-sm">
							{currentMessageIndex + 1} / {messages.length}
						</span>
						<QuantumButton
							onClick={handleNext}
							variant="secondary"
							className="px-5 py-2 text-sm"
						>
							{currentMessageIndex < messages.length - 1 ? "次へ →" : "閉じる"}
						</QuantumButton>
					</div>
				)}

				{/* アクションボタン */}
				<div className="flex justify-center">
					{messages.length === 1 && (
						<QuantumButton
							onClick={handleClose}
							variant="primary"
							className="px-8 py-3"
						>
							閉じる
						</QuantumButton>
					)}
				</div>
			</div>
		</div>
	);
}
