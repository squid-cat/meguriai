import { GratitudeApp } from "../src/components/GratitudeApp";

export const dynamic = "force-dynamic";

export default function Home() {
	return (
		<main className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
			<div className="container mx-auto px-4 py-6">
				<header className="text-center mb-8">
					<div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-400 to-pink-500 rounded-3xl mb-4 shadow-lg">
						<span className="text-2xl">💭</span>
					</div>
					<p className="text-slate-600 max-w-md mx-auto leading-relaxed">
						感謝の気持ちを伝えて、チームの絆を深めよう！
					</p>
				</header>
				<GratitudeApp />
			</div>
		</main>
	);
}
