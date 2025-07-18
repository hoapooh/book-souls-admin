import { toast } from "sonner";

import { IPublisherCreateBody, IPublisherParams } from "@/interfaces/publisher";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { publisherService } from "../services/publisher.service";

// Query keys for publisher-related queries
export const staffPublisherQueryKeys = {
	all: ["staff-publishers"] as const,
	lists: () => [...staffPublisherQueryKeys.all, "list"] as const,
	list: (params: IPublisherParams) => [...staffPublisherQueryKeys.lists(), params] as const,
	details: () => [...staffPublisherQueryKeys.all, "detail"] as const,
	detail: (id: string) => [...staffPublisherQueryKeys.details(), id] as const,
};

// Hook to get all publishers with pagination and filters
export const useGetAllPublishers = (params?: IPublisherParams) => {
	const defaultParams: IPublisherParams = { pageIndex: 1, limit: 10 };
	const queryParams = params || defaultParams;

	return useQuery({
		queryKey: staffPublisherQueryKeys.list(queryParams),
		queryFn: () => publisherService.getPublishers(queryParams),
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});
};

// Hook to create publisher
export const useCreatePublisher = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (publisherData: IPublisherCreateBody) =>
			publisherService.createPublisher(publisherData),
		onSuccess: () => {
			// Invalidate all publisher list queries to refetch data
			queryClient.invalidateQueries({
				queryKey: staffPublisherQueryKeys.lists(),
			});
			toast.success("Publisher created successfully");
		},
		onError: (error: Error) => {
			toast.error(error?.message || "Failed to create publisher");
		},
	});
};

// Hook to update publisher
export const useUpdatePublisher = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, publisherData }: { id: string; publisherData: IPublisherCreateBody }) =>
			publisherService.updatePublisher(id, publisherData),
		onSuccess: () => {
			// Invalidate all publisher queries to refetch data
			queryClient.invalidateQueries({
				queryKey: staffPublisherQueryKeys.all,
			});
			toast.success("Publisher updated successfully");
		},
		onError: (error: Error) => {
			toast.error(error?.message || "Failed to update publisher");
		},
	});
};

// Hook to delete publisher
export const useDeletePublisher = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => publisherService.deletePublisher(id),
		onSuccess: () => {
			// Invalidate all publisher list queries to refetch data
			queryClient.invalidateQueries({
				queryKey: staffPublisherQueryKeys.lists(),
			});
			toast.success("Publisher deleted successfully");
		},
		onError: (error: Error) => {
			toast.error(error?.message || "Failed to delete publisher");
		},
	});
};
