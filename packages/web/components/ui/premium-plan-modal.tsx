"use client";

import { Crown, Zap, Instagram, Youtube, BookOpen, MapPin, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface PremiumPlanModalProps {
	isOpen: boolean;
	onClose: () => void;
	onUpgrade: (planType: 'monthly' | 'yearly') => void;
}

export function PremiumPlanModal({
	isOpen,
	onClose,
	onUpgrade,
}: PremiumPlanModalProps) {
	const [isProcessing, setIsProcessing] = useState(false);
	const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');

	const handleUpgrade = async (planType: 'monthly' | 'yearly') => {
		setIsProcessing(true);
		try {
			await onUpgrade(planType);
		} finally {
			setIsProcessing(false);
		}
	};

	const handleModalEvent = (eventType: string, planType?: string) => {
		// トラッキング用のイベント発火ポイント
		// 実装時は以下のような感じで使用:
		// trackEvent('premium_plan_modal', { action: eventType, plan: planType });
		console.log('Tracking Event:', 'premium_plan_modal', { action: eventType, plan: planType });
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
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle className="flex items-center text-xl font-bold">
						<Crown className="h-6 w-6 text-orange-600 mr-2" />
						OffPath プレミアム
					</DialogTitle>
					<DialogDescription className="text-sm">
						究極の隠れ名所体験をアンロック
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					{/* プレミアム機能一覧 */}
					<div className="space-y-3">
						<h3 className="font-semibold text-base text-gray-900">全ての機能がアンロック</h3>
						
						<div className="space-y-2">
							{/* カオス度5 */}
							<div className="flex items-center space-x-3 p-2 rounded border border-orange-200 bg-orange-50">
								<Zap className="h-4 w-4 text-orange-600 flex-shrink-0" />
								<div className="flex-1">
									<h4 className="text-sm font-medium text-gray-900">カオス度5 - 完全カオス</h4>
								</div>
							</div>

							{/* SNS除外 */}
							<div className="flex items-center space-x-3 p-2 rounded border border-orange-200 bg-orange-50">
								<Instagram className="h-4 w-4 text-orange-600 flex-shrink-0" />
								<div className="flex-1">
									<h4 className="text-sm font-medium text-gray-900">SNS投稿済みスポット除外</h4>
								</div>
							</div>

							{/* ガイドブック除外 */}
							<div className="flex items-center space-x-3 p-2 rounded border border-orange-200 bg-orange-50">
								<BookOpen className="h-4 w-4 text-orange-600 flex-shrink-0" />
								<div className="flex-1">
									<h4 className="text-sm font-medium text-gray-900">ガイドブック掲載スポット除外</h4>
								</div>
							</div>
						</div>
					</div>

					{/* プラン選択 */}
					<div className="space-y-3">
						<h3 className="font-semibold text-base text-gray-900">プランを選択</h3>
						
						<div className="grid grid-cols-2 gap-3">
							{/* 月額プラン */}
							<div 
								className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
									selectedPlan === 'monthly' 
										? 'border-orange-500 bg-orange-50' 
										: 'border-gray-200 hover:border-gray-300'
								}`}
								onClick={() => setSelectedPlan('monthly')}
							>
								<div className="flex items-center justify-between mb-2">
									<h4 className="font-medium text-base">月額プラン</h4>
									<div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
										selectedPlan === 'monthly' 
											? 'border-orange-500 bg-orange-500' 
											: 'border-gray-300'
									}`}>
										{selectedPlan === 'monthly' && (
											<Check className="h-2 w-2 text-white" />
										)}
									</div>
								</div>
								<div className="text-2xl font-bold text-orange-600">¥1,980</div>
								<div className="text-xs text-gray-500">旅行時のみがお得</div>
							</div>

							{/* 年額プラン */}
							<div 
								className={`p-3 rounded-lg border-2 cursor-pointer transition-all relative ${
									selectedPlan === 'yearly' 
										? 'border-orange-500 bg-orange-50' 
										: 'border-gray-200 hover:border-gray-300'
								}`}
								onClick={() => setSelectedPlan('yearly')}
							>
								<Badge className="absolute -top-1 -right-1 bg-green-600 text-xs px-1 py-0">
									12% OFF
								</Badge>
								<div className="flex items-center justify-between mb-2">
									<h4 className="font-medium text-base">年額プラン</h4>
									<div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
										selectedPlan === 'yearly' 
											? 'border-orange-500 bg-orange-500' 
											: 'border-gray-300'
									}`}>
										{selectedPlan === 'yearly' && (
											<Check className="h-2 w-2 text-white" />
										)}
									</div>
								</div>
								<div className="text-2xl font-bold text-orange-600">¥6,980</div>
								<div className="text-xs text-gray-500">年4回以上ならお得</div>
							</div>
						</div>
					</div>

					{/* コンパクトな価値提案 */}
					<div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
						<p className="text-sm text-orange-800 text-center">
							<strong>誰も知らない完全未開拓地での独占体験</strong>
						</p>
					</div>

					{/* アクションボタン */}
					<div className="flex space-x-3 pt-2">
						<Button
							variant="outline"
							onClick={() => {
								handleModalEvent('cancel');
								onClose();
							}}
							className="flex-1"
						>
							スキップ
						</Button>
						<Button
							onClick={() => {
								handleModalEvent('upgrade_click', selectedPlan);
								handleUpgrade(selectedPlan);
							}}
							disabled={isProcessing}
							className="flex-1 bg-orange-600 hover:bg-orange-700 font-semibold"
						>
							{isProcessing ? "処理中..." : "プレミアムを開始"}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}