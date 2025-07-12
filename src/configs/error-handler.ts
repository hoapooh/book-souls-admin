import { AxiosError } from "axios";

export interface ApiError {
	message: string;
	status?: number;
	code?: string;
	details?: any;
}

export const handleApiError = (error: unknown): ApiError => {
	if (error instanceof AxiosError) {
		const axiosError = error as AxiosError<any>;

		// If we have a response from the server
		if (axiosError.response) {
			return {
				message: axiosError.response.data?.message || "An error occurred",
				status: axiosError.response.status,
				code: axiosError.response.data?.code,
				details: axiosError.response.data,
			};
		}

		// If the request was made but no response was received
		if (axiosError.request) {
			return {
				message: "Network error - please check your connection",
				status: 0,
				code: "NETWORK_ERROR",
			};
		}

		// Something happened in setting up the request
		return {
			message: axiosError.message || "Request setup error",
			code: "REQUEST_ERROR",
		};
	}

	// Handle non-Axios errors
	if (error instanceof Error) {
		return {
			message: error.message,
			code: "UNKNOWN_ERROR",
		};
	}

	// Fallback for unknown error types
	return {
		message: "An unknown error occurred",
		code: "UNKNOWN_ERROR",
	};
};

export const isApiError = (error: unknown): error is ApiError => {
	return (
		typeof error === "object" &&
		error !== null &&
		"message" in error &&
		typeof (error as ApiError).message === "string"
	);
};
