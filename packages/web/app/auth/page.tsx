"use client";

import { ArrowLeft, Chrome, Compass, UserCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function AuthPage() {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handleGoogleAuth = async () => {
		setIsLoading(true);
		// Firebase Google認証の実装
		setTimeout(() => {
			setIsLoading(false);
			router.push("/dashboard");
		}, 2000);
	};

	const handleGuestAuth = async () => {
		setIsLoading(true);
		// Firebase匿名認証の実装
		setTimeout(() => {
			setIsLoading(false);
			router.push("/dashboard");
		}, 1500);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-amber-50 flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				{/* Header */}
				<div className="text-center mb-8">
					<Link
						href="/"
						className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-4"
					>
						<ArrowLeft className="h-4 w-4 mr-2" />
						ホームに戻る
					</Link>
					<div className="flex items-center justify-center space-x-2 mb-4">
						<Compass className="h-8 w-8 text-orange-600" />
						<span className="text-2xl font-bold text-gray-900">OffPath</span>
					</div>
					<h1 className="text-2xl font-bold text-gray-900 mb-2">
						冒険を始めましょう
					</h1>
					<p className="text-gray-600">
						アカウントを作成して、真の隠れ名所を発見
					</p>
				</div>

				<Card className="border-orange-200 shadow-lg">
					<CardHeader className="text-center">
						<CardTitle className="text-xl">ログイン方法を選択</CardTitle>
						<CardDescription>
							お好みの方法でサービスを開始してください
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{/* Google認証 */}
						<Button
							onClick={handleGoogleAuth}
							disabled={true}
							className="w-full bg-gray-100 text-gray-500 border border-gray-200 shadow-sm cursor-not-allowed opacity-60"
							size="lg"
						>
							<Chrome className="mr-2 h-5 w-5 text-gray-400" />
							Googleでログイン（開発中）
						</Button>

						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<span className="w-full border-t border-gray-300" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-white px-2 text-gray-500">または</span>
							</div>
						</div>

						{/* ゲスト認証 */}
						<Button
							onClick={handleGuestAuth}
							disabled={isLoading}
							variant="outline"
							className="w-full border-orange-200 hover:bg-orange-50 text-orange-700 bg-transparent"
							size="lg"
						>
							<UserCheck className="mr-2 h-5 w-5" />
							{isLoading ? "ログイン中..." : "ゲストとしてログイン"}
						</Button>

						<div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mt-4">
							<p className="text-sm text-orange-800">
								<strong>Google認証について：</strong>
								<br />
								現在開発中です。実装が完了次第、ご利用いただけるようになります。
							</p>
							<p className="text-sm text-orange-800 mt-2">
								<strong>ゲストログインについて：</strong>
								<br />
								アカウント作成なしで、すぐにOffPathの全機能を体験できます。
							</p>
						</div>
					</CardContent>
				</Card>

				<p className="text-center text-sm text-gray-500 mt-6">
					ログインすることで、
					<Link href="#" className="text-orange-600 hover:underline">
						利用規約
					</Link>
					および
					<Link href="#" className="text-orange-600 hover:underline">
						プライバシーポリシー
					</Link>
					に同意したものとみなされます。
				</p>
			</div>
		</div>
	);
}
