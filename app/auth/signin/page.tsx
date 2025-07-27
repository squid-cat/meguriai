"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function SignIn() {
	const [isLoading, setIsLoading] = useState(false);
	const { loading, authenticated } = useAuth();

	// ローディング中または既に認証済みの場合は何も表示しない（フリッカリング防止）
	if (loading || authenticated) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
			</div>
		);
	}

	const handleGoogleSignIn = async () => {
		setIsLoading(true);
		try {
			await signIn("google", { callbackUrl: "/dashboard" });
		} catch (error) {
			console.error("Sign in error:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
			<div className="max-w-md w-full space-y-8 p-8">
				<div className="text-center">
					<div className="mx-auto h-32 w-32 mb-8">
						<img
							src="/images/tree/main-tree.svg"
							alt="Meguriai Tree"
							className="h-full w-full"
						/>
					</div>
					<h2 className="text-3xl font-bold text-gray-900 mb-2">Meguriai</h2>
					<p className="text-lg text-gray-600 mb-8">
						仕事が楽しくなるポモドーロタイマー
					</p>
					<p className="text-sm text-gray-500 mb-8">
						みんなで協力して仲良く作業しましょう！
						<br />
						作業した分だけ木が成長します🌳
					</p>
				</div>

				<div className="space-y-4">
					<button
						type="button"
						onClick={handleGoogleSignIn}
						disabled={isLoading}
						className="w-full flex justify-center items-center px-6 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isLoading ? (
							<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
						) : (
							<>
								<svg
									className="w-5 h-5 mr-3"
									viewBox="0 0 24 24"
									role="img"
									aria-label="Google logo"
								>
									<path
										fill="#4285F4"
										d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
									/>
									<path
										fill="#34A853"
										d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
									/>
									<path
										fill="#FBBC05"
										d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
									/>
									<path
										fill="#EA4335"
										d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
									/>
								</svg>
								Googleアカウントでログイン
							</>
						)}
					</button>
				</div>

				<div className="text-center text-xs text-gray-500">
					ログインすることで、利用規約とプライバシーポリシーに同意したものとみなされます。
				</div>
			</div>
		</div>
	);
}
