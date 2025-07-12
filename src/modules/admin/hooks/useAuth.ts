import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { adminAuthService } from "../services/auth.service";
import { useAdminAuthStore } from "../stores/auth.store";
import { LoginBody } from "@/interfaces/authentication";
import { handleApiError } from "@/configs/error-handler";
import { toast } from "sonner";

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
		onError: (error: unknown) => {
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
			toast.success("Logged out successfully");
			router.push("/admin/login");
		},
		onError: (error: unknown) => {
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
