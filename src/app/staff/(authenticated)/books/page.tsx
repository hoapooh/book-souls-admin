"use client";

import { BookManagementTable } from "@/modules/staff/ui/BookManagementTable";
import { useStaffAuthStore } from "@/modules/staff/stores/auth.store";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StaffBooksPage() {
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
					<h1 className="text-3xl font-bold">Book Management</h1>
					<p className="text-muted-foreground">Manage books, inventory, and book information</p>
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>All Books</CardTitle>
				</CardHeader>
				<CardContent>
					<BookManagementTable />
				</CardContent>
			</Card>
		</div>
	);
}
