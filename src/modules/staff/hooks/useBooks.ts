import { toast } from "sonner";

import { BookCreateRequest } from "@/interfaces/book";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { staffBookService } from "../services/book.service";

// Query keys for book-related queries
export const staffBookQueryKeys = {
	all: ["staff-books"] as const,
	lists: () => [...staffBookQueryKeys.all, "list"] as const,
	list: (params: unknown) => [...staffBookQueryKeys.lists(), params] as const,
	details: () => [...staffBookQueryKeys.all, "detail"] as const,
	detail: (id: string) => [...staffBookQueryKeys.details(), id] as const,
};

// Hook to get all books with pagination and filters
export const useGetAllBooks = (params?: {
	pageIndex?: number;
	limit?: number;
	title?: string;
	categoryIds?: string;
	publisherId?: string;
}) => {
	return useQuery({
		queryKey: staffBookQueryKeys.list(params),
		queryFn: () => staffBookService.getBooks(params),
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});
};

// Hook to get book by ID
export const useGetBookById = (id: string, enabled: boolean = true) => {
	return useQuery({
		queryKey: staffBookQueryKeys.detail(id),
		queryFn: () => staffBookService.getBookById(id),
		enabled: enabled && !!id,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});
};

// Hook to create book
export const useCreateBook = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (bookData: BookCreateRequest) => staffBookService.createBook(bookData),
		onSuccess: () => {
			// Invalidate all book list queries to refetch data
			queryClient.invalidateQueries({
				queryKey: staffBookQueryKeys.lists(),
			});
			toast.success("Book created successfully");
		},
		onError: () => {
			toast.error("Failed to create book");
		},
	});
};

// Hook to update book
export const useUpdateBook = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, bookData }: { id: string; bookData: BookCreateRequest }) =>
			staffBookService.updateBook(id, bookData),
		onSuccess: () => {
			// Invalidate all book queries to refetch data
			queryClient.invalidateQueries({
				queryKey: staffBookQueryKeys.all,
			});
			toast.success("Book updated successfully");
		},
		onError: () => {
			toast.error("Failed to update book");
		},
	});
};

// Hook to delete book
export const useDeleteBook = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => staffBookService.deleteBook(id),
		onSuccess: () => {
			// Invalidate all book list queries to refetch data
			queryClient.invalidateQueries({
				queryKey: staffBookQueryKeys.lists(),
			});
			toast.success("Book deleted successfully");
		},
		onError: () => {
			toast.error("Failed to delete book");
		},
	});
};
