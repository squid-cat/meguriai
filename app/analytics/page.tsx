"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { useAuth } from "@/hooks/useAuth";
import { workRecordsApi } from "@/lib/api";

interface WorkRecord {
	id: string;
	date: string;
	workTime: number; // minutes
	type: "pomodoro" | "manual";
	memo?: string;
}

interface DailyStats {
	date: string;
	totalMinutes: number;
	pomodoroCount: number;
	manualCount: number;
}

export default function Analytics() {
	const { user, loading: authLoading, authenticated } = useAuth();
	const router = useRouter();

	// 認証チェックとリダイレクト
	useEffect(() => {
		if (!authLoading && !authenticated) {
			router.push("/auth/signin");
		}
	}, [authLoading, authenticated, router]);

	const [workRecords, setWorkRecords] = useState<WorkRecord[]>([]);
	const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
	const [loading, setLoading] = useState(true);

	// 認証が完了したら分析データを取得
	if (authenticated && user && workRecords.length === 0 && !loading) {
		const fetchAnalyticsData = async () => {
			try {
				setLoading(true);

				// 並列で作業記録と統計を取得
				const [recordsResponse, statsResponse] = await Promise.all([
					workRecordsApi.getWorkRecords(user.id, 50, 0),
					workRecordsApi.getWorkStats(user.id),
				]);

				if (
					recordsResponse &&
					!("error" in recordsResponse) &&
					recordsResponse.records
				) {
					// APIレスポンスを画面用の形式に変換
					const formattedRecords: WorkRecord[] = recordsResponse.records.map(
						(record: {
							id: string;
							recordedAt: string;
							workMinutes: number;
							recordType: string;
							memo?: string | null;
						}) => ({
							id: record.id,
							date: record.recordedAt
								? new Date(record.recordedAt).toISOString().split("T")[0]
								: new Date().toISOString().split("T")[0],
							workTime: record.workMinutes, // workPoints → workMinutes に修正
							type: record.recordType === "POMODORO" ? "pomodoro" : "manual",
							memo: record.memo || undefined,
						}),
					);

					setWorkRecords(formattedRecords);

					// 3. 統計APIからのデータがある場合はそれを使用、ない場合はクライアント側で計算
					if (
						statsResponse &&
						!("error" in statsResponse) &&
						(
							statsResponse as unknown as {
								dailyStats: Record<
									string,
									{
										totalMinutes: number;
										pomodoroCount: number;
										manualCount: number;
									}
								>;
							}
						).dailyStats
					) {
						const apiDailyStats = (
							statsResponse as unknown as {
								dailyStats: Record<
									string,
									{
										totalMinutes: number;
										pomodoroCount: number;
										manualCount: number;
									}
								>;
							}
						).dailyStats;
						const stats: DailyStats[] = [];

						// 過去7日間の統計を生成（APIデータ + クライアント計算のハイブリッド）
						const today = new Date();
						for (let i = 6; i >= 0; i--) {
							const date = new Date(today);
							date.setDate(date.getDate() - i);
							const dateStr = date.toISOString().split("T")[0];
							const dayName = date.toLocaleDateString("ja-JP", {
								weekday: "short",
							});

							// APIから該当日のデータを探す
							const apiData = apiDailyStats[dateStr];
							if (apiData) {
								stats.push({
									date: `${date.getMonth() + 1}/${date.getDate()} (${dayName})`,
									totalMinutes: apiData.totalMinutes,
									pomodoroCount: apiData.pomodoroCount,
									manualCount: apiData.manualCount,
								});
							} else {
								// APIにデータがない場合はクライアント側で計算
								const dayRecords = formattedRecords.filter(
									(record) => record.date === dateStr,
								);
								const totalMinutes = dayRecords.reduce(
									(sum, record) => sum + record.workTime,
									0,
								);
								const pomodoroCount = dayRecords.filter(
									(record) => record.type === "pomodoro",
								).length;
								const manualCount = dayRecords.filter(
									(record) => record.type === "manual",
								).length;

								stats.push({
									date: `${date.getMonth() + 1}/${date.getDate()} (${dayName})`,
									totalMinutes,
									pomodoroCount,
									manualCount,
								});
							}
						}

						setDailyStats(stats);
					} else {
						// 統計APIが利用できない場合はクライアント側で計算
						const today = new Date();
						const stats: DailyStats[] = [];

						for (let i = 6; i >= 0; i--) {
							const date = new Date(today);
							date.setDate(date.getDate() - i);
							const dateStr = date.toISOString().split("T")[0];
							const dayName = date.toLocaleDateString("ja-JP", {
								weekday: "short",
							});

							// その日の記録をフィルタ
							const dayRecords = formattedRecords.filter(
								(record) => record.date === dateStr,
							);
							const totalMinutes = dayRecords.reduce(
								(sum, record) => sum + record.workTime,
								0,
							);
							const pomodoroCount = dayRecords.filter(
								(record) => record.type === "pomodoro",
							).length;
							const manualCount = dayRecords.filter(
								(record) => record.type === "manual",
							).length;

							stats.push({
								date: `${date.getMonth() + 1}/${date.getDate()} (${dayName})`,
								totalMinutes,
								pomodoroCount,
								manualCount,
							});
						}

						setDailyStats(stats);
					}
				} else {
					console.error("Failed to fetch work records:", recordsResponse);
					// エラー時は空のデータを設定
					setWorkRecords([]);
					setDailyStats([]);
				}
			} catch (error) {
				console.error("Failed to fetch analytics data:", error);
				// エラー時は空のデータを設定
				setWorkRecords([]);
				setDailyStats([]);
			} finally {
				setLoading(false);
			}
		};

		fetchAnalyticsData();
	}

	const handleSignOut = async () => {
		const { signOut } = await import("next-auth/react");
		await signOut({ callbackUrl: "/" });
	};

	if (authLoading || loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
			</div>
		);
	}

	if (!authenticated || !user) {
		return null;
	}

	// 統計情報の計算（APIデータベース）
	const totalWorkTime = workRecords.reduce(
		(sum, record) => sum + record.workTime,
		0,
	);
	const totalWorkDays = new Set(workRecords.map((record) => record.date)).size;
	const totalPomodoroSessions = workRecords.filter(
		(r) => r.type === "pomodoro",
	).length;
	const totalManualSessions = workRecords.filter(
		(r) => r.type === "manual",
	).length;

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
			{/* Header */}
			<header className="bg-white shadow-sm border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center py-4">
						<div className="flex items-center space-x-4">
							<h1 className="text-2xl font-bold text-primary-600">Meguriai</h1>
							<span className="text-gray-600">こんにちは、{user.name}さん</span>
						</div>

						<div className="flex items-center space-x-4">
							<nav className="hidden md:flex space-x-6">
								<a
									href="/dashboard"
									className="text-gray-600 hover:text-gray-900"
								>
									ダッシュボード
								</a>
								<a href="/analytics" className="text-primary-600 font-medium">
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
				<div className="mb-8">
					<h2 className="text-3xl font-bold text-gray-900 mb-2">作業分析</h2>
					<p className="text-gray-600">過去7日間の作業記録を確認できます</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Summary Stats */}
					<div className="lg:col-span-1 space-y-6">
						<div className="card">
							<h3 className="text-xl font-semibold text-gray-900 mb-4">
								今週の実績
							</h3>

							<div className="space-y-4">
								<div className="flex justify-between items-center">
									<span className="text-gray-600">総作業時間</span>
									<span className="text-2xl font-bold text-primary-600">
										{Math.floor(totalWorkTime / 60)}時間{totalWorkTime % 60}分
									</span>
								</div>

								<div className="flex justify-between items-center">
									<span className="text-gray-600">作業日数</span>
									<span className="text-2xl font-bold text-primary-600">
										{totalWorkDays}日
									</span>
								</div>

								<div className="flex justify-between items-center">
									<span className="text-gray-600">ポモドーロ回数</span>
									<span className="text-2xl font-bold text-primary-600">
										{totalPomodoroSessions}回
									</span>
								</div>

								<div className="flex justify-between items-center">
									<span className="text-gray-600">手動記録回数</span>
									<span className="text-2xl font-bold text-blue-600">
										{totalManualSessions}回
									</span>
								</div>

								<div className="flex justify-between items-center">
									<span className="text-gray-600">獲得ポイント</span>
									<span className="text-2xl font-bold text-primary-600">
										{totalWorkTime} pt
									</span>
								</div>
							</div>
						</div>

						<div className="card">
							<h3 className="text-xl font-semibold text-gray-900 mb-4">
								平均値
							</h3>

							<div className="space-y-3">
								<div className="flex justify-between">
									<span className="text-gray-600">1日の平均作業時間</span>
									<span className="font-medium">
										{totalWorkDays > 0
											? Math.round(totalWorkTime / totalWorkDays)
											: 0}
										分
									</span>
								</div>

								<div className="flex justify-between">
									<span className="text-gray-600">1日の平均ポモドーロ</span>
									<span className="font-medium">
										{totalWorkDays > 0
											? Math.round(totalPomodoroSessions / totalWorkDays)
											: 0}
										回
									</span>
								</div>

								<div className="flex justify-between">
									<span className="text-gray-600">1日の平均手動記録</span>
									<span className="font-medium">
										{totalWorkDays > 0
											? Math.round(totalManualSessions / totalWorkDays)
											: 0}
										回
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* Chart */}
					<div className="lg:col-span-2">
						<div className="card">
							<h3 className="text-xl font-semibold text-gray-900 mb-6">
								日別作業量推移
							</h3>

							<div className="h-80">
								<ResponsiveContainer width="100%" height="100%">
									<BarChart data={dailyStats}>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis
											dataKey="date"
											fontSize={12}
											angle={-45}
											textAnchor="end"
											height={60}
										/>
										<YAxis
											label={{
												value: "作業時間（分）",
												angle: -90,
												position: "insideLeft",
											}}
										/>
										<Tooltip
											formatter={(value: number) => [`${value}分`, "作業時間"]}
											labelFormatter={(label) => `日付: ${label}`}
										/>
										<Bar
											dataKey="totalMinutes"
											fill="#22c55e"
											radius={[4, 4, 0, 0]}
										/>
									</BarChart>
								</ResponsiveContainer>
							</div>
						</div>
					</div>
				</div>

				{/* Work Records */}
				<div className="mt-8">
					<div className="card">
						<h3 className="text-xl font-semibold text-gray-900 mb-6">
							作業履歴
						</h3>

						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="border-b border-gray-200">
										<th className="text-left py-3 px-4 font-medium text-gray-700">
											日付
										</th>
										<th className="text-left py-3 px-4 font-medium text-gray-700">
											作業時間
										</th>
										<th className="text-left py-3 px-4 font-medium text-gray-700">
											種類
										</th>
										<th className="text-left py-3 px-4 font-medium text-gray-700">
											メモ
										</th>
									</tr>
								</thead>
								<tbody>
									{workRecords
										.sort(
											(a, b) =>
												new Date(b.date).getTime() - new Date(a.date).getTime(),
										)
										.slice(0, 20)
										.map((record) => (
											<tr
												key={record.id}
												className="border-b border-gray-100 hover:bg-gray-50"
											>
												<td className="py-3 px-4 text-gray-900">
													{new Date(record.date).toLocaleDateString("ja-JP")}
												</td>
												<td className="py-3 px-4 text-gray-900">
													{record.workTime}分
												</td>
												<td className="py-3 px-4">
													<span
														className={`px-2 py-1 rounded-full text-xs font-medium ${
															record.type === "pomodoro"
																? "bg-primary-100 text-primary-800"
																: "bg-blue-100 text-blue-800"
														}`}
													>
														{record.type === "pomodoro"
															? "ポモドーロ"
															: "手動入力"}
													</span>
												</td>
												<td className="py-3 px-4 text-gray-600 max-w-xs truncate">
													{record.memo || "-"}
												</td>
											</tr>
										))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
