import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { handleApiError } from "@/configs/error-handler";
import { LoginBody } from "@/interfaces/authentication";
import { useMutation } from "@tanstack/react-query";

import { adminAuthService } from "../services/auth.service";
import { useAdminAuthStore } from "../stores/auth.store";

export const useAdminAuth = () => {
	const router = useRouter();
	const { setAuth, clearAuth, setLoading, setError } = useAdminAuthStore();

	const loginMutation = useMutation({
		mutationFn: adminAuthService.login,
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
			router.push("/admin/dashboard");
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
		mutationFn: adminAuthService.logout,
		onSuccess: () => {
			clearAuth();
			toast.success("Bye Bye!");
			router.push("/admin/login");
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
