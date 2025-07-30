"use client";

import { useEffect, useState } from "react";

export function MSWProvider({ children }: { children: React.ReactNode }) {
	const [mswReady, setMswReady] = useState(false);

	useEffect(() => {
		const init = async () => {
			if (typeof window !== "undefined") {
				const { worker } = await import("../mocks/browser");
				await worker.start();
				setMswReady(true);
			}
		};

		init();
	}, []);

	if (!mswReady) {
		return <div>Loading...</div>;
	}

	return <>{children}</>;
}
