import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Create axios instance
export const apiClient = axios.create({
	baseURL: API_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
	(config) => {
		// Try to get token from localStorage
		let token = null;

		// Check if we're in browser environment
		if (typeof window !== "undefined") {
			// Use a single token for all authenticated requests
			token = localStorage.getItem("access_token");
		}

		// Add token to headers if available
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Response interceptor to handle common responses and errors
apiClient.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		/* const { response } = error;

		// Handle 401 Unauthorized
		if (response?.status === 401) {
			// Check if we're in browser environment
			if (typeof window !== "undefined") {
				// Clear tokens and redirect based on the request URL
				if (error.config?.url?.includes("/admin/")) {
					localStorage.removeItem("admin_access_token");
					localStorage.removeItem("admin_user");
					window.location.href = "/admin/login";
				} else if (error.config?.url?.includes("/staff/")) {
					localStorage.removeItem("staff_access_token");
					localStorage.removeItem("staff_user");
					window.location.href = "/staff/login";
				}
			}
		}

		// Handle 403 Forbidden
		if (response?.status === 403) {
			console.error("Access forbidden:", response.data);
		}

		// Handle 500 Internal Server Error
		if (response?.status === 500) {
			console.error("Server error:", response.data);
		}

		// Handle network errors
		if (!response) {
			console.error("Network error:", error.message);
		} */

		return Promise.reject(error);
	}
);

export default apiClient;
