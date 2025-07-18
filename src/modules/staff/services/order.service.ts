import { apiClient } from "@/configs";
import { IOrderListResponseType, IOrderParams, OrderStatus } from "@/interfaces/order";

export const staffOrderService = {
	getOrders: async (params?: IOrderParams): Promise<IOrderListResponseType> => {
		const response = await apiClient.get("/orders", { params });
		return response.data;
	},
	changeStatus: async (params: { status: OrderStatus }, id: string) => {
		const response = await apiClient.post(`/orders/${id}/status-change`, null, {
			params,
		});
		return response.data;
	},
	cancelOrder: async (params: { cancelReason?: string }, id: string) => {
		const response = await apiClient.post(`/orders/${id}/cancel`, null, {
			params,
		});
		return response.data;
	},
};
