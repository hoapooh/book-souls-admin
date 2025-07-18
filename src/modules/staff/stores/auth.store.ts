import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
	id: string;
	fullName: string;
	role: string;
	avatar: string;
}

interface StaffAuthState {
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

export const useStaffAuthStore = create<StaffAuthState>()(
	persist(
		(set) => ({
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
				localStorage.setItem("staff_access_token", accessToken);
				localStorage.setItem("staff_user", JSON.stringify(user));
			},

			clearAuth: () => {
				set({
					user: null,
					accessToken: null,
					isAuthenticated: false,
					error: null,
				});
				localStorage.removeItem("staff_access_token");
				localStorage.removeItem("staff_user");
			},

			setLoading: (loading) => set({ isLoading: loading }),
			setError: (error) => set({ error }),
			setHasHydrated: (state) => set({ _hasHydrated: state }),
		}),
		{
			name: "staff-auth-storage",
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
