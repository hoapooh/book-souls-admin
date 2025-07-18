"use client";

import { redirect } from "next/navigation";

import { useStaffAuthStore } from "@/modules/staff/stores/auth.store";
import { PublisherManagementTable } from "@/modules/staff/ui/PublisherManagementTable";

export default function StaffPublishersPage() {
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
					<h1 className="text-3xl font-bold">Publisher Management</h1>
					<p className="text-muted-foreground">Manage book publishers and organize your library</p>
				</div>
			</div>

			<PublisherManagementTable />
		</div>
	);
}
