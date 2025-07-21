export interface IDashboardRevenue {
	date: Date | string;
	amount: number;
}

export interface IDashboardRevenueParams {
	fromDate?: Date | string;
	toDate?: Date | string;
}

export interface IDashboardSummary {
	totalRevenue: number;
	totalOrders: number;
	totalUsers: number;
}
