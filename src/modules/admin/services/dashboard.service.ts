import { apiClient } from "@/configs";
import {
	IDashboardRevenue,
	IDashboardRevenueParams,
	IDashboardSummary,
} from "@/interfaces/dashboard";

export const dashboardService = {
	// Get dashboard revenue data
	getDashboardRevenue: async (params: IDashboardRevenueParams): Promise<IDashboardRevenue[]> => {
		const response = await apiClient.get("/dashboard/revenues", { params });
		return response.data;
	},
	getDashboardSummary: async (): Promise<IDashboardSummary> => {
		const response = await apiClient.get("/dashboard/summary");
		return response.data;
	},
};
