import { AxiosError } from "axios";

export interface ApiErrorResponse {
	message?: string;
	code?: string;
	data?: Record<string, string | number | boolean | null>;
	errors?: Array<{
		field?: string;
		message?: string;
		code?: string;
	}>;
}

export interface ApiError {
	message: string;
	status?: number;
	code?: string;
	details?: ApiErrorResponse;
}

export const handleApiError = (error: Error | AxiosError): ApiError => {
	if (error instanceof AxiosError) {
		const axiosError = error as AxiosError<ApiErrorResponse>;

		// If we have a response from the server
		if (axiosError.response) {
			const responseData = axiosError.response.data;

			// Safely extract message from response data
			let message = "An error occurred";
			if (responseData && typeof responseData === "object" && "message" in responseData) {
				message = String(responseData.message) || message;
			}

			// Safely extract code from response data
			let code: string | undefined;
			if (responseData && typeof responseData === "object" && "code" in responseData) {
				code = String(responseData.code);
			}

			return {
				message,
				status: axiosError.response.status,
				code,
				details: responseData as ApiErrorResponse,
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

	// Handle standard Error objects
	if (error instanceof Error) {
		return {
			message: error.message,
			code: "UNKNOWN_ERROR",
		};
	}

	// This should never happen with proper typing
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

// Additional utility functions for better error handling
export const createApiError = (
	message: string,
	code?: string,
	status?: number,
	details?: ApiErrorResponse
): ApiError => {
	return {
		message,
		code,
		status,
		details,
	};
};

export const isNetworkError = (error: ApiError): boolean => {
	return error.code === "NETWORK_ERROR" || error.status === 0;
};

export const isValidationError = (error: ApiError): boolean => {
	return error.status === 400 || error.code === "VALIDATION_ERROR";
};

export const isAuthenticationError = (error: ApiError): boolean => {
	return error.status === 401 || error.code === "AUTHENTICATION_ERROR";
};

export const isAuthorizationError = (error: ApiError): boolean => {
	return error.status === 403 || error.code === "AUTHORIZATION_ERROR";
};

export const isServerError = (error: ApiError): boolean => {
	return (error.status !== undefined && error.status >= 500) || error.code === "SERVER_ERROR";
};
