"use client";

import { useStaffAuthStore } from "@/modules/staff/stores/auth.store";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Package, Users, TrendingUp, ShoppingCart, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function StaffDashboardPage() {
	const { user, isLoading, isAuthenticated } = useStaffAuthStore();

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (!isAuthenticated || !user) {
		redirect("/staff/login");
	}

	const stats = [
		{
			title: "Total Books",
			value: "2,341",
			icon: BookOpen,
			change: "+12%",
			href: "/staff/books",
		},
		{
			title: "Low Stock Items",
			value: "23",
			icon: Package,
			change: "Requires attention",
			href: "/staff/books",
		},
		{
			title: "Orders Today",
			value: "89",
			icon: ShoppingCart,
			change: "+7%",
			href: "/staff/orders",
		},
		{
			title: "Revenue",
			value: "$5,234",
			icon: TrendingUp,
			change: "+15%",
			href: "#",
		},
		{
			title: "Active Customers",
			value: "1,234",
			icon: Users,
			change: "+3%",
			href: "#",
		},
	];

	const quickActions = [
		{
			title: "Manage Books",
			description: "Add, edit, or remove books from inventory",
			href: "/staff/books",
			icon: BookOpen,
		},
		{
			title: "Process Orders",
			description: "View and manage customer orders",
			href: "/staff/orders",
			icon: Package,
		},
		{
			title: "View Analytics",
			description: "Check sales reports and analytics",
			href: "#",
			icon: BarChart3,
		},
	];

	return (
		<div className="container mx-auto p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Staff Dashboard</h1>
					<p className="text-muted-foreground">Welcome back, {user.fullName}!</p>
				</div>
			</div>

			{/* Stats Grid */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{stats.map((stat) => (
					<Link key={stat.title} href={stat.href}>
						<Card className="hover:shadow-lg transition-shadow cursor-pointer">
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
								<stat.icon className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{stat.value}</div>
								<p className="text-xs text-muted-foreground">
									{stat.change.startsWith("+") || stat.change.startsWith("-") ? (
										<span
											className={stat.change.startsWith("+") ? "text-green-600" : "text-red-600"}
										>
											{stat.change}
										</span>
									) : (
										stat.change
									)}
									{stat.change.includes("%") && " from last period"}
								</p>
							</CardContent>
						</Card>
					</Link>
				))}
			</div>

			{/* Quick Actions */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{quickActions.map((action) => (
					<Link key={action.title} href={action.href}>
						<Card className="hover:shadow-lg transition-shadow cursor-pointer">
							<CardHeader>
								<div className="flex items-center space-x-2">
									<action.icon className="h-5 w-5" />
									<CardTitle>{action.title}</CardTitle>
								</div>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground">{action.description}</p>
							</CardContent>
						</Card>
					</Link>
				))}
			</div>

			{/* Recent Activity */}
			<Card>
				<CardHeader>
					<CardTitle>Recent Activity</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="flex items-center space-x-4">
							<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
							<div className="flex-1">
								<p className="text-sm">
									New book &quot;The Great Adventure&quot; added to inventory
								</p>
								<p className="text-xs text-muted-foreground">2 hours ago</p>
							</div>
						</div>
						<div className="flex items-center space-x-4">
							<div className="w-2 h-2 bg-green-500 rounded-full"></div>
							<div className="flex-1">
								<p className="text-sm">Order #12345 has been processed</p>
								<p className="text-xs text-muted-foreground">4 hours ago</p>
							</div>
						</div>
						<div className="flex items-center space-x-4">
							<div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
							<div className="flex-1">
								<p className="text-sm">
									Low stock alert: &quot;Mystery Novel&quot; has only 3 copies left
								</p>
								<p className="text-xs text-muted-foreground">6 hours ago</p>
							</div>
						</div>
						<div className="flex items-center space-x-4">
							<div className="w-2 h-2 bg-purple-500 rounded-full"></div>
							<div className="flex-1">
								<p className="text-sm">
									Inventory updated for &quot;Science Fiction Collection&quot;
								</p>
								<p className="text-xs text-muted-foreground">1 day ago</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
