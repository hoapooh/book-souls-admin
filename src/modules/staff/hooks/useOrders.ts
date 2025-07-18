import { toast } from "sonner";

import { IOrderParams, OrderStatus } from "@/interfaces/order";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { staffOrderService } from "../services/order.service";

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

// Hook to change order status
export const useChangeOrderStatus = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ orderId, status }: { orderId: string; status: OrderStatus }) =>
			staffOrderService.changeStatus({ status }, orderId),
		onSuccess: (_, { status }) => {
			// Invalidate all order list queries to refetch data
			queryClient.invalidateQueries({
				queryKey: orderQueryKeys.lists(),
			});
			toast.success(`Order status updated to ${status}`);
		},
		onError: () => {
			toast.error("Failed to update order status");
		},
	});
};

// Hook to cancel order with reason
export const useCancelOrder = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ orderId, cancelReason }: { orderId: string; cancelReason?: string }) =>
			staffOrderService.cancelOrder({ cancelReason }, orderId),
		onSuccess: () => {
			// Invalidate all order list queries to refetch data
			queryClient.invalidateQueries({
				queryKey: orderQueryKeys.lists(),
			});
			toast.success("Order has been cancelled successfully");
		},
		onError: () => {
			toast.error("Failed to cancel order");
		},
	});
};
