"use client";

import { BookOpen, ShoppingCart, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IUser } from "@/interfaces/user";
import { useAdminAuth } from "@/modules/admin/hooks/useAuth";
import { useAdminProfileValidation } from "@/modules/admin/hooks/useProfileValidation";
import { useAdminAuthStore } from "@/modules/admin/stores/auth.store";
import { UserDetailModal } from "@/modules/admin/ui/UserDetailModal";
import { UserManagementTable } from "@/modules/admin/ui/UserManagementTable";

export default function AdminDashboard() {
	const router = useRouter();
	const { user, isAuthenticated, _hasHydrated } = useAdminAuthStore();
	const { logout } = useAdminAuth();
	const { isValidating } = useAdminProfileValidation();
	const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
	const [userDetailModalOpen, setUserDetailModalOpen] = useState(false);

	useEffect(() => {
		// Wait for hydration before checking authentication
		if (_hasHydrated && !isAuthenticated) {
			router.push("/admin/login");
		}
	}, [isAuthenticated, _hasHydrated, router]);

	const handleViewUser = (user: IUser) => {
		setSelectedUser(user);
		setUserDetailModalOpen(true);
	};

	if (!_hasHydrated || isValidating) {
		return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
	}

	if (!isAuthenticated || !user) {
		return null;
	}

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-7xl mx-auto">
				<div className="flex justify-between items-center mb-8">
					<div>
						<h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
						<p className="text-gray-600">Welcome back, {user.fullName}!</p>
					</div>
					<Button onClick={logout} variant="outline">
						Logout
					</Button>
				</div>

				<Tabs defaultValue="overview" className="space-y-6">
					<TabsList className="grid w-full lg:w-[400px] grid-cols-2">
						<TabsTrigger value="overview">Overview</TabsTrigger>
						<TabsTrigger value="users">User Management</TabsTrigger>
					</TabsList>

					<TabsContent value="overview" className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">Total Books</CardTitle>
									<BookOpen className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">1,234</div>
									<p className="text-xs text-muted-foreground">+20.1% from last month</p>
								</CardContent>
							</Card>

							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">Active Staff</CardTitle>
									<Users className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">45</div>
									<p className="text-xs text-muted-foreground">+5 new this month</p>
								</CardContent>
							</Card>

							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">Orders Today</CardTitle>
									<ShoppingCart className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">78</div>
									<p className="text-xs text-muted-foreground">+12% from yesterday</p>
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					<TabsContent value="users" className="space-y-6">
						<UserManagementTable onViewUser={handleViewUser} />
					</TabsContent>
				</Tabs>

				{/* User Detail Modal */}
				<UserDetailModal
					user={selectedUser}
					open={userDetailModalOpen}
					onOpenChange={setUserDetailModalOpen}
				/>
			</div>
		</div>
	);
}
