import { apiClient } from "@/configs/api.config";
import { BookCreateRequest, IBookDetailResponseType, IBookResponseType } from "@/interfaces/book";

export const bookService = {
	// Get all books with pagination and filters
	getBooks: async (params?: {
		pageIndex?: number;
		limit?: number;
		title?: string;
		categoryIds?: string;
		publisherId?: string;
	}): Promise<IBookResponseType> => {
		const searchParams = new URLSearchParams();

		if (params?.pageIndex) searchParams.append("page", params.pageIndex.toString());
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
	createBook: async (bookData: BookCreateRequest): Promise<any> => {
		const formData = new FormData();

		// Add metadata parameters individually
		formData.append("title", bookData.metadata.title);
		formData.append("author", bookData.metadata.author);
		formData.append("publisherId", bookData.metadata.publisherId);
		formData.append("categoryIds", bookData.metadata.categoryIds);
		formData.append("releaseYear", bookData.metadata.releaseYear.toString());
		formData.append("isStricted", bookData.metadata.isStricted.toString());
		formData.append("price", bookData.metadata.price.toString());
		formData.append("stock", bookData.metadata.stock.toString());
		formData.append("description", bookData.metadata.description);

		// Add image file if provided
		if (bookData.body.image) {
			formData.append("image", bookData.body.image);
		}

		const response = await apiClient.post("/books", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data;
	},

	// Update book (staff only)
	updateBook: async (id: string, bookData: BookCreateRequest): Promise<any> => {
		const formData = new FormData();

		// Add metadata parameters individually
		formData.append("title", bookData.metadata.title);
		formData.append("author", bookData.metadata.author);
		formData.append("publisherId", bookData.metadata.publisherId);
		formData.append("categoryIds", bookData.metadata.categoryIds);
		formData.append("releaseYear", bookData.metadata.releaseYear.toString());
		formData.append("isStricted", bookData.metadata.isStricted.toString());
		formData.append("price", bookData.metadata.price.toString());
		formData.append("stock", bookData.metadata.stock.toString());
		formData.append("description", bookData.metadata.description);

		// Add image file if provided (for updating image)
		if (bookData.body.image) {
			formData.append("image", bookData.body.image);
		}

		const response = await apiClient.put(`/books/${id}`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data;
	},

	// Delete book (staff only)
	deleteBook: async (id: string): Promise<any> => {
		const response = await apiClient.delete(`/books/${id}`);
		return response.data;
	},
};

export const categoryService = {
	// Get all categories
	getCategories: async (): Promise<any> => {
		const response = await apiClient.get("/categories");
		return response.data;
	},

	// Create category (staff only)
	createCategory: async (categoryData: any): Promise<any> => {
		const response = await apiClient.post("/categories", categoryData);
		return response.data;
	},

	// Update category (staff only)
	updateCategory: async (id: string, categoryData: any): Promise<any> => {
		const response = await apiClient.put(`/categories/${id}`, categoryData);
		return response.data;
	},

	// Delete category (staff only)
	deleteCategory: async (id: string): Promise<any> => {
		const response = await apiClient.delete(`/categories/${id}`);
		return response.data;
	},
};

export const publisherService = {
	// Get all publishers
	getPublishers: async (): Promise<any> => {
		const response = await apiClient.get("/publishers");
		return response.data;
	},

	// Create publisher (staff only)
	createPublisher: async (publisherData: any): Promise<any> => {
		const response = await apiClient.post("/publishers", publisherData);
		return response.data;
	},

	// Update publisher (staff only)
	updatePublisher: async (id: string, publisherData: any): Promise<any> => {
		const response = await apiClient.put(`/publishers/${id}`, publisherData);
		return response.data;
	},

	// Delete publisher (staff only)
	deletePublisher: async (id: string): Promise<any> => {
		const response = await apiClient.delete(`/publishers/${id}`);
		return response.data;
	},
};
