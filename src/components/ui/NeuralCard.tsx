"use client";

import { useEffect, useRef, useState } from "react";

interface NeuralCardProps {
	children: React.ReactNode;
	variant?: "primary" | "secondary" | "tertiary";
	className?: string;
	enableParallax?: boolean;
	enableMorphing?: boolean;
}

export function NeuralCard({
	children,
	variant = "primary",
	className = "",
	enableParallax = true,
	enableMorphing = true,
}: NeuralCardProps) {
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const [isHovered, setIsHovered] = useState(false);
	const [morphState, setMorphState] = useState(0);
	const cardRef = useRef<HTMLDivElement>(null);

	// 神経網のような動的モーフィング
	useEffect(() => {
		if (!enableMorphing) return;

		const interval = setInterval(() => {
			setMorphState((prev) => (prev + 1) % 4);
		}, 3000);

		return () => clearInterval(interval);
	}, [enableMorphing]);

	// 高度なマウストラッキング
	const handleMouseMove = (e: React.MouseEvent) => {
		if (!cardRef.current || !enableParallax) return;

		const rect = cardRef.current.getBoundingClientRect();
		const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
		const y = (e.clientY - rect.top - rect.height / 2) / rect.height;

		setMousePosition({ x: x * 20, y: y * 20 });
	};

	// バリアント別のスタイル
	const getVariantStyles = () => {
		switch (variant) {
			case "primary":
				return {
					base: "from-orange-50/40 via-pink-50/30 to-purple-50/40",
					border: "border-orange-200/30",
					glow: "shadow-orange-500/10",
					particle: "bg-gradient-to-r from-orange-300 to-pink-400",
				};
			case "secondary":
				return {
					base: "from-purple-50/40 via-pink-50/30 to-orange-50/40",
					border: "border-purple-200/30",
					glow: "shadow-purple-500/10",
					particle: "bg-gradient-to-r from-purple-300 to-pink-400",
				};
			case "tertiary":
				return {
					base: "from-emerald-50/40 via-teal-50/30 to-cyan-50/40",
					border: "border-emerald-200/30",
					glow: "shadow-emerald-500/10",
					particle: "bg-gradient-to-r from-emerald-300 to-teal-400",
				};
		}
	};

	const styles = getVariantStyles();

	// 動的な境界半径（モーフィング効果）
	const getBorderRadius = () => {
		if (!enableMorphing) return "rounded-3xl";

		const radiuses = [
			"rounded-3xl",
			"rounded-tl-3xl rounded-tr-xl rounded-bl-xl rounded-br-3xl",
			"rounded-tl-xl rounded-tr-3xl rounded-bl-3xl rounded-br-xl",
			"rounded-2xl",
		];
		return radiuses[morphState];
	};

	return (
		<div
			ref={cardRef}
			className={`
				relative overflow-hidden
				bg-gradient-to-br ${styles.base}
				backdrop-blur-2xl border-2 ${styles.border}
				shadow-2xl ${styles.glow}
				${getBorderRadius()}
				transform transition-all duration-1000 ease-out
				${isHovered ? "scale-[1.02] shadow-3xl" : "scale-100"}
				${enableParallax ? `hover:rotate-x-[${mousePosition.y * 0.1}deg] hover:rotate-y-[${mousePosition.x * 0.1}deg]` : ""}
				${className}
			`}
			onMouseMove={handleMouseMove}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => {
				setIsHovered(false);
				setMousePosition({ x: 0, y: 0 });
			}}
			style={{
				transform: enableParallax
					? `perspective(1000px) rotateX(${mousePosition.y * 0.1}deg) rotateY(${mousePosition.x * 0.1}deg) translateZ(0)`
					: undefined,
			}}
		>
			{/* 動的な背景メッシュ */}
			<div className="absolute inset-0 opacity-10">
				<svg width="100%" height="100%" className="absolute inset-0">
					<defs>
						<pattern
							id={`neural-${variant}`}
							x="0"
							y="0"
							width="60"
							height="60"
							patternUnits="userSpaceOnUse"
						>
							<circle
								cx="30"
								cy="30"
								r="2"
								fill="currentColor"
								className="text-orange-400"
							>
								<animate
									attributeName="r"
									values="1;3;1"
									dur="3s"
									repeatCount="indefinite"
								/>
							</circle>
							<line
								x1="30"
								y1="30"
								x2="60"
								y2="0"
								stroke="currentColor"
								strokeWidth="0.5"
								className="text-pink-300"
								opacity="0.6"
							/>
						</pattern>
					</defs>
					<rect width="100%" height="100%" fill={`url(#neural-${variant})`} />
				</svg>
			</div>

			{/* パーティクル システム */}
			<div className="absolute inset-0 pointer-events-none">
				{[...Array(12)].map((_, i) => (
					<div
						key={i}
						className={`
							absolute w-1 h-1 ${styles.particle} rounded-full opacity-60
							animate-pulse
						`}
						style={{
							left: `${10 + ((i * 7) % 80)}%`,
							top: `${15 + ((i * 11) % 70)}%`,
							animationDelay: `${i * 0.3}s`,
							animationDuration: `${3 + (i % 3)}s`,
							transform: isHovered
								? `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`
								: "translate(0, 0)",
							transition: "transform 0.3s ease-out",
						}}
					/>
				))}
			</div>

			{/* ホログラフィック オーバーレイ */}
			<div
				className={`
					absolute inset-0 opacity-0 transition-opacity duration-700
					bg-gradient-to-r from-white/5 via-white/10 to-white/5
					${isHovered ? "opacity-100" : ""}
				`}
			/>

			{/* エッジ エフェクト */}
			<div
				className={`
					absolute inset-0 rounded-3xl
					bg-gradient-to-r from-transparent via-white/20 to-transparent
					opacity-0 transition-opacity duration-500
					${isHovered ? "opacity-100 animate-pulse" : ""}
				`}
				style={{
					background: `conic-gradient(from ${morphState * 90}deg, transparent, rgba(255,255,255,0.1), transparent)`,
				}}
			/>

			{/* コンテンツ */}
			<div className="relative z-10 p-8">{children}</div>

			{/* 高度な影システム */}
			<div
				className={`
					absolute -inset-1 -z-10 rounded-3xl opacity-0 transition-opacity duration-300
					bg-gradient-to-r ${styles.particle} blur-xl
					${isHovered ? "opacity-20" : ""}
				`}
			/>
		</div>
	);
}
