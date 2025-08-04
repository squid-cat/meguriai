import {
	ArrowRight,
	Compass,
	Globe,
	MapPin,
	Shield,
	Star,
	Users,
	Zap,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-amber-50">
			{/* Header */}
			<header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
				<div className="container mx-auto px-4 py-4 flex items-center justify-between">
					<div className="flex items-center space-x-2">
						<Compass className="h-8 w-8 text-orange-600" />
						<span className="text-2xl font-bold text-gray-900">OffPath</span>
					</div>
					<Link href="/auth">
						<Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold">
							冒険を始める
						</Button>
					</Link>
				</div>
			</header>

			{/* Hero Section */}
			<section className="py-20 px-4">
				<div className="container mx-auto max-w-7xl">
					<div className="grid lg:grid-cols-2 gap-12 items-center">
						{/* Left Content */}
						<div className="text-center lg:text-left">
							<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-[1.1] tracking-tight">
								誰も知らない
								<span className="text-orange-600 block bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent font-black">本物の旅</span>
								を見つけよう
							</h1>
							<p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed max-w-2xl font-medium">
								観光客というよりかは現地人に人気な「真の隠れ名所」だけを厳選し、
								<br />
								あなたの冒険譚を作るための旅行計画サービスです。
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
								<Link href="/auth">
									<Button
										size="lg"
										className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white text-lg px-8 py-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold"
									>
										冒険を始める
									</Button>
								</Link>
								<a href="#problems">
									<Button
										size="lg"
										variant="outline"
										className="text-lg px-8 py-4 border-2 border-orange-300 text-orange-700 hover:bg-orange-50 hover:border-orange-400 bg-white/50 backdrop-blur-sm transition-all duration-200 font-medium"
									>
										サービス詳細
									</Button>
								</a>
							</div>
						</div>
						
						{/* Right Content - Mockup */}
						<div className="relative">
							<div className="relative bg-white rounded-2xl shadow-2xl p-8 transform rotate-1 hover:rotate-0 transition-transform duration-300">
								<div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6">
									<div className="text-center mb-6">
										<h3 className="text-2xl font-bold text-gray-900 mb-2">
											ベトナム北部の隠れた名所発見！
										</h3>
										<div className="flex justify-center items-center space-x-4 text-sm text-gray-600">
											<span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">評価 4.8</span>
											<span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">現地限定</span>
											<span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full">観光客 0%</span>
										</div>
									</div>
									
									<div className="bg-white rounded-lg p-4 shadow-sm">
										<div className="w-full h-48 rounded-lg mb-4 relative overflow-hidden bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600">
											{/* Mountain silhouettes */}
											<div className="absolute inset-0">
												<div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-emerald-800 via-emerald-700 to-transparent opacity-80"></div>
												<div className="absolute bottom-0 left-10 w-20 h-24 bg-gradient-to-t from-emerald-900 to-emerald-700 transform -skew-x-12 opacity-70"></div>
												<div className="absolute bottom-0 right-16 w-16 h-20 bg-gradient-to-t from-emerald-900 to-emerald-700 transform skew-x-6 opacity-75"></div>
												<div className="absolute bottom-0 left-1/3 w-24 h-28 bg-gradient-to-t from-emerald-900 to-emerald-600 transform skew-x-3 opacity-65"></div>
											</div>
											
											{/* Mist/fog effect */}
											<div className="absolute inset-0 opacity-60">
												<div className="absolute top-1/4 left-0 w-full h-16 bg-gradient-to-r from-white/30 via-white/60 to-white/30 animate-pulse"></div>
												<div className="absolute top-1/2 right-0 w-3/4 h-12 bg-gradient-to-l from-white/40 via-white/20 to-transparent animate-pulse delay-700"></div>
											</div>
											
											{/* Sun rays */}
											<div className="absolute top-4 right-8 w-6 h-6 bg-yellow-300 rounded-full opacity-80 animate-pulse"></div>
											<div className="absolute top-6 right-10 w-16 h-0.5 bg-gradient-to-r from-yellow-200 to-transparent opacity-60 transform rotate-12"></div>
											<div className="absolute top-8 right-12 w-12 h-0.5 bg-gradient-to-r from-yellow-200 to-transparent opacity-50 transform rotate-45"></div>
											
											{/* Floating particles */}
											<div className="absolute top-16 left-8 w-1 h-1 bg-white rounded-full opacity-70 animate-bounce delay-300"></div>
											<div className="absolute top-20 right-20 w-1 h-1 bg-white rounded-full opacity-60 animate-bounce delay-500"></div>
											<div className="absolute top-32 left-16 w-1 h-1 bg-white rounded-full opacity-80 animate-bounce delay-1000"></div>
											
											{/* Location indicator */}
											<div className="absolute top-3 left-3 flex items-center space-x-1 bg-black/20 rounded-full px-2 py-1">
												<MapPin className="h-3 w-3 text-white" />
												<span className="text-white text-xs font-medium">Hidden Spot</span>
											</div>
										</div>
										<h4 className="font-semibold text-lg mb-2 text-gray-900">
											Cua Quang (アフターマーケット)
										</h4>
										<p className="text-gray-600 text-sm mb-3">
											バック地方の隠れた絶景スポット。現地の人だけが知る秘密の場所で、朝霧に包まれた山々の美しさは圧巻です。
										</p>
										<div className="flex items-center justify-between">
											<div className="flex items-center text-yellow-500">
												<Star className="h-4 w-4 fill-current" />
												<Star className="h-4 w-4 fill-current" />
												<Star className="h-4 w-4 fill-current" />
												<Star className="h-4 w-4 fill-current" />
												<Star className="h-4 w-4 fill-current" />
												<span className="ml-2 text-sm text-gray-600">現地評価 4.9</span>
											</div>
											<span className="text-xs text-gray-500">距離: 1.2km</span>
										</div>
									</div>
								</div>
								
								{/* Floating elements for visual appeal */}
								<div className="absolute -top-4 -right-4 bg-orange-500 text-white p-3 rounded-full shadow-lg">
									<MapPin className="h-6 w-6" />
								</div>
								<div className="absolute -bottom-2 -left-2 bg-green-500 text-white p-2 rounded-full shadow-lg">
									<Compass className="h-4 w-4" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Problem Section */}
			<section id="problems" className="py-16 px-4 bg-white/50">
				<div className="container mx-auto max-w-4xl">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold text-gray-900 mb-4">
							こんな旅行の悩み、ありませんか？
						</h2>
					</div>
					<div className="grid md:grid-cols-2 gap-8">
						<Card className="p-6 border-red-200/60 bg-gradient-to-br from-red-50 to-pink-50 shadow-md hover:shadow-lg transition-shadow duration-200">
							<CardContent className="p-0">
								<h3 className="text-xl font-bold text-red-900 mb-4 leading-tight">
									💔「またインスタで見た景色か...」
								</h3>
								<p className="text-red-800 leading-relaxed font-medium">
									せっかく海外まで来たのに、結局みんなが行く場所ばかり。友達に「どうだった？」と聞かれても、特別なエピソードが何もない。
								</p>
							</CardContent>
						</Card>
						<Card className="p-6 border-red-200/60 bg-gradient-to-br from-red-50 to-pink-50 shadow-md hover:shadow-lg transition-shadow duration-200">
							<CardContent className="p-0">
								<h3 className="text-xl font-bold text-red-900 mb-4 leading-tight">
									😰「現地の人に人気のお店は、どこにあるの？」
								</h3>
								<p className="text-red-800 leading-relaxed font-medium">
									現地語ができないから、結局観光客ばかりのお店しか行けない。でも本当は、現地の人が愛する隠れた名店を体験したい...
								</p>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* Testimonial Section */}
			<section className="py-16 px-4 bg-gradient-to-r from-orange-50 to-amber-50">
				<div className="container mx-auto max-w-4xl">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold text-gray-900 mb-4">
							<span className="text-orange-600">本物の旅</span>を体験した人たち
						</h2>
					</div>
					<div className="grid md:grid-cols-2 gap-8">
						<Card className="p-6 bg-white shadow-lg hover:shadow-xl border-orange-200/60 transition-all duration-200 hover:scale-[1.02]">
							<CardContent className="p-0">
								<div className="flex items-center mb-4">
									<div className="flex text-yellow-400">
										<Star className="h-4 w-4 fill-current" />
										<Star className="h-4 w-4 fill-current" />
										<Star className="h-4 w-4 fill-current" />
										<Star className="h-4 w-4 fill-current" />
										<Star className="h-4 w-4 fill-current" />
									</div>
									<span className="ml-2 text-sm text-gray-600 font-medium">東京都・Mさん</span>
								</div>
								<p className="text-gray-800 italic mb-4 leading-relaxed font-medium">
									「現地の家族経営の小さなレストランで、おばあちゃんが手作りの料理を振る舞ってくれました。言葉は通じないけれど、温かい笑顔と心からの歓迎。一生忘れられない夜になりました。」
								</p>
								<p className="text-sm text-orange-600 font-semibold bg-orange-50 px-3 py-1 rounded-full inline-block">📍 ベトナム・ホイアンの隠れた名店</p>
							</CardContent>
						</Card>
						<Card className="p-6 bg-white shadow-lg hover:shadow-xl border-orange-200/60 transition-all duration-200 hover:scale-[1.02]">
							<CardContent className="p-0">
								<div className="flex items-center mb-4">
									<div className="flex text-yellow-400">
										<Star className="h-4 w-4 fill-current" />
										<Star className="h-4 w-4 fill-current" />
										<Star className="h-4 w-4 fill-current" />
										<Star className="h-4 w-4 fill-current" />
										<Star className="h-4 w-4 fill-current" />
									</div>
									<span className="ml-2 text-sm text-gray-600 font-medium">大阪府・Tさん</span>
								</div>
								<p className="text-gray-800 italic mb-4 leading-relaxed font-medium">
									「地元の人だけが知る山奥の温泉を一人で探しに行きました。道に迷いそうになりながらも、やっと見つけた秘湯は絶景の中にあり、誰もいない自然の中で一人きり...こんな場所が存在するなんて信じられませんでした。」
								</p>
								<p className="text-sm text-orange-600 font-semibold bg-orange-50 px-3 py-1 rounded-full inline-block">📍 アイスランド・地元限定の隠れ温泉</p>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* Solution Section */}
			<section className="py-16 px-4">
				<div className="container mx-auto max-w-6xl">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold text-gray-900 mb-4">
							OffPathが解決します
						</h2>
						<p className="text-xl text-gray-600">
							現地メディア情報やマップアプリを解析し、観光客がまだ知らない真の隠れ名所を発見
						</p>
					</div>
					<div className="grid md:grid-cols-3 gap-8">
						<Card className="p-6 hover:shadow-lg transition-shadow border-orange-200">
							<CardContent className="p-0 text-center">
								<div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
									<Globe className="h-8 w-8 text-orange-600" />
								</div>
								<h3 className="text-xl font-semibold text-gray-900 mb-3">
									隠れ名所発見エンジン
								</h3>
								<p className="text-gray-600">
									現地メディア情報やマップアプリを解析し、話せる言語でのレビューや旅行記事が存在しない場所を発見
								</p>
							</CardContent>
						</Card>
						<Card className="p-6 hover:shadow-lg transition-shadow border-orange-200">
							<CardContent className="p-0 text-center">
								<div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
									<Zap className="h-8 w-8 text-orange-600" />
								</div>
								<h3 className="text-xl font-semibold text-gray-900 mb-3">
									カオス旅程ジェネレーター
								</h3>
								<p className="text-gray-600">
									予測不可能性を重視した、サプライズに満ちた旅程を自動生成
								</p>
							</CardContent>
						</Card>
						<Card className="p-6 hover:shadow-lg transition-shadow border-orange-200">
							<CardContent className="p-0 text-center">
								<div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
									<Shield className="h-8 w-8 text-orange-600" />
								</div>
								<h3 className="text-xl font-semibold text-gray-900 mb-3">
									現地サポートシステム
								</h3>
								<p className="text-gray-600">
									リアルタイム翻訳と緊急時サポートで、安心して冒険できる
								</p>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-16 px-4 bg-gradient-to-r from-orange-600 to-red-600 text-white">
				<div className="container mx-auto max-w-4xl text-center">
					<h2 className="text-3xl font-bold mb-4">
						カオスだけど最高な旅を設計
					</h2>
					<p className="text-xl mb-8 opacity-90">
						予測不可能で、刺激的で、でも間違いなく価値のある体験
					</p>
					<div className="grid md:grid-cols-2 gap-8">
						<div className="flex items-start space-x-4">
							<Star className="h-6 w-6 mt-1 flex-shrink-0" />
							<div className="text-left">
								<h3 className="font-semibold mb-2">真の現地体験</h3>
								<p className="opacity-90">
									観光客向けでない、現地人が本当に愛する場所での体験
								</p>
							</div>
						</div>
						<div className="flex items-start space-x-4">
							<MapPin className="h-6 w-6 mt-1 flex-shrink-0" />
							<div className="text-left">
								<h3 className="font-semibold mb-2">独占的な体験</h3>
								<p className="opacity-90">
									同じ国の人がまだ誰も行ったことのない場所での優越感
								</p>
							</div>
						</div>
						<div className="flex items-start space-x-4">
							<Zap className="h-6 w-6 mt-1 flex-shrink-0" />
							<div className="text-left">
								<h3 className="font-semibold mb-2">予測不可能な刺激</h3>
								<p className="opacity-90">
									計画されすぎない、サプライズに満ちた旅程
								</p>
							</div>
						</div>
						<div className="flex items-start space-x-4">
							<Users className="h-6 w-6 mt-1 flex-shrink-0" />
							<div className="text-left">
								<h3 className="font-semibold mb-2">ストーリー性</h3>
								<p className="opacity-90">
									帰国後に語れる、ユニークで印象的な旅行体験
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20 px-4 bg-white">
				<div className="container mx-auto max-w-4xl text-center">
					<h2 className="text-4xl font-bold text-gray-900 mb-6">
						あなたの旅を、誰もが体験できない
						<br />
						特別なものに変えませんか？
					</h2>
					<p className="text-xl text-gray-600 mb-8">
						次の旅行こそは、誰も知らない場所で本物の体験を
					</p>
					<Link href="/auth">
						<Button
							size="lg"
							className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white text-lg px-12 py-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold"
						>
							今すぐ冒険を始める
						</Button>
					</Link>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-gray-900 text-white py-12 px-4">
				<div className="container mx-auto max-w-4xl text-center">
					<div className="flex items-center justify-center space-x-2 mb-4">
						<Compass className="h-6 w-6 text-orange-400" />
						<span className="text-xl font-bold">OffPath</span>
					</div>
					<p className="text-gray-400 mb-4">真の隠れ名所で、本物の旅体験を</p>
					<p className="text-sm text-gray-500">
						© 2024 OffPath. All rights reserved.
					</p>
				</div>
			</footer>
		</div>
	);
}
