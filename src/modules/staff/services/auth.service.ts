import { apiClient } from "@/configs/api.config";
import { LoginBody, LoginResponse } from "@/interfaces/authentication";
import { IUser } from "@/interfaces/user";

export const staffAuthService = {
	login: async (credentials: LoginBody): Promise<LoginResponse> => {
		const response = await apiClient.post("/authentication/login", credentials);
		return response.data;
	},

	logout: async (): Promise<void> => {
		// If you have a logout endpoint, implement it here
		// await apiClient.post('/staff/logout');
	},

	// Get current user profile
	getProfile: async (): Promise<IUser> => {
		const response = await apiClient.get("/users/profile");
		return response.data;
	},
};
