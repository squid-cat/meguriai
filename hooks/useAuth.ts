import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { authApi } from "@/lib/api";

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
	const [loading, setLoading] = useState(true);
	const [authenticated, setAuthenticated] = useState(false);
	const [needsSetup, setNeedsSetup] = useState(false);

	useEffect(() => {
		let isMounted = true;

		const checkAuthStatus = async () => {
			if (status === "loading") return;

			if (status === "unauthenticated" || !session) {
				if (isMounted) {
					setAuthenticated(false);
					setUser(null);
					setLoading(false);
					router.push("/auth/signin");
				}
				return;
			}

			try {
				if (isMounted) setLoading(true);

				const authStatus = await authApi.getAuthStatus();

				if (!isMounted) return; // コンポーネントがアンマウントされた場合は処理を中断

				if (!authStatus || "error" in authStatus) {
					console.error("Auth status error:", authStatus);
					setAuthenticated(false);
					setUser(null);
					router.push("/auth/signin");
					return;
				}

				if (!authStatus.authenticated) {
					setAuthenticated(false);
					setUser(null);
					router.push("/auth/signin");
					return;
				}

				const currentUser = (
					authStatus as unknown as {
						user: AuthUser;
					}
				).user;

				setAuthenticated(true);
				setUser(currentUser);
				setNeedsSetup(authStatus.needsSetup);
			} catch (error) {
				if (isMounted) {
					console.error("Failed to check auth status:", error);
					setAuthenticated(false);
					setUser(null);
					router.push("/auth/signin");
				}
			} finally {
				if (isMounted) setLoading(false);
			}
		};

		// 初回のみ実行（statusとsessionが確定した時点で）
		if (status !== "loading") {
			checkAuthStatus();
		}

		return () => {
			isMounted = false;
		};
	}, [status, session, router]);

	return {
		user,
		loading,
		authenticated,
		needsSetup,
	};
}
