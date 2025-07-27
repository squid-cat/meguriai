"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { authApi, usersApi } from "@/lib/api";

interface Avatar {
	id: number;
	name: string;
	imagePath: string;
}

export default function Profile() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [userName, setUserName] = useState("");
	const [selectedAvatarId, setSelectedAvatarId] = useState(1);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [currentUserId, setCurrentUserId] = useState<string | null>(null);

	// 利用可能なアバター一覧
	const avatars: Avatar[] = [
		{ id: 1, name: "人間1", imagePath: "/images/avatars/human-1.svg" },
		{ id: 2, name: "人間2", imagePath: "/images/avatars/human-2.svg" },
		{ id: 3, name: "人間3", imagePath: "/images/avatars/human-3.svg" },
		{ id: 4, name: "猫1", imagePath: "/images/avatars/cat-1.svg" },
		{ id: 5, name: "猫2", imagePath: "/images/avatars/cat-2.svg" },
		{ id: 6, name: "犬1", imagePath: "/images/avatars/dog-1.svg" },
		{ id: 7, name: "犬2", imagePath: "/images/avatars/dog-2.svg" },
		{ id: 8, name: "うさぎ", imagePath: "/images/avatars/rabbit-1.svg" },
		{ id: 9, name: "クマ", imagePath: "/images/avatars/bear-1.svg" },
		{ id: 10, name: "キツネ", imagePath: "/images/avatars/fox-1.svg" },
	];

	useEffect(() => {
		if (status === "unauthenticated") {
			router.push("/auth/signin");
		}
	}, [status, router]);

	useEffect(() => {
		// 実際のAPIから現在のユーザー情報を取得
		const fetchUserProfile = async () => {
			if (!session) return;

			try {
				setLoading(true);

				// 認証状態を確認してユーザー情報を取得
				const authStatus = await authApi.getAuthStatus();

				if (!authStatus || "error" in authStatus || !authStatus.authenticated) {
					router.push("/auth/signin");
					return;
				}

				if (authStatus.needsSetup) {
					console.log("User needs setup");
					return;
				}

				const currentUser = (
					authStatus as unknown as {
						user: { id: string; name: string; avatarId: number };
					}
				).user;
				if (!currentUser) {
					console.error("No current user found");
					return;
				}

				setCurrentUserId(currentUser.id);
				setUserName(currentUser.name || "");
				setSelectedAvatarId(currentUser.avatarId || 1);
			} catch (error) {
				console.error("Failed to fetch user profile:", error);
				// エラー時はセッション情報をフォールバック
				setUserName(session?.user?.name || "");
				setSelectedAvatarId(1);
			} finally {
				setLoading(false);
			}
		};

		if (session) {
			fetchUserProfile();
		}
	}, [session, router]);

	const handleSave = async () => {
		if (!currentUserId) {
			alert("ユーザー情報が取得できません");
			return;
		}

		setSaving(true);

		try {
			// 実際のAPIでプロフィールを更新
			const updateResponse = await usersApi.updateUser(currentUserId, {
				name: userName.trim(),
				avatarId: selectedAvatarId,
			});

			if (updateResponse && !("error" in updateResponse)) {
				alert("プロフィールを更新しました！");
			} else {
				throw new Error("Failed to update profile");
			}
		} catch (error) {
			console.error("Failed to update profile:", error);
			alert("プロフィールの更新に失敗しました");
		} finally {
			setSaving(false);
		}
	};

	const handleSignOut = async () => {
		const { signOut } = await import("next-auth/react");
		await signOut({ callbackUrl: "/" });
	};

	if (status === "loading" || loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
			</div>
		);
	}

	if (!session) {
		return null;
	}

	const selectedAvatar = avatars.find(
		(avatar) => avatar.id === selectedAvatarId,
	);

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
			{/* Header */}
			<header className="bg-white shadow-sm border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center py-4">
						<div className="flex items-center space-x-4">
							<h1 className="text-2xl font-bold text-primary-600">Meguriai</h1>
							<span className="text-gray-600">
								こんにちは、{session.user?.name}さん
							</span>
						</div>

						<div className="flex items-center space-x-4">
							<nav className="hidden md:flex space-x-6">
								<a
									href="/dashboard"
									className="text-gray-600 hover:text-gray-900"
								>
									ダッシュボード
								</a>
								<a
									href="/analytics"
									className="text-gray-600 hover:text-gray-900"
								>
									分析
								</a>
								<a href="/profile" className="text-primary-600 font-medium">
									プロフィール
								</a>
							</nav>

							<button
								type="button"
								onClick={handleSignOut}
								className="text-gray-600 hover:text-gray-900"
							>
								ログアウト
							</button>
						</div>
					</div>
				</div>
			</header>

			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="mb-8">
					<h2 className="text-3xl font-bold text-gray-900 mb-2">
						プロフィール設定
					</h2>
					<p className="text-gray-600">アバターと名前を変更できます</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* Current Profile */}
					<div className="card">
						<h3 className="text-xl font-semibold text-gray-900 mb-6">
							現在のプロフィール
						</h3>

						<div className="text-center mb-6">
							<div className="w-32 h-32 mx-auto mb-4">
								<img
									src={selectedAvatar?.imagePath}
									alt={selectedAvatar?.name}
									className="w-full h-full rounded-full border-4 border-primary-300"
								/>
							</div>
							<h4 className="text-xl font-bold text-gray-900 mb-2">
								{userName}
							</h4>
							<p className="text-gray-600">{selectedAvatar?.name}</p>
						</div>

						<div className="space-y-4">
							<div>
								<label
									htmlFor="user-name"
									className="block text-sm font-medium text-gray-700 mb-2"
								>
									名前
								</label>
								<input
									id="user-name"
									type="text"
									value={userName}
									onChange={(e) => setUserName(e.target.value)}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
									placeholder="お名前を入力してください"
								/>
							</div>

							<button
								type="button"
								onClick={handleSave}
								disabled={saving || !userName.trim()}
								className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
									saving || !userName.trim()
										? "bg-gray-300 text-gray-500 cursor-not-allowed"
										: "bg-primary-600 hover:bg-primary-700 text-white"
								}`}
							>
								{saving ? "保存中..." : "プロフィールを保存"}
							</button>
						</div>
					</div>

					{/* Avatar Selection */}
					<div className="card">
						<h3 className="text-xl font-semibold text-gray-900 mb-6">
							アバターを選択
						</h3>

						<div className="grid grid-cols-5 gap-4">
							{avatars.map((avatar) => (
								<button
									key={avatar.id}
									type="button"
									onClick={() => setSelectedAvatarId(avatar.id)}
									className={`p-2 rounded-lg border-2 transition-colors ${
										selectedAvatarId === avatar.id
											? "border-primary-500 bg-primary-50"
											: "border-gray-200 hover:border-gray-300"
									}`}
									title={avatar.name}
								>
									<img
										src={avatar.imagePath}
										alt={avatar.name}
										className="w-full h-full rounded-lg"
									/>
								</button>
							))}
						</div>

						<div className="mt-6">
							<p className="text-sm text-gray-600 mb-2">選択中のアバター:</p>
							<p className="font-medium text-gray-900">
								{selectedAvatar?.name}
							</p>
						</div>
					</div>
				</div>

				{/* Account Info */}
				<div className="mt-8">
					<div className="card">
						<h3 className="text-xl font-semibold text-gray-900 mb-4">
							アカウント情報
						</h3>

						<div className="space-y-3">
							<div className="flex justify-between">
								<span className="text-gray-600">ログイン方法</span>
								<span className="font-medium">Google アカウント</span>
							</div>

							<div className="flex justify-between">
								<span className="text-gray-600">メールアドレス</span>
								<span className="font-medium">{session.user?.email}</span>
							</div>

							<div className="flex justify-between">
								<span className="text-gray-600">最終ログイン</span>
								<span className="font-medium">今日</span>
							</div>
						</div>
					</div>
				</div>

				{/* Account Actions */}
				<div className="mt-8">
					<div className="card">
						<h3 className="text-xl font-semibold text-gray-900 mb-4">
							アカウント操作
						</h3>

						<div className="flex flex-col sm:flex-row gap-4">
							<button
								type="button"
								onClick={handleSignOut}
								className="flex-1 py-2 px-4 rounded-lg border border-red-300 text-red-700 hover:bg-red-50 transition-colors"
							>
								ログアウト
							</button>

							<button
								type="button"
								className="flex-1 py-2 px-4 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
								disabled
							>
								アカウント削除（準備中）
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
