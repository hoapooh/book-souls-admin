"use client";

import { redirect } from "next/navigation";

import { useStaffAuthStore } from "@/modules/staff/stores/auth.store";
import { CategoryManagementTable } from "@/modules/staff/ui/CategoryManagementTable";

export default function StaffCategoriesPage() {
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
					<h1 className="text-3xl font-bold">Category Management</h1>
					<p className="text-muted-foreground">Manage book categories and organize your library</p>
				</div>
			</div>

			<CategoryManagementTable />
		</div>
	);
}
