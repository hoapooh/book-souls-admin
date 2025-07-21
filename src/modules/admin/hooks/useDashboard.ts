import { IDashboardRevenueParams } from "@/interfaces/dashboard";
import { useQuery } from "@tanstack/react-query";

import { dashboardService } from "../services/dashboard.service";

export const useAdminDashboardRevenue = (params: IDashboardRevenueParams) => {
	return useQuery({
		queryKey: ["admin-dashboard-revenue", params.fromDate, params.toDate],
		queryFn: () => dashboardService.getDashboardRevenue(params),
		enabled: !!(params.fromDate && params.toDate),
	});
};

export const useAdminDashboardSummary = () => {
	return useQuery({
		queryKey: ["admin-dashboard-summary"],
		queryFn: () => dashboardService.getDashboardSummary(),
	});
};
