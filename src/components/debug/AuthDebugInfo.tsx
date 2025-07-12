"use client";

import { useStaffAuthStore } from "@/modules/staff/stores/auth.store";
import { useAdminAuthStore } from "@/modules/admin/stores/auth.store";

export function AuthDebugInfo() {
	const staffAuth = useStaffAuthStore();
	const adminAuth = useAdminAuthStore();

	if (process.env.NODE_ENV !== "development") {
		return null;
	}

	return (
		<div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded text-xs max-w-xs z-50">
			<div className="font-bold mb-2">Auth Debug Info</div>

			<div className="mb-2">
				<div className="font-semibold">Staff:</div>
				<div>Hydrated: {staffAuth._hasHydrated ? "✅" : "❌"}</div>
				<div>Authenticated: {staffAuth.isAuthenticated ? "✅" : "❌"}</div>
				<div>User: {staffAuth.user ? "✅" : "❌"}</div>
				<div>Token: {staffAuth.accessToken ? "✅" : "❌"}</div>
				<div>Loading: {staffAuth.isLoading ? "✅" : "❌"}</div>
			</div>

			<div className="mb-2">
				<div className="font-semibold">Admin:</div>
				<div>Hydrated: {adminAuth._hasHydrated ? "✅" : "❌"}</div>
				<div>Authenticated: {adminAuth.isAuthenticated ? "✅" : "❌"}</div>
				<div>User: {adminAuth.user ? "✅" : "❌"}</div>
				<div>Token: {adminAuth.accessToken ? "✅" : "❌"}</div>
				<div>Loading: {adminAuth.isLoading ? "✅" : "❌"}</div>
			</div>

			<div>
				<div className="font-semibold">LocalStorage:</div>
				<div>
					Staff Token:{" "}
					{typeof window !== "undefined" && localStorage.getItem("staff_access_token")
						? "✅"
						: "❌"}
				</div>
				<div>
					Admin Token:{" "}
					{typeof window !== "undefined" && localStorage.getItem("admin_access_token")
						? "✅"
						: "❌"}
				</div>
			</div>
		</div>
	);
}
