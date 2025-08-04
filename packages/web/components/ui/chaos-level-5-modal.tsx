"use client";

import { Crown, Zap } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

interface ChaosLevel5ModalProps {
	isOpen: boolean;
	onClose: () => void;
	onUpgrade: () => void;
}

export function ChaosLevel5Modal({
	isOpen,
	onClose,
	onUpgrade,
}: ChaosLevel5ModalProps) {
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
		// trackEvent('chaos_level_5_modal', { action: eventType });
		console.log('Tracking Event:', 'chaos_level_5_modal', { action: eventType });
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
						カオス度5をアンロック
					</DialogTitle>
					<DialogDescription className="text-base">
						究極の冒険体験をお楽しみください
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6">
					{/* カオス度5の特徴 */}
					<div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200">
						<div className="flex items-start space-x-3">
							<Zap className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
							<div>
								<h3 className="font-semibold text-gray-900 mb-2">
									完全カオス - 何が起こるか全く分からない
								</h3>
								<ul className="text-sm text-gray-700 space-y-1">
									<li>• 言語サポートなしの完全現地体験</li>
									<li>• AI確信度50%程度の未知スポット含有</li>
									<li>• 地元コミュニティイベント参加可能性</li>
									<li>• 予測不可能性MAX - 究極の冒険</li>
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
					<div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
						<p className="text-sm text-amber-800">
							<strong>⚠️ 注意：</strong>
							カオス度5は上級者向けです。予期しない状況への対応力と冒険心が必要です。
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