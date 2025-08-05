"use client";

import { AlertTriangle, ArrowLeft, Compass, MapPin, Zap, Crown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { PremiumPlanModal } from "@/components/ui/premium-plan-modal";
import { apiClient } from "@/utils/api-client";

export default function CreateTripPage() {
	const router = useRouter();
	const [formData, setFormData] = useState({
		destination: "",
		duration: "",
		budget: "",
		chaosLevel: [3],
		avoidTouristSpots: true,
		avoidJapaneseServices: true,
		avoidCrowdedAreas: false,
		avoidSnsPostedSpots: false,
		avoidGuidebookSpots: false,
	});
	const [isLoading, setIsLoading] = useState(false);
	const [premiumPlanType, setPremiumPlanType] = useState<null | 'monthly' | 'yearly'>(null);
	const [showPremiumPlanModal, setShowPremiumPlanModal] = useState(false);
	
	// プレミアム機能へのアクセス判定（デフォルトは無効）
	const hasPremiumAccess = false; // 常に無効状態

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// フォームバリデーション
		if (!formData.destination || !formData.duration || !formData.budget) {
			alert("すべての必須項目を入力してください。");
			return;
		}

		setIsLoading(true);

		try {
			const { data, error } = await apiClient.POST("/api/discover-spots", {
				body: {
					destination: formData.destination,
					duration: formData.duration,
					budget: formData.budget,
					chaosLevel: formData.chaosLevel[0],
					avoidTouristSpots: formData.avoidTouristSpots,
					avoidJapaneseServices: formData.avoidJapaneseServices,
					avoidCrowdedAreas: formData.avoidCrowdedAreas,
					avoidSnsPostedSpots: formData.avoidSnsPostedSpots,
					avoidGuidebookSpots: formData.avoidGuidebookSpots,
				},
			});

			if (error) {
				console.error("隠れ名所発見エラー:", error);
				// サーバーからのエラーメッセージを表示
				const errorMessage = (error as any)?.error || "隠れ名所の発見に失敗しました。もう一度お試しください。";
				alert(errorMessage);
				return;
			}

			// 結果をローカルストレージに保存して結果画面に遷移
			localStorage.setItem("tripResults", JSON.stringify(data));
			router.push("/trip-results");
		} catch (error) {
			console.error("API呼び出しエラー:", error);
			alert(
				"サーバーに接続できませんでした。しばらく時間をおいてからお試しください。",
			);
		} finally {
			setIsLoading(false);
		}
	};

	const chaosDescriptions = [
		"安全第一 - 予測可能で安心な旅",
		"軽い冒険 - 少しのサプライズを含む",
		"バランス型 - 計画と偶然のバランス",
		"冒険重視 - 予測不可能な体験を重視",
		"完全カオス - 何が起こるか全く分からない",
	];

	const handleChaosLevelChange = (value: number[]) => {
		const newLevel = value[0];
		
		// カオス度5を選択しようとした場合
		if (newLevel === 5 && !hasPremiumAccess) {
			setShowPremiumPlanModal(true);
			// スライダーの値を4に戻す
			setFormData({ ...formData, chaosLevel: [4] });
			return;
		}
		
		setFormData({ ...formData, chaosLevel: value });
	};

	const handlePremiumPlanUpgrade = async (planType: 'monthly' | 'yearly') => {
		// ここで実際の課金処理を行う
		// 仮実装として成功したことにする
		setPremiumPlanType(planType);
		setShowPremiumPlanModal(false);
		
		// プレミアム機能を有効化
		setFormData({
			...formData,
			chaosLevel: [5],
			avoidSnsPostedSpots: true,
			avoidGuidebookSpots: true,
		});
	};

	const handlePremiumFeatureClick = () => {
		if (!hasPremiumAccess) {
			setShowPremiumPlanModal(true);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-amber-50">
			{/* Header */}
			<header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
				<div className="container mx-auto px-4 py-4 flex items-center justify-between">
					<div className="flex items-center space-x-4">
						<Link
							href="/dashboard"
							className="flex items-center text-orange-600 hover:text-orange-700"
						>
							<ArrowLeft className="h-5 w-5 mr-2" />
							ダッシュボード
						</Link>
						<div className="flex items-center space-x-2">
							<Compass className="h-6 w-6 text-orange-600" />
							<span className="text-xl font-bold text-gray-900">
								新しい冒険を計画
							</span>
						</div>
					</div>
				</div>
			</header>

			<div className="container mx-auto px-4 py-8 max-w-4xl">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						あなただけの隠れ名所旅行を作成
					</h1>
					<p className="text-gray-600">
						AIが現地語レビューを解析し、真の隠れ名所だけを厳選します
					</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-8">
					<div className="grid lg:grid-cols-2 gap-8">
						{/* 基本情報 */}
						<Card className="border-orange-200">
							<CardHeader>
								<CardTitle className="flex items-center">
									<MapPin className="h-5 w-5 mr-2 text-orange-600" />
									基本情報
								</CardTitle>
								<CardDescription>
									旅行の基本的な情報を入力してください
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="destination">
										行き先（国・地域）<span className="text-red-500">※</span>
									</Label>
									<Input
										id="destination"
										placeholder="例: タイ、ベトナム北部、バリ島周辺"
										value={formData.destination}
										onChange={(e) =>
											setFormData({ ...formData, destination: e.target.value })
										}
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="duration">
										旅行期間<span className="text-red-500">※</span>
									</Label>
									<Select
										value={formData.duration}
										onValueChange={(value) =>
											setFormData({ ...formData, duration: value })
										}
									>
										<SelectTrigger>
											<SelectValue placeholder="期間を選択" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="3-4days">3-4日</SelectItem>
											<SelectItem value="5-7days">5-7日</SelectItem>
											<SelectItem value="1-2weeks">1-2週間</SelectItem>
											<SelectItem value="3weeks+">3週間以上</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label htmlFor="budget">
										予算（一人当たり）<span className="text-red-500">※</span>
									</Label>
									<Select
										value={formData.budget}
										onValueChange={(value) =>
											setFormData({ ...formData, budget: value })
										}
									>
										<SelectTrigger>
											<SelectValue placeholder="予算を選択" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="budget">
												エコノミー（5-10万円）
											</SelectItem>
											<SelectItem value="standard">
												スタンダード（10-20万円）
											</SelectItem>
											<SelectItem value="premium">
												プレミアム（20-40万円）
											</SelectItem>
											<SelectItem value="luxury">
												ラグジュアリー（40万円以上）
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</CardContent>
						</Card>

						{/* カオス度設定 */}
						<Card className="border-orange-200">
							<CardHeader>
								<CardTitle className="flex items-center">
									<Zap className="h-5 w-5 mr-2 text-orange-600" />
									カオス度設定
								</CardTitle>
								<CardDescription>
									予測不可能さのレベルを選択してください
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-2">
											<Label>カオス度: {formData.chaosLevel[0]}/5</Label>
											{formData.chaosLevel[0] === 5 && hasPremiumAccess && (
												<Crown className="h-4 w-4 text-orange-600" />
											)}
										</div>
										<div className="text-sm text-orange-600 font-medium flex items-center space-x-2">
											<span>{chaosDescriptions[formData.chaosLevel[0] - 1]}</span>
											{formData.chaosLevel[0] === 5 && !hasPremiumAccess && (
												<span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
													プレミアム
												</span>
											)}
										</div>
									</div>
									<Slider
										value={formData.chaosLevel}
										onValueChange={handleChaosLevelChange}
										max={5}
										min={1}
										step={1}
										className="w-full"
									/>
									<div className="flex justify-between text-xs text-gray-500">
										<span>安全</span>
										<span>バランス</span>
										<div className="flex items-center space-x-1">
											<span>カオス</span>
											{!hasPremiumAccess && (
												<Crown className="h-3 w-3 text-orange-500" />
											)}
										</div>
									</div>
								</div>

								{formData.chaosLevel[0] >= 4 && (
									<div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
										<div className="flex items-start space-x-2">
											<AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
											<div className="text-sm text-orange-800">
												<strong>高カオス度の注意：</strong>
												<br />
												{formData.chaosLevel[0] === 5 && !hasPremiumAccess ? (
													<>
														カオス度5は<strong>プレミアム機能</strong>です。
														言語サポートなし・AI確信度50%の未知スポット・地元コミュニティ参加、
														SNS未投稿の完全未開拓地、ガイドブック未掲載の真の隠れ名所など、
														究極の冒険体験をまとめてお楽しみいただけます。
														<br />
														<Button
															variant="link"
															className="p-0 h-auto text-orange-700 underline"
															onClick={() => setShowPremiumPlanModal(true)}
														>
															プレミアムプランを見る（月額¥1,980〜）
														</Button>
													</>
												) : (
													<>
														予期しない状況や言語の壁に遭遇する可能性があります。冒険心と柔軟性が必要です。
														{formData.chaosLevel[0] === 5 && hasPremiumAccess && (
															<><br /><strong>プレミアム機能が有効です。</strong>究極の冒険をお楽しみください！</>
														)}
													</>
												)}
											</div>
										</div>
									</div>
								)}
							</CardContent>
						</Card>
					</div>

					{/* 除外設定 */}
					<Card className="border-orange-200">
						<CardHeader>
							<CardTitle>除外設定</CardTitle>
							<CardDescription>
								避けたい要素を選択してください（より本物の体験のために）
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid md:grid-cols-2 gap-4">
								<div className="flex items-center space-x-2">
									<Checkbox
										id="avoid-tourist"
										checked={formData.avoidTouristSpots}
										onCheckedChange={(checked) =>
											setFormData({
												...formData,
												avoidTouristSpots: checked as boolean,
											})
										}
									/>
									<Label htmlFor="avoid-tourist" className="text-sm">
										有名観光地を避ける
									</Label>
								</div>
								<div className="flex items-center space-x-2">
									<Checkbox
										id="avoid-japanese"
										checked={formData.avoidJapaneseServices}
										onCheckedChange={(checked) =>
											setFormData({
												...formData,
												avoidJapaneseServices: checked as boolean,
											})
										}
									/>
									<Label htmlFor="avoid-japanese" className="text-sm">
										日本語対応店舗を避ける
									</Label>
								</div>
								<div className="flex items-center space-x-2">
									<Checkbox
										id="avoid-crowded"
										checked={formData.avoidCrowdedAreas}
										onCheckedChange={(checked) =>
											setFormData({
												...formData,
												avoidCrowdedAreas: checked as boolean,
											})
										}
									/>
									<Label htmlFor="avoid-crowded" className="text-sm">
										混雑エリアを避ける
									</Label>
								</div>
							</div>

							{/* プレミアム除外設定 */}
							<div className="border-t pt-4">
								<div className="flex items-center justify-between mb-3">
									<div className="flex items-center space-x-2">
										<Crown className="h-4 w-4 text-orange-600" />
										<Label className="text-sm font-semibold text-orange-600">
											プレミアム除外設定
										</Label>
										{hasPremiumAccess && (
											<span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
												{premiumPlanType === 'monthly' ? '月額プラン' : '年額プラン'}有効
											</span>
										)}
									</div>
									{!hasPremiumAccess && (
										<Button
											variant="outline"
											size="sm"
											onClick={handlePremiumFeatureClick}
											className="text-orange-600 border-orange-300 hover:bg-orange-50"
										>
											プランを見る
										</Button>
									)}
								</div>
								
								<div className="grid md:grid-cols-1 gap-3">
									{/* SNS投稿済みスポット除外 */}
									<div 
										className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
											hasPremiumAccess 
												? 'border-green-300 bg-green-50' 
												: 'border-orange-300 bg-orange-50 hover:border-orange-400 hover:bg-orange-100'
										}`}
										onClick={() => {
											if (!hasPremiumAccess) {
												handlePremiumFeatureClick();
											}
										}}
									>
										<div className="flex items-center space-x-3">
											<div className={`w-5 h-5 rounded border-2 ${
												hasPremiumAccess 
													? 'border-green-500 bg-green-500' 
													: 'border-orange-400 bg-white'
											}`}>
											</div>
											<div className="flex-1">
												<div className="flex items-center justify-between">
													<Label htmlFor="avoid-sns" className="text-sm font-semibold cursor-pointer">
														SNS投稿済みスポットを除外
													</Label>
													{!hasPremiumAccess && (
														<span className="text-xs bg-orange-200 text-orange-800 px-3 py-1 rounded-full font-medium">
															プレミアム
														</span>
													)}
												</div>
												<p className="text-xs text-gray-600 mt-1">
													Instagram/TikTok等で投稿済みの場所を自動除外して完全未開拓地のみ
												</p>
											</div>
										</div>
									</div>

									{/* ガイドブック掲載スポット除外 */}
									<div 
										className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
											hasPremiumAccess 
												? 'border-green-300 bg-green-50' 
												: 'border-orange-300 bg-orange-50 hover:border-orange-400 hover:bg-orange-100'
										}`}
										onClick={() => {
											if (!hasPremiumAccess) {
												handlePremiumFeatureClick();
											}
										}}
									>
										<div className="flex items-center space-x-3">
											<div className={`w-5 h-5 rounded border-2 ${
												hasPremiumAccess 
													? 'border-green-500 bg-green-500' 
													: 'border-orange-400 bg-white'
											}`}>
											</div>
											<div className="flex-1">
												<div className="flex items-center justify-between">
													<Label htmlFor="avoid-guidebook" className="text-sm font-semibold cursor-pointer">
														ガイドブック掲載スポットを除外
													</Label>
													{!hasPremiumAccess && (
														<span className="text-xs bg-orange-200 text-orange-800 px-3 py-1 rounded-full font-medium">
															プレミアム
														</span>
													)}
												</div>
												<p className="text-xs text-gray-600 mt-1">
													地球の歩き方等の主要ガイドブック掲載場所を除外して真の隠れ名所のみ
												</p>
											</div>
										</div>
									</div>
								</div>
								
								{/* プレミアムプランの価値提案 */}
								{!hasPremiumAccess && (
									<div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-orange-100 to-red-100 border border-orange-200">
										<div className="flex items-start space-x-3">
											<Crown className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
											<div>
												<h4 className="font-medium text-gray-900 mb-2">🎯 プレミアムで得られる体験</h4>
												<ul className="text-sm text-gray-700 space-y-1">
													<li>• 誰も知らない「完全未開拓地」での独占体験</li>
													<li>• SNSやガイドブックにない真の隠れ名所</li>
													<li>• カオス度5の究極予測不可能体験</li>
													<li>• 帰国後に語れるユニークな冒険譚</li>
												</ul>
												<Button
													variant="link"
													className="p-0 h-auto text-orange-700 underline mt-2"
													onClick={handlePremiumFeatureClick}
												>
													月額¥1,980〜で全機能アンロック →
												</Button>
											</div>
										</div>
									</div>
								)}
							</div>
						</CardContent>
					</Card>

					{/* 送信ボタン */}
					<div className="flex justify-center">
						<Button
							type="submit"
							size="lg"
							className="bg-orange-600 hover:bg-orange-700 px-12 py-3 text-lg"
							disabled={isLoading}
						>
							<Compass className="mr-2 h-5 w-5" />
							{isLoading ? "隠れ名所を発見中..." : "隠れ名所を発見する"}
						</Button>
					</div>
				</form>
			</div>

			{/* プレミアムプラン課金モーダル */}
			<PremiumPlanModal
				isOpen={showPremiumPlanModal}
				onClose={() => {
					setShowPremiumPlanModal(false);
					// モーダルを閉じる際、カオス度が5のままなら4に戻す
					if (formData.chaosLevel[0] === 5 && !hasPremiumAccess) {
						setFormData({ ...formData, chaosLevel: [4] });
					}
				}}
				onUpgrade={handlePremiumPlanUpgrade}
			/>
		</div>
	);
}
