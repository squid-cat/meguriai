"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";
import PomodoroTimer from "@/components/PomodoroTimer";
import { dashboardApi, usersApi, workRecordsApi } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

interface DashboardData {
	totalPoints: number;
	activeUsers: { id: string; name: string; avatarId: number }[];
	currentUser: { id: string; name: string; avatarId: number } | null;
}

interface TodayStats {
	totalMinutes: number;
	pomodoroCount: number;
	manualCount: number;
	totalRecords: number;
}

export default function Dashboard() {
	const { user, loading: authLoading, authenticated } = useAuth();
	const [dashboardData, setDashboardData] = useState<DashboardData>({
		totalPoints: 0,
		activeUsers: [],
		currentUser: null,
	});
	const [todayStats, setTodayStats] = useState<TodayStats>({
		totalMinutes: 0,
		pomodoroCount: 0,
		manualCount: 0,
		totalRecords: 0,
	});
	const [manualWorkTime, setManualWorkTime] = useState("");
	const [manualWorkMemo, setManualWorkMemo] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// 認証が完了したらダッシュボードデータを取得
		const initializeDashboard = async () => {
			if (!authenticated || !user) return;

			try {
				setLoading(true);

				// ダッシュボードデータを取得
				const dashboardResponse = await dashboardApi.getDashboardData();

				if (!dashboardResponse || "error" in dashboardResponse) {
					console.error("Dashboard data error:", dashboardResponse);
					throw new Error("Failed to fetch dashboard data");
				}

				setDashboardData({
					totalPoints:
						(dashboardResponse as unknown as { totalPoints: number })
							.totalPoints || 0,
					activeUsers:
						(
							dashboardResponse as unknown as {
								activeUsers: Array<{
									id: string;
									name: string;
									avatarId: number;
								}>;
							}
						).activeUsers || [],
					currentUser: {
						id: user.id,
						name: user.name,
						avatarId: user.avatarId,
					},
				});

				// 今日の実績を取得
				try {
					const todayResponse = await usersApi.getUserToday(user.id);
					if (todayResponse && !("error" in todayResponse)) {
						setTodayStats({
							totalMinutes:
								(todayResponse as unknown as { totalMinutes: number })
									.totalMinutes || 0,
							pomodoroCount:
								(todayResponse as unknown as { pomodoroCount: number })
									.pomodoroCount || 0,
							manualCount:
								(todayResponse as unknown as { manualCount: number })
									.manualCount || 0,
							totalRecords:
								(todayResponse as unknown as { totalRecords: number })
									.totalRecords || 0,
						});
					}
				} catch (error) {
					console.error("Failed to fetch today stats:", error);
				}
			} catch (error) {
				console.error("Failed to initialize dashboard:", error);
			} finally {
				setLoading(false);
			}
		};

		if (authenticated && user) {
			initializeDashboard();
			
			// 30秒間隔でダッシュボードデータを更新
			const interval = setInterval(async () => {
				try {
					const [dashboardResponse, todayResponse] = await Promise.all([
						dashboardApi.getDashboardData(),
						usersApi.getUserToday(user.id),
					]);

					if (dashboardResponse && !("error" in dashboardResponse)) {
						setDashboardData((prev) => ({
							...prev,
							totalPoints:
								(dashboardResponse as unknown as { totalPoints: number })
									.totalPoints || 0,
							activeUsers:
								(
									dashboardResponse as unknown as {
										activeUsers: Array<{
											id: string;
											name: string;
											avatarId: number;
										}>;
									}
								).activeUsers || [],
						}));
					}

					if (todayResponse && !("error" in todayResponse)) {
						setTodayStats({
							totalMinutes:
								(todayResponse as unknown as { totalMinutes: number })
									.totalMinutes || 0,
							pomodoroCount:
								(todayResponse as unknown as { pomodoroCount: number })
									.pomodoroCount || 0,
							manualCount:
								(todayResponse as unknown as { manualCount: number })
									.manualCount || 0,
							totalRecords:
								(todayResponse as unknown as { totalRecords: number })
									.totalRecords || 0,
						});
					}
				} catch (error) {
					console.error("Failed to refresh dashboard data:", error);
				}
			}, 30000);

			return () => clearInterval(interval);
		}
	}, [authenticated, user]);

	const handlePomodoroComplete = async (workPoints: number) => {
		if (!user?.id) {
			console.error("No current user ID for pomodoro completion");
			return;
		}

		try {
			await workRecordsApi.completePomodoroSession({
				userId: user.id,
				workPoints: Math.round(workPoints),
			});
			console.log(`ポモドーロ完了: ${workPoints}分`);

			// ダッシュボードデータと今日の実績を再取得
			const [dashboardResponse, todayResponse] = await Promise.all([
				dashboardApi.getDashboardData(),
				usersApi.getUserToday(user.id),
			]);

			if (dashboardResponse && !("error" in dashboardResponse)) {
				setDashboardData((prev) => ({
					...prev,
					totalPoints:
						(dashboardResponse as unknown as { totalPoints: number })
							.totalPoints || prev.totalPoints,
				}));
			}

			if (todayResponse && !("error" in todayResponse)) {
				setTodayStats({
					totalMinutes:
						(todayResponse as unknown as { totalMinutes: number })
							.totalMinutes || 0,
					pomodoroCount:
						(todayResponse as unknown as { pomodoroCount: number })
							.pomodoroCount || 0,
					manualCount:
						(todayResponse as unknown as { manualCount: number }).manualCount ||
						0,
					totalRecords:
						(todayResponse as unknown as { totalRecords: number })
							.totalRecords || 0,
				});
			}
		} catch (error) {
			console.error("Failed to record pomodoro completion:", error);
			alert("ポモドーロの記録に失敗しました");
		}
	};

	const handleManualWorkSubmit = async () => {
		const workTime = parseInt(manualWorkTime);
		if (!workTime || workTime <= 0) {
			alert("正しい作業時間を入力してください");
			return;
		}

		if (!user?.id) {
			console.error("No current user ID for manual work record");
			alert("ユーザー情報が取得できません");
			return;
		}

		try {
			await workRecordsApi.createWorkRecord({
				userId: user.id,
				workPoints: workTime,
				memo: manualWorkMemo.trim() || undefined,
			});

			console.log(`手動記録: ${workTime}分 - ${manualWorkMemo}`);
			setManualWorkTime("");
			setManualWorkMemo("");
			alert("作業時間を記録しました！");

			// ダッシュボードデータと今日の実績を再取得
			const [dashboardResponse, todayResponse] = await Promise.all([
				dashboardApi.getDashboardData(),
				usersApi.getUserToday(user.id),
			]);

			if (dashboardResponse && !("error" in dashboardResponse)) {
				setDashboardData((prev) => ({
					...prev,
					totalPoints:
						(dashboardResponse as unknown as { totalPoints: number })
							.totalPoints || prev.totalPoints,
				}));
			}

			if (todayResponse && !("error" in todayResponse)) {
				setTodayStats({
					totalMinutes:
						(todayResponse as unknown as { totalMinutes: number })
							.totalMinutes || 0,
					pomodoroCount:
						(todayResponse as unknown as { pomodoroCount: number })
							.pomodoroCount || 0,
					manualCount:
						(todayResponse as unknown as { manualCount: number }).manualCount ||
						0,
					totalRecords:
						(todayResponse as unknown as { totalRecords: number })
							.totalRecords || 0,
				});
			}
		} catch (error) {
			console.error("Failed to create manual work record:", error);
			alert("作業時間の記録に失敗しました");
		}
	};

	const handleSignOut = async () => {
		await signOut({ callbackUrl: "/" });
	};

	if (authLoading || loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
			</div>
		);
	}

	if (!session) {
		return null;
	}

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
								<a href="/dashboard" className="text-primary-600 font-medium">
									ダッシュボード
								</a>
								<a
									href="/analytics"
									className="text-gray-600 hover:text-gray-900"
								>
									分析
								</a>
								<a
									href="/profile"
									className="text-gray-600 hover:text-gray-900"
								>
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

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Main Tree Section */}
					<div className="lg:col-span-2">
						<div className="card text-center">
							<h2 className="text-2xl font-bold text-gray-900 mb-6">
								みんなの成長の木
							</h2>

							<div className="relative mb-6">
								<div className="mx-auto h-64 w-64">
									<img
										src="/images/tree/main-tree.svg"
										alt="成長の木"
										className="h-full w-full"
									/>
								</div>

								{/* Active Users Around Tree */}
								<div className="absolute inset-0 flex items-center justify-center">
									<div className="relative w-80 h-80">
										{dashboardData.activeUsers.map((user, index) => {
											const angle =
												(index / dashboardData.activeUsers.length) * 360;
											const radius = 120;
											const x = Math.cos((angle * Math.PI) / 180) * radius;
											const y = Math.sin((angle * Math.PI) / 180) * radius;

											return (
												<div
													key={user.id}
													className="absolute w-12 h-12 transform -translate-x-1/2 -translate-y-1/2"
													style={{
														left: `50%`,
														top: `50%`,
														transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
													}}
												>
													<img
														src={`/images/avatars/human-${user.avatarId}.svg`}
														alt={`${user.name}のアバター`}
														className="w-full h-full rounded-full border-2 border-primary-300"
														title={user.name}
													/>
												</div>
											);
										})}
									</div>
								</div>
							</div>

							<div className="text-5xl font-bold text-primary-600 mb-4">
								{dashboardData.totalPoints.toLocaleString()} pt
							</div>
							<p className="text-gray-600">
								今日の総作業時間: {Math.floor(dashboardData.totalPoints / 60)}
								時間{dashboardData.totalPoints % 60}分
							</p>
						</div>
					</div>

					{/* Timer Section */}
					<div className="space-y-6">
						{/* Pomodoro Timer */}
						<PomodoroTimer onComplete={handlePomodoroComplete} />

						{/* Manual Work Entry */}
						<div className="card">
							<h3 className="text-xl font-semibold text-gray-900 mb-4">
								作業時間を記録
							</h3>

							<div className="space-y-4">
								<div>
									<label
										htmlFor="manual-work-time"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										作業時間（分）
									</label>
									<input
										id="manual-work-time"
										type="number"
										value={manualWorkTime}
										onChange={(e) => setManualWorkTime(e.target.value)}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
										placeholder="25"
										min="1"
									/>
								</div>

								<div>
									<label
										htmlFor="manual-work-memo"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										メモ（任意）
									</label>
									<textarea
										id="manual-work-memo"
										value={manualWorkMemo}
										onChange={(e) => setManualWorkMemo(e.target.value)}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
										rows={3}
										placeholder="何をしましたか？"
									/>
								</div>

								<button
									type="button"
									onClick={handleManualWorkSubmit}
									className="w-full btn-primary"
								>
									記録する
								</button>
							</div>
						</div>

						{/* Today's Stats */}
						<div className="card">
							<h3 className="text-xl font-semibold text-gray-900 mb-4">
								今日の実績
							</h3>

							<div className="space-y-3">
								<div className="flex justify-between">
									<span className="text-gray-600">作業時間</span>
									<span className="font-medium">
										{Math.floor(todayStats.totalMinutes / 60)}時間
										{todayStats.totalMinutes % 60}分
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600">ポモドーロ回数</span>
									<span className="font-medium">
										{todayStats.pomodoroCount}回
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600">手動記録回数</span>
									<span className="font-medium">
										{todayStats.manualCount}回
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600">獲得ポイント</span>
									<span className="font-medium text-primary-600">
										{todayStats.totalMinutes} pt
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
