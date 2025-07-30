import "./globals.css";
import { MSWProvider } from "../src/components/MSWProvider";

export const metadata = {
	title: "Thank You App",
	description: "チームメンバー同士で感謝のメッセージを送り合うアプリ",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="ja">
			<body>
				<MSWProvider>{children}</MSWProvider>
			</body>
		</html>
	);
}
