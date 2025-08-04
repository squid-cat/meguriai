"use client";

import { Crown, BookOpen, MapPin } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

interface GuidebookExclusionModalProps {
	isOpen: boolean;
	onClose: () => void;
	onUpgrade: () => void;
}

export function GuidebookExclusionModal({
	isOpen,
	onClose,
	onUpgrade,
}: GuidebookExclusionModalProps) {
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
		// trackEvent('guidebook_exclusion_modal', { action: eventType });
		console.log('Tracking Event:', 'guidebook_exclusion_modal', { action: eventType });
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
						ガイドブック掲載スポット除外
					</DialogTitle>
					<DialogDescription className="text-base">
						ガイドブックにない真の隠れ名所のみ
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6">
					{/* 機能の特徴 */}
					<div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200">
						<div className="flex items-start space-x-3">
							<div className="flex space-x-1">
								<BookOpen className="h-4 w-4 text-orange-600 mt-0.5" />
								<MapPin className="h-4 w-4 text-orange-600 mt-0.5" />
							</div>
							<div>
								<h3 className="font-semibold text-gray-900 mb-2">
									ガイドブック未掲載の隠れ名所
								</h3>
								<ul className="text-sm text-gray-700 space-y-1">
									<li>• 地球の歩き方、Lonely Planet等の掲載スポットを除外</li>
									<li>• 主要ガイドブック50冊以上のデータベースと照合</li>
									<li>• 「ガイドブックにない真の隠れ名所」を保証</li>
									<li>• 他の旅行者と被らない特別な場所のみ</li>
								</ul>
							</div>
						</div>
					</div>

					{/* 価格表示 */}
					<div className="text-center space-y-2">
						<div className="text-3xl font-bold text-orange-600">¥1,000</div>
						<div className="text-sm text-gray-500">
							今回の旅行のみ（買い切り）
						</div>
					</div>

					{/* 注意事項 */}
					<div className="bg-green-50 border border-green-200 rounded-lg p-3">
						<p className="text-sm text-green-800">
							<strong>✨ 品質保証：</strong>
							厳格なガイドブック照合により、「本当に誰も知らない隠れ名所」のみをお届けします。
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