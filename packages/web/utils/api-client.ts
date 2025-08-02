const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const apiClient = {
	hello: {
		get: async () => {
			const response = await fetch(`${API_BASE_URL}/api/hello`);
			return response.json();
		},
	},
	test: {
		get: async () => {
			const response = await fetch(`${API_BASE_URL}/api/test`);
			return response.json();
		},
		post: async (data: { text: string }) => {
			const response = await fetch(`${API_BASE_URL}/api/test`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});
			return response.json();
		},
	},
};
