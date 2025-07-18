import { apiClient } from "@/configs/api.config";
import { BookCreateRequest, IBookDetailResponseType, IBookResponseType } from "@/interfaces/book";

export const staffBookService = {
	// Get all books with pagination and filters
	getBooks: async (params?: {
		pageIndex?: number;
		limit?: number;
		title?: string;
		categoryIds?: string;
		publisherId?: string;
	}): Promise<IBookResponseType> => {
		const searchParams = new URLSearchParams();

		if (params?.pageIndex) searchParams.append("pageIndex", params.pageIndex.toString());
		if (params?.limit) searchParams.append("limit", params.limit.toString());
		if (params?.title) searchParams.append("title", params.title);
		if (params?.categoryIds) searchParams.append("categoryIds", params.categoryIds);
		if (params?.publisherId) searchParams.append("publisherId", params.publisherId);

		const response = await apiClient.get(`/books?${searchParams.toString()}`);
		return response.data;
	},

	// Get single book by ID
	getBookById: async (id: string): Promise<IBookDetailResponseType> => {
		const response = await apiClient.get(`/books/${id}`);
		return response.data;
	},

	// Create new book (staff only)
	createBook: async (bookData: BookCreateRequest): Promise<void> => {
		const searchParams = new URLSearchParams();

		// Add metadata parameters as query parameters
		searchParams.append("title", bookData.metadata.title);
		searchParams.append("author", bookData.metadata.author);
		searchParams.append("publisherId", bookData.metadata.publisherId);

		// Add multiple CategoryIds parameters
		bookData.metadata.categoryIds.forEach((categoryId) => {
			searchParams.append("categoryIds", categoryId);
		});

		searchParams.append("releaseYear", bookData.metadata.releaseYear.toString());
		searchParams.append("isStricted", bookData.metadata.isStricted.toString());
		searchParams.append("price", bookData.metadata.price.toString());
		searchParams.append("stock", bookData.metadata.stock.toString());
		searchParams.append("description", bookData.metadata.description);

		const formData = new FormData();
		// Add only image file to formData
		if (bookData.body.image) {
			formData.append("image", bookData.body.image);
		}

		const response = await apiClient.post(`/books?${searchParams.toString()}`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data;
	},

	// Update book (staff only)
	updateBook: async (id: string, bookData: BookCreateRequest): Promise<void> => {
		const searchParams = new URLSearchParams();

		// Add metadata parameters as query parameters
		searchParams.append("title", bookData.metadata.title);
		searchParams.append("author", bookData.metadata.author);
		searchParams.append("publisherId", bookData.metadata.publisherId);

		// Add multiple CategoryIds parameters
		bookData.metadata.categoryIds.forEach((categoryId) => {
			searchParams.append("categoryIds", categoryId);
		});

		searchParams.append("releaseYear", bookData.metadata.releaseYear.toString());
		searchParams.append("isStricted", bookData.metadata.isStricted.toString());
		searchParams.append("price", bookData.metadata.price.toString());
		searchParams.append("stock", bookData.metadata.stock.toString());
		searchParams.append("description", bookData.metadata.description);

		const formData = new FormData();
		// Add only image file to formData
		if (bookData.body.image) {
			formData.append("image", bookData.body.image);
		}

		const response = await apiClient.put(`/books/${id}?${searchParams.toString()}`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data;
	},

	// Delete book (staff only)
	deleteBook: async (id: string): Promise<void> => {
		const response = await apiClient.delete(`/books/${id}`);
		return response.data;
	},
};
