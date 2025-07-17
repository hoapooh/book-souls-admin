"use client";

import { BookOpen, Home, LogOut, MessageCircle, Package, Tag } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

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
import { useStaffAuth } from "@/modules/staff/hooks/useAuth";
import { useStaffProfileValidation } from "@/modules/staff/hooks/useProfileValidation";
import { useStaffAuthStore } from "@/modules/staff/stores/auth.store";

// import { AuthDebugInfo } from "@/components/debug/AuthDebugInfo";

const navigationItems = [
	{
		title: "Dashboard",
		href: "/staff/dashboard",
		icon: Home,
		id: "dashboard",
	},
	{
		title: "Orders",
		href: "/staff/orders",
		icon: Package,
		id: "orders",
	},
	{
		title: "Books",
		href: "/staff/books",
		icon: BookOpen,
		id: "books",
	},
	{
		title: "Categories",
		href: "/staff/categories",
		icon: Tag,
		id: "categories",
	},
	{
		title: "Chat",
		href: "/staff/chat",
		icon: MessageCircle,
		id: "chat",
	},
];

export default function StaffLayout({ children }: { children: React.ReactNode }) {
	const { user, isLoading, isAuthenticated, _hasHydrated } = useStaffAuthStore();
	const { logout } = useStaffAuth();
	const { isValidating } = useStaffProfileValidation();
	const pathname = usePathname();
	const router = useRouter();

	// Handle authentication redirect with useEffect to avoid hook order issues
	useEffect(() => {
		if (_hasHydrated && !isLoading && !isValidating && (!isAuthenticated || !user)) {
			router.push("/staff/login");
		}
	}, [_hasHydrated, isLoading, isValidating, isAuthenticated, user, router]);

	// Show loading while hydrating, authenticating, or validating profile
	if (!_hasHydrated || isLoading || isValidating) {
		return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
	}

	// Show loading while redirecting to login
	if (!isAuthenticated || !user) {
		return (
			<div className="flex items-center justify-center min-h-screen">Redirecting to login...</div>
		);
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
				{/* <AuthDebugInfo /> */}
			</div>
		</SidebarProvider>
	);
}
