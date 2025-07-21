"use client";

import { format, subDays } from "date-fns";
import { CalendarDays } from "lucide-react";
import { useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { useAdminDashboardRevenue } from "../hooks/useDashboard";

const chartConfig = {
	revenue: {
		label: "Revenue",
		color: "var(--chart-4)",
	},
};

type TimePeriod = "7" | "30" | "90";

const timePeriodOptions = [
	{ value: "7" as TimePeriod, label: "Last 7 days" },
	{ value: "30" as TimePeriod, label: "Last 30 days" },
	{ value: "90" as TimePeriod, label: "Last 90 days" },
];

export function RevenueChart() {
	const [timePeriod, setTimePeriod] = useState<TimePeriod>("7");

	// Calculate date range based on selected time period
	const toDate = new Date();
	const fromDate = subDays(toDate, parseInt(timePeriod));

	// Format dates to yyyy-MM-dd to avoid time components and infinite loops
	const formattedToDate = format(toDate, "yyyy-MM-dd");
	const formattedFromDate = format(fromDate, "yyyy-MM-dd");

	const {
		data: revenueData,
		isLoading,
		error,
	} = useAdminDashboardRevenue({
		fromDate: formattedFromDate,
		toDate: formattedToDate,
	});

	// Transform data for the chart
	const chartData =
		revenueData?.map((item) => ({
			date: format(new Date(item.date), "MMM dd"),
			revenue: item.amount,
			fullDate: format(new Date(item.date), "yyyy-MM-dd"),
		})) || [];

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<div className="space-y-1">
					<CardTitle className="flex items-center gap-2">
						<CalendarDays className="h-4 w-4" />
						Revenue Overview
					</CardTitle>
					<CardDescription>Track your revenue performance over time</CardDescription>
				</div>
				<Select value={timePeriod} onValueChange={(value: TimePeriod) => setTimePeriod(value)}>
					<SelectTrigger className="w-[140px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{timePeriodOptions.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{/* Chart */}
					<div className="h-[300px]">
						{isLoading ? (
							<div className="flex items-center justify-center h-full">
								<div className="text-sm text-muted-foreground">Loading chart data...</div>
							</div>
						) : error ? (
							<div className="flex items-center justify-center h-full">
								<div className="text-sm text-red-500">Error loading chart data</div>
							</div>
						) : chartData.length === 0 ? (
							<div className="flex items-center justify-center h-full">
								<div className="text-sm text-muted-foreground">
									No data available for this period
								</div>
							</div>
						) : (
							<ChartContainer config={chartConfig} className="h-full w-full">
								<ResponsiveContainer width="100%" height="100%">
									<AreaChart
										data={chartData}
										margin={{
											top: 10,
											right: 10,
											left: 0,
											bottom: 0,
										}}
									>
										<CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
										<XAxis
											dataKey="date"
											fontSize={12}
											tickLine={false}
											axisLine={false}
											className="fill-muted-foreground"
										/>
										<YAxis
											fontSize={12}
											tickLine={false}
											axisLine={false}
											className="fill-muted-foreground"
											tickFormatter={(value) =>
												`${new Intl.NumberFormat("vi-VN", {
													style: "currency",
													currency: "VND",
												}).format(value)}`
											}
										/>
										<ChartTooltip
											content={
												<ChartTooltipContent
													labelFormatter={(label, payload) => {
														const data = payload?.[0]?.payload;
														return data ? `Date: ${data.fullDate}` : label;
													}}
													formatter={(value) => [
														`${Number(value).toLocaleString("vi-VN", {
															style: "currency",
															currency: "VND",
														})}`,
														"Revenue",
													]}
												/>
											}
										/>
										<Area
											type="natural"
											dataKey="revenue"
											stroke="var(--color-revenue)"
											fill="var(--color-revenue)"
											fillOpacity={0.1}
											strokeWidth={2}
										/>
									</AreaChart>
								</ResponsiveContainer>
							</ChartContainer>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
