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
import { ChaosLevel5Modal } from "@/components/ui/chaos-level-5-modal";
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
	});
	const [isLoading, setIsLoading] = useState(false);
	const [hasChaosLevel5Access, setHasChaosLevel5Access] = useState(false);
	const [showChaosLevel5Modal, setShowChaosLevel5Modal] = useState(false);

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
		if (newLevel === 5 && !hasChaosLevel5Access) {
			setShowChaosLevel5Modal(true);
			// スライダーの値を4に戻す
			setFormData({ ...formData, chaosLevel: [4] });
			return;
		}
		
		setFormData({ ...formData, chaosLevel: value });
	};

	const handleChaosLevel5Upgrade = async () => {
		// ここで実際の課金処理を行う
		// 仮実装として成功したことにする
		setHasChaosLevel5Access(true);
		setFormData({ ...formData, chaosLevel: [5] });
		setShowChaosLevel5Modal(false);
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
											{formData.chaosLevel[0] === 5 && hasChaosLevel5Access && (
												<Crown className="h-4 w-4 text-orange-600" />
											)}
										</div>
										<div className="text-sm text-orange-600 font-medium flex items-center space-x-2">
											<span>{chaosDescriptions[formData.chaosLevel[0] - 1]}</span>
											{formData.chaosLevel[0] === 5 && !hasChaosLevel5Access && (
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
											{!hasChaosLevel5Access && (
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
												{formData.chaosLevel[0] === 5 && !hasChaosLevel5Access ? (
													<>
														カオス度5は<strong>プレミアム機能</strong>です。
														言語サポートなしの完全現地体験、AI確信度50%程度の未知スポット、
														地元コミュニティイベント参加など、究極の冒険をお楽しみいただけます。
														<br />
														<Button
															variant="link"
															className="p-0 h-auto text-orange-700 underline"
															onClick={() => setShowChaosLevel5Modal(true)}
														>
															今すぐアンロック（¥1,000）
														</Button>
													</>
												) : (
													<>
														予期しない状況や言語の壁に遭遇する可能性があります。冒険心と柔軟性が必要です。
														{formData.chaosLevel[0] === 5 && hasChaosLevel5Access && (
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

			{/* カオス度5課金モーダル */}
			<ChaosLevel5Modal
				isOpen={showChaosLevel5Modal}
				onClose={() => {
					setShowChaosLevel5Modal(false);
					// モーダルを閉じる際、カオス度が5のままなら4に戻す
					if (formData.chaosLevel[0] === 5 && !hasChaosLevel5Access) {
						setFormData({ ...formData, chaosLevel: [4] });
					}
				}}
				onUpgrade={handleChaosLevel5Upgrade}
			/>
		</div>
	);
}
