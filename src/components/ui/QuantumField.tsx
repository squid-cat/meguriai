"use client";

import { useEffect, useRef, useState } from "react";

interface Particle {
	id: number;
	x: number;
	y: number;
	vx: number;
	vy: number;
	size: number;
	opacity: number;
	color: string;
	life: number;
	maxLife: number;
}

interface QuantumFieldProps {
	children: React.ReactNode;
	particleCount?: number;
	enableGravity?: boolean;
	enableMagneticField?: boolean;
	className?: string;
}

export function QuantumField({
	children,
	particleCount = 50,
	enableGravity = true,
	enableMagneticField = true,
	className = "",
}: QuantumFieldProps) {
	const [, setParticles] = useState<Particle[]>([]);
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const animationRef = useRef<number | undefined>();

	// パーティクル システムの初期化
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const rect = canvas.getBoundingClientRect();
		const newParticles: Particle[] = [];

		for (let i = 0; i < particleCount; i++) {
			const colors = [
				"rgba(249, 115, 22, 0.6)", // orange-500
				"rgba(236, 72, 153, 0.6)", // pink-500
				"rgba(168, 85, 247, 0.6)", // purple-500
				"rgba(16, 185, 129, 0.6)", // emerald-500
				"rgba(20, 184, 166, 0.6)", // teal-500
			];

			newParticles.push({
				id: i,
				x: Math.random() * rect.width,
				y: Math.random() * rect.height,
				vx: (Math.random() - 0.5) * 2,
				vy: (Math.random() - 0.5) * 2,
				size: Math.random() * 3 + 1,
				opacity: Math.random() * 0.8 + 0.2,
				color: colors[Math.floor(Math.random() * colors.length)],
				life: 0,
				maxLife: Math.random() * 200 + 100,
			});
		}

		setParticles(newParticles);
	}, [particleCount]);

	// 量子物理シミュレーション
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const animate = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			setParticles((prevParticles) => {
				return prevParticles.map((particle) => {
					let { x, y, vx, vy } = particle;

					// 重力場の影響
					if (enableGravity) {
						const distanceToMouse = Math.sqrt(
							(x - mousePosition.x) ** 2 + (y - mousePosition.y) ** 2,
						);
						const force = Math.max(0, 100 - distanceToMouse) / 100;
						const angle = Math.atan2(mousePosition.y - y, mousePosition.x - x);

						vx += Math.cos(angle) * force * 0.01;
						vy += Math.sin(angle) * force * 0.01;
					}

					// 磁場効果
					if (enableMagneticField) {
						const fieldStrength = Math.sin(particle.life * 0.01) * 0.1;
						vx += fieldStrength;
						vy += Math.cos(particle.life * 0.01) * 0.1;
					}

					// 境界での反射
					if (x <= 0 || x >= canvas.width) vx *= -0.8;
					if (y <= 0 || y >= canvas.height) vy *= -0.8;

					// 摩擦
					vx *= 0.99;
					vy *= 0.99;

					// 位置更新
					x += vx;
					y += vy;

					// 生命サイクル
					const life = particle.life + 1;
					const lifeRatio = life / particle.maxLife;
					const opacity = particle.opacity * (1 - lifeRatio);

					// パーティクルの描画
					ctx.save();
					ctx.globalAlpha = opacity;
					ctx.fillStyle = particle.color;
					ctx.beginPath();
					ctx.arc(x, y, particle.size, 0, Math.PI * 2);
					ctx.fill();

					// 量子もつれ効果（近くのパーティクルとの接続線）
					prevParticles.forEach((otherParticle) => {
						if (otherParticle.id === particle.id) return;

						const distance = Math.sqrt(
							(x - otherParticle.x) ** 2 + (y - otherParticle.y) ** 2,
						);

						if (distance < 100) {
							const lineOpacity = ((100 - distance) / 100) * 0.2;
							ctx.strokeStyle = `rgba(255, 255, 255, ${lineOpacity})`;
							ctx.lineWidth = 0.5;
							ctx.beginPath();
							ctx.moveTo(x, y);
							ctx.lineTo(otherParticle.x, otherParticle.y);
							ctx.stroke();
						}
					});

					ctx.restore();

					// パーティクルの再生成
					if (life >= particle.maxLife) {
						return {
							...particle,
							x: Math.random() * canvas.width,
							y: Math.random() * canvas.height,
							vx: (Math.random() - 0.5) * 2,
							vy: (Math.random() - 0.5) * 2,
							life: 0,
							opacity: Math.random() * 0.8 + 0.2,
						};
					}

					return { ...particle, x, y, vx, vy, life };
				});
			});

			animationRef.current = requestAnimationFrame(animate);
		};

		animate();

		return () => {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, [mousePosition, enableGravity, enableMagneticField]);

	// キャンバスサイズの動的調整
	useEffect(() => {
		const canvas = canvasRef.current;
		const container = containerRef.current;
		if (!canvas || !container) return;

		const resizeCanvas = () => {
			const rect = container.getBoundingClientRect();
			canvas.width = rect.width;
			canvas.height = rect.height;
		};

		resizeCanvas();
		window.addEventListener("resize", resizeCanvas);

		return () => window.removeEventListener("resize", resizeCanvas);
	}, []);

	const handleMouseMove = (e: React.MouseEvent) => {
		if (!containerRef.current) return;

		const rect = containerRef.current.getBoundingClientRect();
		setMousePosition({
			x: e.clientX - rect.left,
			y: e.clientY - rect.top,
		});
	};

	return (
		<div
			ref={containerRef}
			className={`relative overflow-hidden ${className}`}
			onMouseMove={handleMouseMove}
		>
			{/* 量子フィールド キャンバス */}
			<canvas
				ref={canvasRef}
				className="absolute inset-0 pointer-events-none z-0"
				style={{ mixBlendMode: "screen" }}
			/>

			{/* 高度な背景効果 */}
			<div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-pink-500/5 to-purple-500/5 animate-pulse" />

			{/* 量子干渉パターン */}
			<div className="absolute inset-0 opacity-10">
				<div
					className="w-full h-full"
					style={{
						backgroundImage: `
							radial-gradient(circle at 25% 25%, rgba(249, 115, 22, 0.1) 0%, transparent 50%),
							radial-gradient(circle at 75% 75%, rgba(236, 72, 153, 0.1) 0%, transparent 50%),
							radial-gradient(circle at 75% 25%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)
						`,
						animation: "quantum-interference 8s ease-in-out infinite alternate",
					}}
				/>
			</div>

			{/* コンテンツ */}
			<div className="relative z-10">{children}</div>

			{/* カスタム CSS アニメーション */}
			<style jsx>{`
				@keyframes quantum-interference {
					0% { transform: scale(1) rotate(0deg); }
					50% { transform: scale(1.05) rotate(2deg); }
					100% { transform: scale(1.1) rotate(-2deg); }
				}
			`}</style>
		</div>
	);
}
