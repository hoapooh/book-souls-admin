"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
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
import { ICategory, ICategoryCreateBody } from "@/interfaces/category";
import { zodResolver } from "@hookform/resolvers/zod";

import { useCreateCategory, useUpdateCategory } from "../hooks/useCategories";

const categoryFormSchema = z.object({
	name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters"),
	description: z
		.string()
		.min(1, "Description is required")
		.min(10, "Description must be at least 10 characters"),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

interface CategoryFormDialogProps {
	category?: ICategory | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	mode: "create" | "edit";
}

export function CategoryFormDialog({
	category,
	open,
	onOpenChange,
	mode,
}: CategoryFormDialogProps) {
	const createCategoryMutation = useCreateCategory();
	const updateCategoryMutation = useUpdateCategory();

	const form = useForm<CategoryFormValues>({
		resolver: zodResolver(categoryFormSchema),
		defaultValues: {
			name: "",
			description: "",
		},
	});

	// Reset form when dialog opens/closes or category changes
	useEffect(() => {
		if (open && category && mode === "edit") {
			form.reset({
				name: category.name,
				description: category.description,
			});
		} else if (open && mode === "create") {
			form.reset({
				name: "",
				description: "",
			});
		}
	}, [open, category, mode, form]);

	const onSubmit = async (data: CategoryFormValues) => {
		try {
			const categoryData: ICategoryCreateBody = {
				name: data.name,
				description: data.description,
			};

			if (mode === "create") {
				await createCategoryMutation.mutateAsync(categoryData);
			} else if (mode === "edit" && category) {
				await updateCategoryMutation.mutateAsync({
					id: category.id,
					categoryData,
				});
			}

			onOpenChange(false);
		} catch (error) {
			console.error("Failed to save category:", error);
		}
	};

	const isLoading = createCategoryMutation.isPending || updateCategoryMutation.isPending;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>{mode === "create" ? "Create New Category" : "Edit Category"}</DialogTitle>
					<DialogDescription>
						{mode === "create"
							? "Add a new category to organize your books."
							: "Update the category information."}
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<div className="space-y-4">
							{/* Name Field */}
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Category Name</FormLabel>
										<FormControl>
											<Input
												placeholder="Enter category name (e.g., Fiction, Science, Biography)"
												{...field}
											/>
										</FormControl>
										<FormDescription>The name should be descriptive and unique.</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Description Field */}
							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Description</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Describe this category and what types of books it contains..."
												className="min-h-[100px]"
												{...field}
											/>
										</FormControl>
										<FormDescription>
											Provide a clear description of what this category represents.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

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
									? "Create Category"
									: "Update Category"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
