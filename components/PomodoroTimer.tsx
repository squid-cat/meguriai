"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// WebKit対応のAudioContext型定義
declare global {
	interface Window {
		webkitAudioContext?: typeof AudioContext;
	}
}

interface PomodoroSettings {
	workMinutes: number;
	breakMinutes: number;
	cycles: number;
	soundEnabled: boolean;
	volume: number;
	notificationEnabled: boolean;
}

interface PomodoroTimerProps {
	onComplete?: (workMinutes: number) => void;
}

type TimerMode = "work" | "break";
type TimerStatus = "idle" | "running" | "paused";

export default function PomodoroTimer({ onComplete }: PomodoroTimerProps) {
	const [settings, setSettings] = useState<PomodoroSettings>({
		workMinutes: 25,
		breakMinutes: 5,
		cycles: 3,
		soundEnabled: true,
		volume: 0.5,
		notificationEnabled: true,
	});

	const [showSettings, setShowSettings] = useState(false);
	const [status, setStatus] = useState<TimerStatus>("idle");
	const [mode, setMode] = useState<TimerMode>("work");
	const [currentCycle, setCurrentCycle] = useState(1);
	const [timeLeft, setTimeLeft] = useState(settings.workMinutes * 60);
	const [notificationPermission, setNotificationPermission] =
		useState<NotificationPermission>("default");

	const audioContextRef = useRef<AudioContext | null>(null);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	// ブラウザ通知の許可状態を確認
	useEffect(() => {
		if (typeof window !== "undefined" && "Notification" in window) {
			setNotificationPermission(Notification.permission);
		}
	}, []);

	// 通知許可をリクエスト
	const requestNotificationPermission = async () => {
		if ("Notification" in window) {
			try {
				const permission = await Notification.requestPermission();
				setNotificationPermission(permission);
				return permission;
			} catch (error) {
				console.error("通知許可の要求に失敗:", error);
				return "denied";
			}
		}
		return "denied";
	};

	// ブラウザ通知を送信
	const sendNotification = useCallback(
		(title: string, body: string, icon?: string) => {
			if (!settings.notificationEnabled) return;

			if (notificationPermission === "granted") {
				try {
					const notification = new Notification(title, {
						body,
						icon: icon || "/images/tree/main-tree.svg",
						badge: "/images/tree/main-tree.svg",
						tag: "pomodoro-timer",
						requireInteraction: true,
						silent: false,
					});

					// 5秒後に自動で閉じる
					setTimeout(() => {
						notification.close();
					}, 5000);

					// クリック時にウィンドウをフォーカス
					notification.onclick = () => {
						window.focus();
						notification.close();
					};
				} catch (error) {
					console.error("通知の送信に失敗:", error);
				}
			}
		},
		[settings.notificationEnabled, notificationPermission],
	);

	// 音声初期化
	const initAudio = useCallback(() => {
		if (typeof window !== "undefined" && !audioContextRef.current) {
			try {
				const AudioContextClass =
					window.AudioContext || window.webkitAudioContext;
				if (AudioContextClass) {
					audioContextRef.current = new AudioContextClass();
				}
			} catch (error) {
				console.error("AudioContext initialization failed:", error);
			}
		}
	}, []);

	// ビープ音を再生
	const playBeep = useCallback(
		(frequency: number = 800, duration: number = 500) => {
			if (!settings.soundEnabled || !audioContextRef.current) return;

			try {
				const oscillator = audioContextRef.current.createOscillator();
				const gainNode = audioContextRef.current.createGain();

				oscillator.connect(gainNode);
				gainNode.connect(audioContextRef.current.destination);

				oscillator.frequency.value = frequency;
				gainNode.gain.value = settings.volume;

				oscillator.start();
				gainNode.gain.exponentialRampToValueAtTime(
					0.001,
					audioContextRef.current.currentTime + duration / 1000,
				);
				oscillator.stop(audioContextRef.current.currentTime + duration / 1000);
			} catch (error) {
				console.error("Failed to play beep:", error);
			}
		},
		[settings.soundEnabled, settings.volume],
	);

	// 音量プレビュー
	const playVolumePreview = useCallback(() => {
		initAudio();
		playBeep(600, 300);
	}, [initAudio, playBeep]);

	// localStorage からの設定読み込み
	useEffect(() => {
		if (typeof window !== "undefined") {
			const savedSettings = localStorage.getItem("pomodoroSettings");
			if (savedSettings) {
				try {
					const parsed = JSON.parse(savedSettings);
					// バリデーション
					const validatedSettings = {
						workMinutes: Math.max(1, Math.min(120, parsed.workMinutes || 25)),
						breakMinutes: Math.max(1, Math.min(60, parsed.breakMinutes || 5)),
						cycles: Math.max(1, Math.min(10, parsed.cycles || 3)),
						soundEnabled:
							typeof parsed.soundEnabled === "boolean"
								? parsed.soundEnabled
								: true,
						volume: Math.max(0, Math.min(1, parsed.volume || 0.5)),
						notificationEnabled:
							typeof parsed.notificationEnabled === "boolean"
								? parsed.notificationEnabled
								: true,
					};
					setSettings(validatedSettings);
				} catch (error) {
					console.error("設定の読み込みに失敗:", error);
				}
			}
		}
	}, []);

	// 設定変更時に localStorage に保存
	const saveSettings = useCallback((newSettings: PomodoroSettings) => {
		if (typeof window !== "undefined") {
			localStorage.setItem("pomodoroSettings", JSON.stringify(newSettings));
		}
	}, []);

	// 設定変更時にタイマー時間を更新
	useEffect(() => {
		if (status === "idle") {
			setTimeLeft(settings.workMinutes * 60);
		}
	}, [settings.workMinutes, status]);

	// タイマー完了時の処理
	const handleTimerComplete = useCallback(() => {
		initAudio();

		if (mode === "work") {
			// 作業完了
			playBeep(800, 800);
			sendNotification(
				"🍅 ポモドーロ完了！",
				`${settings.workMinutes}分の作業お疲れさまでした！`,
				"/images/tree/main-tree.svg",
			);
			onComplete?.(settings.workMinutes);

			if (currentCycle < settings.cycles) {
				// 休憩モードに移行
				setMode("break");
				setTimeLeft(settings.breakMinutes * 60);
				sendNotification(
					"☕ 休憩時間です",
					`${settings.breakMinutes}分間しっかり休憩しましょう！`,
				);
			} else {
				// 全サイクル完了
				setStatus("idle");
				setCurrentCycle(1);
				setMode("work");
				setTimeLeft(settings.workMinutes * 60);
				sendNotification(
					"🎉 全サイクル完了！",
					`${settings.cycles}サイクルの作業完了です！お疲れさまでした！`,
				);
			}
		} else {
			// 休憩完了
			playBeep(600, 600);
			sendNotification("💪 休憩終了！", "次の作業サイクルを始めましょう！");
			setMode("work");
			setCurrentCycle((prev) => prev + 1);
			setTimeLeft(settings.workMinutes * 60);
		}
	}, [
		mode,
		currentCycle,
		settings,
		onComplete,
		playBeep,
		sendNotification,
		initAudio,
	]);

	// タイマーロジック
	useEffect(() => {
		if (status === "running" && timeLeft > 0) {
			intervalRef.current = setInterval(() => {
				setTimeLeft((prev) => {
					if (prev <= 1) {
						handleTimerComplete();
						return 0;
					}
					return prev - 1;
				});
			}, 1000);
		} else if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, [status, timeLeft, handleTimerComplete]);

	const handleStart = () => {
		if (status === "idle") {
			setStatus("running");
			setTimeLeft(settings.workMinutes * 60);
			setCurrentCycle(1);
		}
	};

	const handlePause = () => {
		setStatus("paused");
	};

	const handleStop = () => {
		setStatus("idle");
		setCurrentCycle(1);
		setTimeLeft(settings.workMinutes * 60);
	};

	const handleSettingsUpdate = (newSettings: PomodoroSettings) => {
		setSettings(newSettings);
		if (status === "idle") {
			setTimeLeft(newSettings.workMinutes * 60);
		}
		saveSettings(newSettings);
		setShowSettings(false);
	};

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	};

	const getStateText = () => {
		switch (mode) {
			case "work":
				return "作業時間";
			case "break":
				return "休憩時間";
			default:
				return "待機中";
		}
	};

	const getProgressPercentage = () => {
		const totalDuration =
			mode === "break" ? settings.breakMinutes * 60 : settings.workMinutes * 60;
		return ((totalDuration - timeLeft) / totalDuration) * 100;
	};

	return (
		<div className="card">
			<div className="mb-4">
				<h3 className="text-xl font-semibold text-gray-900">
					ポモドーロタイマー
				</h3>
			</div>

			<div className="text-center mb-6">
				{/* Progress Circle */}
				<div className="relative mx-auto w-32 h-32 mb-4">
					<svg
						className="w-full h-full transform -rotate-90"
						viewBox="0 0 100 100"
						role="img"
						aria-label="ポモドーロタイマーの進捗"
					>
						<title>タイマー進捗表示</title>
						<circle
							cx="50"
							cy="50"
							r="45"
							stroke="#e5e7eb"
							strokeWidth="8"
							fill="none"
						/>
						<circle
							cx="50"
							cy="50"
							r="45"
							stroke={mode === "break" ? "#10b981" : "#2563eb"}
							strokeWidth="8"
							fill="none"
							strokeDasharray={`${getProgressPercentage() * 2.83} 283`}
							className="transition-all duration-1000 ease-in-out"
						/>
					</svg>
					<div className="absolute inset-0 flex items-center justify-center">
						<div className="text-center">
							<div className="text-2xl font-bold text-gray-900">
								{formatTime(timeLeft)}
							</div>
							<div className="text-xs text-gray-600">
								{currentCycle}/{settings.cycles}
							</div>
						</div>
					</div>
				</div>

				<div className="text-gray-600 mb-4">{getStateText()}</div>
			</div>

			<div className="space-y-3">
				{status === "idle" ? (
					<>
						<button
							type="button"
							onClick={handleStart}
							className="w-full btn-primary py-3"
						>
							開始
						</button>
						<button
							type="button"
							onClick={() => setShowSettings(true)}
							className="w-full py-2 px-4 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
						>
							設定
						</button>
					</>
				) : (
					<div className="grid grid-cols-2 gap-3">
						<button
							type="button"
							onClick={status === "paused" ? handleStart : handlePause}
							className={`py-3 px-4 rounded-lg font-medium transition-colors ${
								status === "paused"
									? "bg-primary-600 hover:bg-primary-700 text-white"
									: "bg-yellow-600 hover:bg-yellow-700 text-white"
							}`}
						>
							{status === "paused" ? "再開" : "一時停止"}
						</button>
						<button
							type="button"
							onClick={handleStop}
							className="py-3 px-4 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
						>
							停止
						</button>
					</div>
				)}
			</div>

			{/* Settings Modal */}
			{showSettings && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg p-6 w-full max-w-md">
						<div className="flex justify-between items-center">
							<h3 className="text-lg font-semibold">タイマー設定</h3>
							<button
								type="button"
								onClick={() => setShowSettings(false)}
								className="text-gray-400 hover:text-gray-600"
								aria-label="設定を閉じる"
							>
								<svg
									className="w-6 h-6"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									role="img"
									aria-hidden="true"
								>
									<title>閉じる</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>

						<div className="space-y-4">
							<div>
								<label
									htmlFor="work-duration"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									作業時間（分）
								</label>
								<input
									id="work-duration"
									type="number"
									value={settings.workMinutes}
									onChange={(e) =>
										setSettings({
											...settings,
											workMinutes: Math.max(1, parseInt(e.target.value) || 25),
										})
									}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
									min="1"
									max="120"
								/>
							</div>

							<div>
								<label
									htmlFor="break-duration"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									休憩時間（分）
								</label>
								<input
									id="break-duration"
									type="number"
									value={settings.breakMinutes}
									onChange={(e) =>
										setSettings({
											...settings,
											breakMinutes: Math.max(1, parseInt(e.target.value) || 5),
										})
									}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
									min="1"
									max="60"
								/>
							</div>

							<div>
								<label
									htmlFor="cycles"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									サイクル数
								</label>
								<input
									id="cycles"
									type="number"
									value={settings.cycles}
									onChange={(e) =>
										setSettings({
											...settings,
											cycles: Math.max(1, parseInt(e.target.value) || 3),
										})
									}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
									min="1"
									max="10"
								/>
							</div>

							<div>
								<div className="block text-sm font-medium text-gray-700 mb-1">
									通知設定
								</div>
								<div className="flex items-center space-x-2">
									<input
										type="checkbox"
										id="notification-enabled"
										checked={settings.notificationEnabled}
										onChange={(e) =>
											setSettings({
												...settings,
												notificationEnabled: e.target.checked,
											})
										}
										className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
									/>
									<label
										htmlFor="notification-enabled"
										className="text-sm text-gray-700"
									>
										通知を有効にする
									</label>
								</div>
								{notificationPermission !== "granted" &&
									settings.notificationEnabled && (
										<button
											type="button"
											onClick={requestNotificationPermission}
											className="mt-2 text-xs text-primary-600 hover:text-primary-800 underline"
										>
											通知許可を要求
										</button>
									)}
							</div>

							<div>
								<label
									htmlFor="volume"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									音量
								</label>
								<input
									type="range"
									id="volume"
									min="0"
									max="1"
									step="0.01"
									value={settings.volume}
									onChange={(e) =>
										setSettings({
											...settings,
											volume: parseFloat(e.target.value),
										})
									}
									className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
								/>
								<div className="flex justify-between text-xs text-gray-600 mt-1">
									<span>0</span>
									<span>1</span>
								</div>
								<button
									type="button"
									onClick={playVolumePreview}
									className="mt-1 text-xs text-primary-600 hover:text-primary-800 underline"
								>
									音量プレビュー
								</button>
							</div>

							<div>
								<div className="block text-sm font-medium text-gray-700 mb-1">
									音声設定
								</div>
								<div className="flex items-center space-x-2">
									<input
										type="checkbox"
										id="sound-enabled"
										checked={settings.soundEnabled}
										onChange={(e) =>
											setSettings({
												...settings,
												soundEnabled: e.target.checked,
											})
										}
										className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
									/>
									<label
										htmlFor="sound-enabled"
										className="text-sm text-gray-700"
									>
										音声を有効にする
									</label>
								</div>
							</div>
						</div>

						<div className="flex space-x-3 mt-6">
							<button
								type="button"
								onClick={() => handleSettingsUpdate(settings)}
								className="flex-1 btn-primary"
							>
								保存
							</button>
							<button
								type="button"
								onClick={() => setShowSettings(false)}
								className="flex-1 btn-secondary"
							>
								キャンセル
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
