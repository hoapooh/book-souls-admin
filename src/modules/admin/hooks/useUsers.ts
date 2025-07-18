import { toast } from "sonner";

import { AllUserParams } from "@/interfaces/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { userService } from "../services/user.service";

// Query keys for user-related queries
export const userQueryKeys = {
	all: ["users"] as const,
	lists: () => [...userQueryKeys.all, "list"] as const,
	list: (params: AllUserParams) => [...userQueryKeys.lists(), params] as const,
	details: () => [...userQueryKeys.all, "detail"] as const,
	detail: (id: string) => [...userQueryKeys.details(), id] as const,
};

// Hook to get all users with pagination
export const useGetAllUsers = (params: AllUserParams) => {
	return useQuery({
		queryKey: userQueryKeys.list(params),
		queryFn: () => userService.getAllUsers(params),
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});
};

// Hook to get user by ID
export const useGetUserById = (id: string, enabled: boolean = true) => {
	return useQuery({
		queryKey: userQueryKeys.detail(id),
		queryFn: () => userService.getUserById(id),
		enabled: enabled && !!id,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});
};

// Hook to delete user
export const useDeleteUser = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => userService.deleteUser(id),
		onSuccess: () => {
			// Invalidate all user list queries to refetch data
			queryClient.invalidateQueries({
				queryKey: userQueryKeys.lists(),
			});
			toast.success("User deleted successfully");
		},
		onError: () => {
			toast.error("Failed to delete user");
		},
	});
};
