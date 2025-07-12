"use client";

import { useStaffAuthStore } from "@/modules/staff/stores/auth.store";
import { useStaffAuth } from "@/modules/staff/hooks/useAuth";
import { redirect, usePathname } from "next/navigation";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { BookOpen, Package, Home, LogOut } from "lucide-react";
import Link from "next/link";

const navigationItems = [
	{
		title: "Dashboard",
		href: "/staff/dashboard",
		icon: Home,
		id: "dashboard",
	},
	{
		title: "Books",
		href: "/staff/books",
		icon: BookOpen,
		id: "books",
	},
	{
		title: "Orders",
		href: "/staff/orders",
		icon: Package,
		id: "orders",
	},
];

export default function StaffLayout({ children }: { children: React.ReactNode }) {
	const { user, isLoading, isAuthenticated } = useStaffAuthStore();
	const { logout } = useStaffAuth();
	const pathname = usePathname();

	if (isLoading) {
		return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
	}

	if (!isAuthenticated || !user) {
		redirect("/staff/login");
	}

	return (
		<SidebarProvider>
			<div className="min-h-screen flex w-full">
				<Sidebar variant="inset">
					<SidebarHeader>
						<div className="flex items-center gap-2 px-4 py-2">
							<BookOpen className="h-6 w-6" />
							<span className="font-semibold">BookSouls Staff</span>
						</div>
					</SidebarHeader>
					<SidebarContent>
						<SidebarGroup>
							<SidebarGroupLabel>Navigation</SidebarGroupLabel>
							<SidebarGroupContent>
								<SidebarMenu>
									{navigationItems.map((item) => (
										<SidebarMenuItem key={item.id}>
											<SidebarMenuButton asChild isActive={pathname === item.href}>
												<Link href={item.href}>
													<item.icon />
													<span>{item.title}</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
									))}
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
					</SidebarContent>
					<SidebarFooter>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton onClick={logout}>
									<LogOut />
									<span>Logout</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarFooter>
				</Sidebar>
				<main className="flex-1 flex flex-col overflow-hidden">
					<header className="border-b bg-background px-6 py-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-4">
								<SidebarTrigger />
								<div>
									<h1 className="text-2xl font-semibold">
										{navigationItems.find((item) => pathname === item.href)?.title ||
											"Staff Portal"}
									</h1>
									<p className="text-sm text-muted-foreground">Welcome back, {user.fullName}!</p>
								</div>
							</div>
						</div>
					</header>
					<div className="flex-1 overflow-auto">{children}</div>
				</main>
			</div>
		</SidebarProvider>
	);
}
