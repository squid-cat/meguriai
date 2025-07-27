import { client } from "@/utils/api-client";

// User API (認証関連)
export const authApi = {
	getCurrentUser: async () => {
		const res = await client.api.user.me.$get();
		return await res.json();
	},

	setupUser: async (data: { name: string; avatarId: number }) => {
		const res = await client.api.user.setup.$post({
			json: data,
		});
		return await res.json();
	},

	getAuthStatus: async () => {
		const res = await client.api.user.status.$get();
		return await res.json();
	},
};

// Dashboard API
export const dashboardApi = {
	getDashboardData: async () => {
		const res = await client.api.dashboard.$get();
		return await res.json();
	},

	updateStats: async () => {
		const res = await client.api.dashboard["update-stats"].$post();
		return await res.json();
	},
};

// Work Records API
export const workRecordsApi = {
	getWorkRecords: async (userId: string, limit = 50, offset = 0) => {
		const res = await client.api["work-records"].$get({
			query: { userId, limit: limit.toString(), offset: offset.toString() },
		});
		return await res.json();
	},

	createWorkRecord: async (data: {
		userId: string;
		workPoints: number;
		memo?: string;
	}) => {
		const res = await client.api["work-records"].$post({
			json: data,
		});
		return await res.json();
	},

	completePomodoroSession: async (data: {
		userId: string;
		workPoints: number;
		sessionData?: Record<string, unknown>;
	}) => {
		const res = await client.api["work-records"]["pomodoro-complete"].$post({
			json: data,
		});
		return await res.json();
	},

	getWorkStats: async (userId: string, _days = 7) => {
		const res = await client.api["work-records"].stats[":userId"].$get({
			param: { userId },
		});
		return await res.json();
	},
};

// Users API
export const usersApi = {
	getUser: async (userId: string) => {
		const res = await client.api.users[":userId"].$get({
			param: { userId },
		});
		return await res.json();
	},

	updateUser: async (
		userId: string,
		data: { name?: string; avatarId?: number },
	) => {
		const res = await (client.api.users[":userId"] as any).$put({
			param: { userId },
			json: data,
		});
		return await res.json();
	},

	getUserToday: async (userId: string) => {
		const res = await client.api.users[":userId"].today.$get({
			param: { userId },
		});
		return await res.json();
	},

	getAllUsers: async (limit = 50, offset = 0) => {
		const res = await client.api.users.$get({
			query: { limit: limit.toString(), offset: offset.toString() },
		});
		return await res.json();
	},
};

// Avatars API
export const avatarsApi = {
	getAvatars: async () => {
		const res = await client.api.avatars.$get();
		return await res.json();
	},

	getAvatar: async (avatarId: number) => {
		const res = await client.api.avatars[":avatarId"].$get({
			param: { avatarId: avatarId.toString() },
		});
		return await res.json();
	},

	initializeAvatars: async () => {
		const res = await client.api.avatars.initialize.$post();
		return await res.json();
	},
};
