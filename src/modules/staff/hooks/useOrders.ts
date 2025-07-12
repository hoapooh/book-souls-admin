import { useQuery } from "@tanstack/react-query";
import { staffOrderService } from "../services/order.service";
import { IOrderParams } from "@/interfaces/order";

// Query keys for order-related queries
export const orderQueryKeys = {
	all: ["orders"] as const,
	lists: () => [...orderQueryKeys.all, "list"] as const,
	list: (params: IOrderParams) => [...orderQueryKeys.lists(), params] as const,
	details: () => [...orderQueryKeys.all, "detail"] as const,
	detail: (id: string) => [...orderQueryKeys.details(), id] as const,
};

// Hook to get all orders with pagination and filters
export const useGetOrders = (params: IOrderParams) => {
	return useQuery({
		queryKey: orderQueryKeys.list(params),
		queryFn: () => staffOrderService.getOrders(params),
		staleTime: 30 * 1000, // 30 seconds (orders change frequently)
		gcTime: 5 * 60 * 1000, // 5 minutes
	});
};
