import { apiClient } from "@/configs";
import {
	IPublisherCreateBody,
	IPublisherListResponseType,
	IPublisherParams,
} from "@/interfaces/publisher";

export const publisherService = {
	getPublishers: async (params: IPublisherParams): Promise<IPublisherListResponseType> => {
		const response = await apiClient.get("/publishers", { params });
		return response.data;
	},
	createPublisher: async (body: IPublisherCreateBody): Promise<void> => {
		const response = await apiClient.post("/publishers", body);
		return response.data;
	},
	updatePublisher: async (id: string, body: IPublisherCreateBody): Promise<void> => {
		const response = await apiClient.put(`/publishers/${id}`, body);
		return response.data;
	},
	deletePublisher: async (id: string): Promise<void> => {
		const response = await apiClient.delete(`/publishers/${id}`);
		return response.data;
	},
};
