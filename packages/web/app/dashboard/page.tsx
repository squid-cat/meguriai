"use client";

import {
	Clock,
	Compass,
	Globe,
	MapPin,
	Plus,
	Star,
	TrendingUp,
	Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function Dashboard() {
	const [recentTrips] = useState([
		{
			id: 1,
			destination: "バリ島周辺",
			status: "計画中",
			hiddenSpots: 12,
			chaosLevel: 4,
			createdAt: "2024-01-15",
		},
		{
			id: 2,
			destination: "ベトナム北部",
			status: "完了",
			hiddenSpots: 8,
			chaosLevel: 5,
			createdAt: "2023-12-20",
		},
	]);

	const [stats] = useState({
		totalTrips: 3,
		hiddenSpotsFound: 28,
		countriesExplored: 5,
		chaosScore: 4.2,
	});

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-amber-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Compass className="h-8 w-8 text-orange-600" />
            <span className="text-2xl font-bold text-gray-900">OffPath</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="border-orange-200 text-orange-700">
              冒険者レベル: 探検家
            </Badge>
            <Button variant="outline" size="sm">
              プロフィール
            </Button>
          </div>
        </div>
      </header>

			<div className="container mx-auto px-4 py-8 max-w-6xl">
				{/* Welcome Section */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						おかえりなさい、冒険者さん！
					</h1>
					<p className="text-gray-600">次はどこの隠れ名所を発見しますか？</p>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
					<Card className="border-orange-200">
						<CardContent className="p-4 text-center">
							<div className="text-2xl font-bold text-orange-600 mb-1">
								{stats.totalTrips}
							</div>
							<div className="text-sm text-gray-600">総旅行数</div>
						</CardContent>
					</Card>
					<Card className="border-orange-200">
						<CardContent className="p-4 text-center">
							<div className="text-2xl font-bold text-orange-600 mb-1">
								{stats.hiddenSpotsFound}
							</div>
							<div className="text-sm text-gray-600">発見した隠れ名所</div>
						</CardContent>
					</Card>
					<Card className="border-orange-200">
						<CardContent className="p-4 text-center">
							<div className="text-2xl font-bold text-orange-600 mb-1">
								{stats.countriesExplored}
							</div>
							<div className="text-sm text-gray-600">探検した国</div>
						</CardContent>
					</Card>
					<Card className="border-orange-200">
						<CardContent className="p-4 text-center">
							<div className="text-2xl font-bold text-orange-600 mb-1">
								{stats.chaosScore}
							</div>
							<div className="text-sm text-gray-600">平均カオス度</div>
						</CardContent>
					</Card>
				</div>

				<div className="grid lg:grid-cols-3 gap-8">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-6">
						{/* Quick Actions */}
						<Card className="border-orange-200">
							<CardHeader>
								<CardTitle className="flex items-center">
									<Zap className="h-5 w-5 mr-2 text-orange-600" />
									新しい冒険を始める
								</CardTitle>
								<CardDescription>
									AIが厳選した隠れ名所で、予測不可能な旅を計画しましょう
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Link href="/create-trip">
									<Button
										className="w-full bg-orange-600 hover:bg-orange-700 text-lg font-bold py-6"
										size="lg"
									>
										<Plus className="mr-3 h-6 w-6" />
										旅行を計画する
									</Button>
								</Link>
							</CardContent>
						</Card>

						{/* Recent Trips */}
						<Card className="border-orange-200">
							<CardHeader>
								<CardTitle className="flex items-center">
									<Clock className="h-5 w-5 mr-2 text-orange-600" />
									最近の旅行
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								{recentTrips.map((trip) => (
									<div
										key={trip.id}
										className="flex items-center justify-between p-4 border border-orange-100 rounded-lg hover:bg-orange-50/50 transition-colors"
									>
										<div className="flex items-center space-x-4">
											<div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
												<MapPin className="h-6 w-6 text-orange-600" />
											</div>
											<div>
												<h3 className="font-semibold text-gray-900">
													{trip.destination}
												</h3>
												<div className="flex items-center space-x-4 text-sm text-gray-600">
													<span>{trip.hiddenSpots}箇所の隠れ名所</span>
													<span>カオス度: {trip.chaosLevel}/5</span>
												</div>
											</div>
										</div>
										<div className="text-right">
											<Badge
												variant={
													trip.status === "完了" ? "default" : "secondary"
												}
												className={
													trip.status === "完了"
														? "bg-green-100 text-green-800"
														: "bg-orange-100 text-orange-800"
												}
											>
												{trip.status}
											</Badge>
											<div className="text-sm text-gray-500 mt-1">
												{new Date(trip.createdAt).toLocaleDateString("ja-JP")}
											</div>
										</div>
									</div>
								))}
							</CardContent>
						</Card>
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						{/* Discovery Insights */}
						<Card className="border-orange-200">
							<CardHeader>
								<CardTitle className="flex items-center text-lg">
									<TrendingUp className="h-5 w-5 mr-2 text-orange-600" />
									発見の洞察
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center space-x-3">
									<div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
										<Globe className="h-4 w-4 text-orange-600" />
									</div>
									<div>
										<div className="font-medium text-sm">新しい地域</div>
										<div className="text-xs text-gray-600">
											東南アジアで3つの未開拓エリア発見
										</div>
									</div>
								</div>
								<div className="flex items-center space-x-3">
									<div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
										<Star className="h-4 w-4 text-orange-600" />
									</div>
									<div>
										<div className="font-medium text-sm">高評価スポット</div>
										<div className="text-xs text-gray-600">
											現地評価4.8以上の隠れ家レストラン
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Community Highlights */}
						<Card className="border-orange-200">
							<CardHeader>
								<CardTitle className="text-lg">
									コミュニティハイライト
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="text-sm">
									<div className="font-medium text-gray-900">今週の発見</div>
									<div className="text-gray-600">ラオスの秘境温泉が話題に</div>
								</div>
								<div className="text-sm">
									<div className="font-medium text-gray-900">冒険者の声</div>
									<div className="text-gray-600">
										「想像を超える体験でした」
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Tips */}
						<Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-red-50">
							<CardHeader>
								<CardTitle className="text-lg text-orange-800">
									冒険のヒント
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-orange-700">
									カオス度を上げると、より予測不可能で刺激的な体験ができます。初回は3-4レベルがおすすめです。
								</p>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
