import { toast } from "sonner";

import { ICategoryCreateBody, ICategoryParams } from "@/interfaces/category";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { categoryService } from "../services/category.service";

// Query keys for category-related queries
export const staffCategoryQueryKeys = {
	all: ["staff-categories"] as const,
	lists: () => [...staffCategoryQueryKeys.all, "list"] as const,
	list: (params: ICategoryParams) => [...staffCategoryQueryKeys.lists(), params] as const,
	details: () => [...staffCategoryQueryKeys.all, "detail"] as const,
	detail: (id: string) => [...staffCategoryQueryKeys.details(), id] as const,
};

// Hook to get all categories with pagination and filters
export const useGetAllCategories = (params?: ICategoryParams) => {
	const defaultParams: ICategoryParams = { pageIndex: 1, limit: 10 };
	const queryParams = params || defaultParams;

	return useQuery({
		queryKey: staffCategoryQueryKeys.list(queryParams),
		queryFn: () => categoryService.getCategories(queryParams),
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});
};

// Hook to create category
export const useCreateCategory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (categoryData: ICategoryCreateBody) => categoryService.createCategory(categoryData),
		onSuccess: () => {
			// Invalidate all category list queries to refetch data
			queryClient.invalidateQueries({
				queryKey: staffCategoryQueryKeys.lists(),
			});
			toast.success("Category created successfully");
		},
		onError: (error: Error) => {
			toast.error(error?.message || "Failed to create category");
		},
	});
};

// Hook to update category
export const useUpdateCategory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, categoryData }: { id: string; categoryData: ICategoryCreateBody }) =>
			categoryService.updateCategory(id, categoryData),
		onSuccess: () => {
			// Invalidate all category queries to refetch data
			queryClient.invalidateQueries({
				queryKey: staffCategoryQueryKeys.all,
			});
			toast.success("Category updated successfully");
		},
		onError: (error: Error) => {
			toast.error(error?.message || "Failed to update category");
		},
	});
};

// Hook to delete category
export const useDeleteCategory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => categoryService.deleteCategory(id),
		onSuccess: () => {
			// Invalidate all category list queries to refetch data
			queryClient.invalidateQueries({
				queryKey: staffCategoryQueryKeys.lists(),
			});
			toast.success("Category deleted successfully");
		},
		onError: (error: Error) => {
			toast.error(error?.message || "Failed to delete category");
		},
	});
};
