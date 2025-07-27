"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
	const { loading, authenticated } = useAuth();

	// ローディング中または既に認証済みの場合は適切に処理
	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
			</div>
		);
	}

	// 認証済みの場合は何も表示しない（useAuthフックがリダイレクトを処理）
	if (authenticated) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
			{/* Hero Section */}
			<div className="relative overflow-hidden">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
					<div className="text-center">
						<div className="mx-auto h-48 w-48 mb-12">
							<img
								src="/images/tree/main-tree.svg"
								alt="Meguriai Tree"
								className="h-full w-full"
							/>
						</div>

						<h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
							<span className="text-primary-600">Meguriai</span>
						</h1>

						<p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
							仕事が楽しくなるポモドーロタイマー
							<br />
							みんなで協力して仲良く作業しましょう！
						</p>

						<div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
							<Link
								href="/auth/signin"
								className="btn-primary inline-block px-8 py-3 text-lg"
							>
								始める
							</Link>
						</div>
					</div>
				</div>
			</div>

			{/* Features Section */}
			<div className="py-24 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h2 className="text-3xl font-bold text-gray-900 mb-4">特徴</h2>
						<p className="text-lg text-gray-600">
							作業をもっと楽しく、もっと効率的に
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="text-center p-6">
							<div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
								<svg
									className="w-8 h-8 text-primary-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									role="img"
									aria-label="Timer icon"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
							<h3 className="text-lg font-semibold text-gray-900 mb-3">
								ポモドーロタイマー
							</h3>
							<p className="text-gray-600">
								25分の集中作業と5分の休憩を繰り返して、効率的に作業を進められます。
							</p>
						</div>

						<div className="text-center p-6">
							<div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
								<svg
									className="w-8 h-8 text-primary-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									role="img"
									aria-label="Collaboration icon"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
									/>
								</svg>
							</div>
							<h3 className="text-lg font-semibold text-gray-900 mb-3">
								チームで成長
							</h3>
							<p className="text-gray-600">
								みんなの作業がひとつの木を育てます。仲間と一緒に成長を実感できます。
							</p>
						</div>

						<div className="text-center p-6">
							<div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
								<svg
									className="w-8 h-8 text-primary-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									role="img"
									aria-label="Analytics icon"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
									/>
								</svg>
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-2">
								作業記録
							</h3>
							<p className="text-gray-600">
								日々の作業時間を記録・分析して成長を実感
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* CTA Section */}
			<div className="py-16 bg-primary-600">
				<div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
					<h2 className="text-3xl font-bold text-white mb-4">
						今すぐ始めましょう
					</h2>
					<p className="text-xl text-primary-100 mb-8">
						Googleアカウントがあればすぐに利用開始できます
					</p>
					<Link
						href="/auth/signin"
						className="inline-block bg-white text-primary-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200"
					>
						無料で始める
					</Link>
				</div>
			</div>
		</div>
	);
}
