import { useSession } from "next-auth/react";
import { useMemo, useRef } from "react";

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

// NextAuth.js の session.user を拡張する型定義
interface ExtendedUser {
	id?: string;
	name?: string | null;
	email?: string | null;
	avatarId?: number;
}

export function useAuth(): UseAuthReturn {
	const { data: session, status } = useSession();
	const prevUserRef = useRef<AuthUser | null>(null);

	// NextAuth.jsのセッション状態を直接使用
	const loading = status === "loading";
	const authenticated = status === "authenticated" && !!session;

	// ユーザー情報をメモ化して安定させる
	const user = useMemo<AuthUser | null>(() => {
		if (!session?.user) {
			prevUserRef.current = null;
			return null;
		}

		const extendedUser = session.user as ExtendedUser;
		const newUser: AuthUser = {
			id: extendedUser.id || "temp-user-id",
			name: extendedUser.name || "",
			email: extendedUser.email || "",
			avatarId: extendedUser.avatarId || 1,
		};

		// 前回の値と比較して、実際に変更があった場合のみ新しいオブジェクトを返す
		const prevUser = prevUserRef.current;
		if (
			prevUser &&
			prevUser.id === newUser.id &&
			prevUser.name === newUser.name &&
			prevUser.email === newUser.email &&
			prevUser.avatarId === newUser.avatarId
		) {
			return prevUser;
		}

		prevUserRef.current = newUser;
		return newUser;
	}, [session?.user]);

	return {
		user,
		loading,
		authenticated,
		needsSetup: false,
	};
}
