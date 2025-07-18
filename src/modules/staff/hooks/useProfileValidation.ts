import { useEffect } from "react";

import { useQuery } from "@tanstack/react-query";

import { staffAuthService } from "../services/auth.service";
import { useStaffAuthStore } from "../stores/auth.store";

export const useStaffProfileValidation = () => {
	const { accessToken, isAuthenticated, clearAuth, _hasHydrated } = useStaffAuthStore();

	const {
		data: profileData,
		error,
		isLoading,
	} = useQuery({
		queryKey: ["staff-profile"],
		queryFn: staffAuthService.getProfile,
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
