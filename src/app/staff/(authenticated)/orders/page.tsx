"use client";

import { useStaffAuthStore } from "@/modules/staff/stores/auth.store";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StaffOrdersPage() {
	const { user, isLoading } = useStaffAuthStore();

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (!user) {
		redirect("/staff/login");
	}

	return (
		<div className="container mx-auto p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Order Management</h1>
					<p className="text-muted-foreground">Manage customer orders and order processing</p>
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>All Orders</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-center py-8 text-muted-foreground">
						Order management functionality coming soon...
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
