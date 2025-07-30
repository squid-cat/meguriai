"use client";

import { useRef, useState } from "react";

interface QuantumButtonProps {
	children: React.ReactNode;
	onClick?: () => void;
	disabled?: boolean;
	variant?: "primary" | "secondary" | "success";
	className?: string;
}

export function QuantumButton({
	children,
	onClick,
	disabled = false,
	variant = "primary",
	className = "",
}: QuantumButtonProps) {
	const [isPressed, setIsPressed] = useState(false);
	const [ripples, setRipples] = useState<
		Array<{ x: number; y: number; id: number }>
	>([]);
	const [isHovered, setIsHovered] = useState(false);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const rippleId = useRef(0);

	// 物理学ベースのリップル効果
	const createRipple = (e: React.MouseEvent) => {
		if (!buttonRef.current || disabled) return;

		const rect = buttonRef.current.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		const newRipple = {
			x,
			y,
			id: rippleId.current++,
		};

		setRipples((prev) => [...prev, newRipple]);

		// 物理的な波動伝播をシミュレート（1.2秒後に削除）
		setTimeout(() => {
			setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
		}, 1200);
	};

	const handleMouseDown = (e: React.MouseEvent) => {
		setIsPressed(true);
		createRipple(e);
	};

	const handleMouseUp = () => {
		setIsPressed(false);
	};

	const handleClick = (e: React.MouseEvent) => {
		createRipple(e);
		onClick?.();
	};

	// バリアント別のグラデーション
	const getVariantStyles = () => {
		switch (variant) {
			case "primary":
				return {
					base: "bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600",
					hover: "from-orange-500 via-pink-600 to-purple-700",
					active: "from-orange-600 via-pink-700 to-purple-800",
					glow: "shadow-orange-500/25",
					particle: "bg-orange-300",
				};
			case "secondary":
				return {
					base: "bg-gradient-to-r from-purple-400 via-pink-500 to-orange-600",
					hover: "from-purple-500 via-pink-600 to-orange-700",
					active: "from-purple-600 via-pink-700 to-orange-800",
					glow: "shadow-purple-500/25",
					particle: "bg-purple-300",
				};
			case "success":
				return {
					base: "bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600",
					hover: "from-emerald-500 via-teal-600 to-cyan-700",
					active: "from-emerald-600 via-teal-700 to-cyan-800",
					glow: "shadow-emerald-500/25",
					particle: "bg-emerald-300",
				};
		}
	};

	const styles = getVariantStyles();

	return (
		<button
			type="button"
			ref={buttonRef}
			className={`
				relative overflow-hidden px-8 py-4 rounded-2xl font-bold text-white
				transform transition-all duration-300 ease-out
				${styles.base}
				${isHovered ? styles.hover : ""}
				${isPressed ? styles.active + " scale-95" : "scale-100"}
				${isHovered ? "shadow-2xl " + styles.glow : "shadow-lg"}
				${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
				${isHovered && !disabled ? "translate-y-[-2px]" : ""}
				before:absolute before:inset-0 before:bg-white/10 before:opacity-0
				before:transition-opacity before:duration-300
				${isHovered ? "before:opacity-100" : ""}
				${className}
			`}
			onMouseDown={handleMouseDown}
			onMouseUp={handleMouseUp}
			onMouseLeave={() => {
				setIsPressed(false);
				setIsHovered(false);
			}}
			onMouseEnter={() => setIsHovered(true)}
			onClick={handleClick}
			disabled={disabled}
		>
			{/* リップル効果 */}
			{ripples.map((ripple) => (
				<span
					key={ripple.id}
					className={`
						absolute pointer-events-none rounded-full animate-ping
						${styles.particle} opacity-75
					`}
					style={{
						left: ripple.x - 6,
						top: ripple.y - 6,
						width: 12,
						height: 12,
						animationDuration: "1.2s",
					}}
				/>
			))}

			{/* 動的パーティクル背景 */}
			<div className="absolute inset-0 opacity-20">
				{[...Array(6)].map((_, i) => (
					<div
						key={i}
						className={`
							absolute w-1 h-1 ${styles.particle} rounded-full
							animate-pulse
						`}
						style={{
							left: `${15 + i * 12}%`,
							top: `${20 + (i % 3) * 20}%`,
							animationDelay: `${i * 0.2}s`,
							animationDuration: `${2 + i * 0.3}s`,
						}}
					/>
				))}
			</div>

			{/* ホログラフィック光沢 */}
			<div
				className={`
					absolute inset-0 opacity-0 transition-opacity duration-500
					bg-gradient-to-r from-transparent via-white/20 to-transparent
					transform skew-x-12 -translate-x-full
					${isHovered ? "animate-pulse opacity-100 translate-x-full" : ""}
				`}
			/>

			{/* コンテンツ */}
			<span className="relative z-10 flex items-center justify-center gap-2">
				{children}
			</span>
		</button>
	);
}
