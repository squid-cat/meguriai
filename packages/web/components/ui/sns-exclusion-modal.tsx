"use client";

import { Crown, Zap, Instagram, Youtube } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

interface SnsExclusionModalProps {
	isOpen: boolean;
	onClose: () => void;
	onUpgrade: () => void;
}

export function SnsExclusionModal({
	isOpen,
	onClose,
	onUpgrade,
}: SnsExclusionModalProps) {
	const [isProcessing, setIsProcessing] = useState(false);

	const handleUpgrade = async () => {
		setIsProcessing(true);
		try {
			await onUpgrade();
		} finally {
			setIsProcessing(false);
		}
	};

	const handleModalEvent = (eventType: string) => {
		// トラッキング用のイベント発火ポイント
		// 実装時は以下のような感じで使用:
		// trackEvent('sns_exclusion_modal', { action: eventType });
		console.log('Tracking Event:', 'sns_exclusion_modal', { action: eventType });
	};

	return (
		<Dialog 
			open={isOpen} 
			onOpenChange={(open) => {
				if (!open) {
					handleModalEvent('close');
					onClose();
				}
			}}
		>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center text-xl font-bold">
						<Crown className="h-6 w-6 text-orange-600 mr-2" />
						SNS投稿済みスポット除外
					</DialogTitle>
					<DialogDescription className="text-base">
						完全未発見の隠れ名所のみをお届け
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6">
					{/* 機能の特徴 */}
					<div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200">
						<div className="flex items-start space-x-3">
							<div className="flex space-x-1">
								<Instagram className="h-4 w-4 text-orange-600 mt-0.5" />
								<Youtube className="h-4 w-4 text-orange-600 mt-0.5" />
								<Zap className="h-4 w-4 text-orange-600 mt-0.5" />
							</div>
							<div>
								<h3 className="font-semibold text-gray-900 mb-2">
									SNS未投稿の真の隠れ名所
								</h3>
								<ul className="text-sm text-gray-700 space-y-1">
									<li>• Instagram/TikTok/YouTube投稿済みスポットを自動除外</li>
									<li>• リアルタイムSNS分析による最新判定</li>
									<li>• 「完全未発見」の場所のみを厳選</li>
									<li>• あなただけの特別な体験を保証</li>
								</ul>
							</div>
						</div>
					</div>

					{/* 価格表示 */}
					<div className="text-center space-y-2">
						<div className="text-3xl font-bold text-orange-600">¥800</div>
						<div className="text-sm text-gray-500">
							今回の旅行のみ（買い切り）
						</div>
					</div>

					{/* 注意事項 */}
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
						<p className="text-sm text-blue-800">
							<strong>💡 効果：</strong>
							通常の隠れ名所に加え、SNSで一度も投稿されていない「完全未開拓地」のスポットのみが対象になります。
						</p>
					</div>

					{/* アクションボタン */}
					<div className="flex space-x-3">
						<Button
							variant="outline"
							onClick={() => {
								handleModalEvent('cancel');
								onClose();
							}}
							className="flex-1"
						>
							キャンセル
						</Button>
						<Button
							onClick={() => {
								handleModalEvent('upgrade_click');
								handleUpgrade();
							}}
							disabled={isProcessing}
							className="flex-1 bg-orange-600 hover:bg-orange-700"
						>
							{isProcessing ? "処理中..." : "アンロックする"}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}