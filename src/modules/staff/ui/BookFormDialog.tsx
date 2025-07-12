"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X } from "lucide-react";
import { IBook, BookCreateRequest } from "@/interfaces/book";
import { useCreateBook, useUpdateBook } from "../hooks/useBooks";

const bookFormSchema = z.object({
	title: z.string().min(1, "Title is required"),
	author: z.string().min(1, "Author is required"),
	publisherId: z.string().min(1, "Publisher ID is required"),
	categoryIds: z.string().min(1, "Category IDs are required"),
	releaseYear: z
		.number()
		.min(1000)
		.max(new Date().getFullYear() + 10),
	isStricted: z.boolean(),
	price: z.number().min(0, "Price must be positive"),
	stock: z.number().min(0, "Stock must be positive"),
	description: z.string().min(1, "Description is required"),
});

type BookFormValues = z.infer<typeof bookFormSchema>;

interface BookFormDialogProps {
	book?: IBook | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	mode: "create" | "edit";
}

export function BookFormDialog({ book, open, onOpenChange, mode }: BookFormDialogProps) {
	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string>("");

	const createBookMutation = useCreateBook();
	const updateBookMutation = useUpdateBook();

	const form = useForm<BookFormValues>({
		resolver: zodResolver(bookFormSchema),
		defaultValues: {
			title: "",
			author: "",
			publisherId: "",
			categoryIds: "",
			releaseYear: new Date().getFullYear(),
			isStricted: false,
			price: 0,
			stock: 0,
			description: "",
		},
	});

	// Reset form when dialog opens/closes or book changes
	useEffect(() => {
		if (open && book && mode === "edit") {
			form.reset({
				title: book.title,
				author: book.author,
				publisherId: book.publisherId,
				categoryIds: book.categoryIds.join(","),
				releaseYear: book.releaseYear,
				isStricted: book.isStricted,
				price: book.price,
				stock: book.stock,
				description: book.description,
			});
			setPreviewUrl(book.image || "");
			setSelectedImage(null);
		} else if (open && mode === "create") {
			form.reset({
				title: "",
				author: "",
				publisherId: "",
				categoryIds: "",
				releaseYear: new Date().getFullYear(),
				isStricted: false,
				price: 0,
				stock: 0,
				description: "",
			});
			setPreviewUrl("");
			setSelectedImage(null);
		}
	}, [open, book, mode, form]);

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setSelectedImage(file);
			const url = URL.createObjectURL(file);
			setPreviewUrl(url);
		}
	};

	const removeImage = () => {
		setSelectedImage(null);
		setPreviewUrl("");
		// Clear the file input
		const fileInput = document.getElementById("image-upload") as HTMLInputElement;
		if (fileInput) {
			fileInput.value = "";
		}
	};

	const onSubmit = async (data: BookFormValues) => {
		try {
			const bookData: BookCreateRequest = {
				metadata: {
					title: data.title,
					author: data.author,
					publisherId: data.publisherId,
					categoryIds: data.categoryIds
						.split(",")
						.map((id) => id.trim())
						.filter((id) => id.length > 0),
					releaseYear: data.releaseYear,
					isStricted: data.isStricted,
					price: data.price,
					stock: data.stock,
					description: data.description,
				},
				body: {
					image: selectedImage,
				},
			};

			if (mode === "create") {
				await createBookMutation.mutateAsync(bookData);
			} else if (mode === "edit" && book) {
				await updateBookMutation.mutateAsync({ id: book.id, bookData });
			}

			onOpenChange(false);
		} catch (error) {
			console.error("Error submitting book:", error);
		}
	};

	const isLoading = createBookMutation.isPending || updateBookMutation.isPending;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="min-w-4xl max-w-6xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>{mode === "create" ? "Create New Book" : "Edit Book"}</DialogTitle>
					<DialogDescription>
						{mode === "create"
							? "Add a new book to the system. Fill in all required information."
							: "Update the book information. Modify any fields as needed."}
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						{/* Image Upload Section */}
						<Card>
							<CardContent className="p-4">
								<div className="space-y-4">
									<FormLabel>Book Image</FormLabel>
									<div className="flex gap-4">
										{previewUrl ? (
											<div className="relative w-32 h-40 bg-gray-100 rounded-lg overflow-hidden">
												<img
													src={previewUrl}
													alt="Book preview"
													className="w-full h-full object-cover"
												/>
												<button
													type="button"
													onClick={removeImage}
													className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
												>
													<X className="h-3 w-3" />
												</button>
											</div>
										) : (
											<div className="w-32 h-40 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
												<div className="text-center text-gray-400">
													<Upload className="h-8 w-8 mx-auto mb-2" />
													<p className="text-xs">No image</p>
												</div>
											</div>
										)}
										<div className="flex-1">
											<Input
												id="image-upload"
												type="file"
												accept="image/*"
												onChange={handleImageChange}
												className="mb-2"
											/>
											<p className="text-sm text-muted-foreground">
												Upload a book cover image. Supported formats: JPG, PNG, GIF
											</p>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Basic Information */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Title *</FormLabel>
										<FormControl>
											<Input placeholder="Enter book title" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="author"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Author *</FormLabel>
										<FormControl>
											<Input placeholder="Enter author name" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="publisherId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Publisher ID *</FormLabel>
										<FormControl>
											<Input placeholder="Enter publisher ID" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="categoryIds"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Category IDs *</FormLabel>
										<FormControl>
											<Input placeholder="Enter category IDs (comma-separated)" {...field} />
										</FormControl>
										<FormDescription>
											Enter category IDs separated by commas (e.g., cat1,cat2,cat3)
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="releaseYear"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Release Year *</FormLabel>
										<FormControl>
											<Input
												type="number"
												placeholder="Enter release year"
												{...field}
												onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="price"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Price *</FormLabel>
										<FormControl>
											<Input
												type="number"
												step="0.01"
												placeholder="Enter price"
												{...field}
												onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="stock"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Stock *</FormLabel>
										<FormControl>
											<Input
												type="number"
												placeholder="Enter stock quantity"
												{...field}
												onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="isStricted"
								render={({ field }) => (
									<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
										<div className="space-y-0.5">
											<FormLabel>Restricted Access</FormLabel>
											<FormDescription>
												Mark this book as restricted if it has age or content restrictions
											</FormDescription>
										</div>
										<FormControl>
											<Switch checked={field.value} onCheckedChange={field.onChange} />
										</FormControl>
									</FormItem>
								)}
							/>
						</div>

						{/* Description */}
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description *</FormLabel>
									<FormControl>
										<Textarea placeholder="Enter book description" rows={4} {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => onOpenChange(false)}
								disabled={isLoading}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isLoading}>
								{isLoading
									? mode === "create"
										? "Creating..."
										: "Updating..."
									: mode === "create"
									? "Create Book"
									: "Update Book"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
