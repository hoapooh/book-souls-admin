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
	setAuth: (user: User, accessToken: string) => void;
	clearAuth: () => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
}

export const useAdminAuthStore = create<AdminAuthState>()(
	persist(
		(set) => ({
			user: null,
			accessToken: null,
			isAuthenticated: false,
			isLoading: false,
			error: null,

			setAuth: (user, accessToken) => {
				set({
					user,
					accessToken,
					isAuthenticated: true,
					error: null,
				});
				localStorage.setItem("access_token", accessToken);
				localStorage.setItem("user", JSON.stringify(user));
			},

			clearAuth: () => {
				set({
					user: null,
					accessToken: null,
					isAuthenticated: false,
					error: null,
				});
				localStorage.removeItem("access_token");
				localStorage.removeItem("user");
			},

			setLoading: (loading) => set({ isLoading: loading }),
			setError: (error) => set({ error }),
		}),
		{
			name: "admin-auth-storage",
			partialize: (state) => ({
				user: state.user,
				accessToken: state.accessToken,
				isAuthenticated: state.isAuthenticated,
			}),
		}
	)
);
