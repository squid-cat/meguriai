import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

interface AuthUser {
	id: string;
	name: string;
	email: string;
	avatarId: number;
}

interface UseAuthReturn {
	user: AuthUser | null;
	loading: boolean;
	authenticated: boolean;
	needsSetup: boolean;
}

export function useAuth(): UseAuthReturn {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [user, setUser] = useState<AuthUser | null>(null);
	const [needsSetup, setNeedsSetup] = useState(false);
	const redirectExecuted = useRef(false);
	const initialized = useRef(false);

	// NextAuth.jsのセッション状態を直接使用
	const loading = status === "loading";
	const authenticated = status === "authenticated" && !!session;

	useEffect(() => {
		// まだ初期化されていない場合は初期化フラグを設定
		if (!initialized.current && !loading) {
			initialized.current = true;
		}

		// 初期化されていない、またはローディング中は何もしない
		if (!initialized.current || loading) return;

		// 現在のパスを取得
		const currentPath = window.location.pathname;
		const isSignInPage = currentPath === "/auth/signin";
		const isPublicPage = currentPath === "/" || isSignInPage;

		// 認証されていない場合
		if (!authenticated) {
			setUser(null);
			setNeedsSetup(false);

			// パブリックページでない場合のみサインインページへリダイレクト
			if (!isPublicPage && !redirectExecuted.current) {
				redirectExecuted.current = true;
				// 短い遅延でリダイレクトを実行（フリッカリング防止）
				setTimeout(() => {
					router.replace("/auth/signin");
				}, 50);
			}
			return;
		}

		// 認証されている場合
		if (session?.user) {
			// セッションから直接ユーザー情報を設定
			const sessionUser = {
				id: (session.user as any).id || "temp-user-id",
				name: session.user.name || "",
				email: session.user.email || "",
				avatarId: (session.user as any).avatarId || 1,
			};

			setUser(sessionUser);
			setNeedsSetup(false);

			// サインインページにいる場合はダッシュボードへリダイレクト
			if (isSignInPage && !redirectExecuted.current) {
				redirectExecuted.current = true;
				// 短い遅延でリダイレクトを実行（フリッカリング防止）
				setTimeout(() => {
					router.replace("/dashboard");
				}, 50);
			}
		}

		// パスが変わったらリダイレクト実行フラグをリセット
		redirectExecuted.current = false;
	}, [session, authenticated, loading, router]);

	return {
		user,
		loading: loading || !initialized.current,
		authenticated,
		needsSetup,
	};
}
