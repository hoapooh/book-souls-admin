import { apiClient } from "@/configs/api.config";
import { AllUserResponse, AllUserParams, IUser } from "@/interfaces/user";

export const userService = {
	// Get all users with pagination
	getAllUsers: async (params: AllUserParams): Promise<AllUserResponse> => {
		const searchParams = new URLSearchParams();
		searchParams.append("pageIndex", params.pageIndex.toString());
		searchParams.append("limit", params.limit.toString());

		const response = await apiClient.get(`/users?${searchParams.toString()}`);
		return response.data;
	},

	// Get user by ID
	getUserById: async (id: string): Promise<IUser> => {
		const response = await apiClient.get(`/users/${id}`);
		return response.data;
	},

	// Delete user by ID
	deleteUser: async (id: string): Promise<void> => {
		await apiClient.delete(`/users/${id}`);
	},
};
