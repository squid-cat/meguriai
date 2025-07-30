"use client";

import { useEffect, useState } from "react";
import type { TeamMember } from "../types";

interface SuccessNotificationProps {
	isVisible: boolean;
	recipients: TeamMember[];
	onDismiss: () => void;
}

export function SuccessNotification({
	isVisible,
	recipients,
	onDismiss,
}: SuccessNotificationProps) {
	const [isAnimating, setIsAnimating] = useState(false);

	useEffect(() => {
		if (isVisible) {
			setIsAnimating(true);
			// 3秒後に自動で非表示にする
			const timer = setTimeout(() => {
				handleDismiss();
			}, 3000);

			return () => clearTimeout(timer);
		}
	}, [isVisible]);

	const handleDismiss = () => {
		setIsAnimating(false);
		setTimeout(() => {
			onDismiss();
		}, 300); // アニメーション完了を待つ
	};

	if (!isVisible) {
		return null;
	}

	return (
		<div className="fixed top-4 right-4 z-50">
			<div
				className={`
          bg-gradient-to-r from-green-100/95 via-emerald-100/95 to-teal-100/95 
          backdrop-blur-lg rounded-2xl shadow-2xl border-2 border-green-300/50 p-6 max-w-sm
          transform transition-all duration-300 ease-out
          ${isAnimating ? "translate-x-0 opacity-100 scale-100" : "translate-x-full opacity-0 scale-95"}
        `}
			>
				{/* 成功アイコン */}
				<div className="flex items-center justify-center">
					<div className="flex-shrink-0">
						<div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
							<svg
								className="w-6 h-6 text-white"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								aria-label="送信成功"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M5 13l4 4L19 7"
								/>
							</svg>
						</div>
					</div>
					
					{/* 成功メッセージ */}
					<div className="ml-4 flex-1">
						<p className="text-md font-bold text-green-800">
							メッセージを送信しました！
						</p>
					</div>
					{/* 閉じるボタン */}
					<button
						type="button"
						onClick={handleDismiss}
						className="ml-2 text-green-600 hover:text-green-800 transition-colors p-1 rounded-lg hover:bg-green-200/50"
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
			</div>
		</div>
	);
}
