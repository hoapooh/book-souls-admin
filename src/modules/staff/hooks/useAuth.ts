import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { handleApiError } from "@/configs/error-handler";
import { LoginBody } from "@/interfaces/authentication";
import { useMutation } from "@tanstack/react-query";

import { staffAuthService } from "../services/auth.service";
import { useStaffAuthStore } from "../stores/auth.store";

export const useStaffAuth = () => {
	const router = useRouter();
	const { setAuth, clearAuth, setLoading, setError } = useStaffAuthStore();

	const loginMutation = useMutation({
		mutationFn: staffAuthService.login,
		onMutate: () => {
			setLoading(true);
			setError(null);
		},
		onSuccess: (data) => {
			const { token } = data;
			setAuth(
				{
					id: token.id,
					fullName: token.fullName,
					role: token.role,
					avatar: token.avatar,
				},
				token.accessToken
			);
			toast.success("Login successful!");
			router.push("/staff/orders");
		},
		onError: (error: AxiosError) => {
			const apiError = handleApiError(error);
			setError(apiError.message);
			toast.error(apiError.message);
		},
		onSettled: () => {
			setLoading(false);
		},
	});

	const logoutMutation = useMutation({
		mutationFn: staffAuthService.logout,
		onSuccess: () => {
			clearAuth();
			toast.success("Bye Bye!");
			router.push("/staff/login");
		},
		onError: (error: AxiosError) => {
			const apiError = handleApiError(error);
			toast.error(apiError.message);
		},
	});

	const login = (credentials: LoginBody) => {
		loginMutation.mutate(credentials);
	};

	const logout = () => {
		logoutMutation.mutate();
	};

	return {
		login,
		logout,
		isLoading: loginMutation.isPending || logoutMutation.isPending,
		error: loginMutation.error,
	};
};
