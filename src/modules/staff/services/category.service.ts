import { apiClient } from "@/configs";
import {
	ICategoryCreateBody,
	ICategoryListResponseType,
	ICategoryParams,
} from "@/interfaces/category";

export const categoryService = {
	getCategories: async (params: ICategoryParams): Promise<ICategoryListResponseType> => {
		const response = await apiClient.get("/categories", {
			params,
		});
		return response.data;
	},
	createCategory: async (body: ICategoryCreateBody): Promise<void> => {
		const response = await apiClient.post("/categories", body);
		return response.data;
	},
	updateCategory: async (id: string, body: ICategoryCreateBody): Promise<void> => {
		const response = await apiClient.put(`/categories/${id}`, body);
		return response.data;
	},
	deleteCategory: async (id: string): Promise<void> => {
		const response = await apiClient.delete(`/categories/${id}`);
		return response.data;
	},
};
