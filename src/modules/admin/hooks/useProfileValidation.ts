import { useEffect } from "react";

import { useQuery } from "@tanstack/react-query";

import { adminAuthService } from "../services/auth.service";
import { useAdminAuthStore } from "../stores/auth.store";

export const useAdminProfileValidation = () => {
	const { accessToken, isAuthenticated, clearAuth, _hasHydrated } = useAdminAuthStore();

	const {
		data: profileData,
		error,
		isLoading,
	} = useQuery({
		queryKey: ["admin-profile"],
		queryFn: adminAuthService.getProfile,
		enabled: isAuthenticated && !!accessToken && _hasHydrated,
		retry: false,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});

	// Clear auth if profile fetch fails (token invalid)
	useEffect(() => {
		if (error && _hasHydrated && isAuthenticated) {
			console.log("Profile validation failed, clearing auth");
			clearAuth();
		}
	}, [error, _hasHydrated, isAuthenticated, clearAuth]);

	return {
		isValidating: isLoading,
		isValid: !!profileData && !error,
		profile: profileData,
	};
};
