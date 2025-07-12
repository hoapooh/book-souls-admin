import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
	id: string;
	fullName: string;
	role: string;
	avatar: string;
}

interface AdminAuthState {
	user: User | null;
	accessToken: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
	_hasHydrated: boolean;
	setAuth: (user: User, accessToken: string) => void;
	clearAuth: () => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
	setHasHydrated: (state: boolean) => void;
}

export const useAdminAuthStore = create<AdminAuthState>()(
	persist(
		(set, get) => ({
			user: null,
			accessToken: null,
			isAuthenticated: false,
			isLoading: false,
			error: null,
			_hasHydrated: false,

			setAuth: (user, accessToken) => {
				set({
					user,
					accessToken,
					isAuthenticated: true,
					error: null,
				});
				localStorage.setItem("admin_access_token", accessToken);
				localStorage.setItem("admin_user", JSON.stringify(user));
			},

			clearAuth: () => {
				set({
					user: null,
					accessToken: null,
					isAuthenticated: false,
					error: null,
				});
				localStorage.removeItem("admin_access_token");
				localStorage.removeItem("admin_user");
			},

			setLoading: (loading) => set({ isLoading: loading }),
			setError: (error) => set({ error }),
			setHasHydrated: (state) => set({ _hasHydrated: state }),
		}),
		{
			name: "admin-auth-storage",
			partialize: (state) => ({
				user: state.user,
				accessToken: state.accessToken,
				isAuthenticated: state.isAuthenticated,
			}),
			onRehydrateStorage: () => (state) => {
				state?.setHasHydrated(true);
			},
		}
	)
);
