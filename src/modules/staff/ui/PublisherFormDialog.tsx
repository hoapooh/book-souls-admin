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
import { IPublisher, IPublisherCreateBody } from "@/interfaces/publisher";
import { zodResolver } from "@hookform/resolvers/zod";

import { useCreatePublisher, useUpdatePublisher } from "../hooks/usePublishers";

const publisherFormSchema = z.object({
	name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters"),
	description: z
		.string()
		.min(1, "Description is required")
		.min(10, "Description must be at least 10 characters"),
});

type PublisherFormValues = z.infer<typeof publisherFormSchema>;

interface PublisherFormDialogProps {
	publisher?: IPublisher | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	mode: "create" | "edit";
}

export function PublisherFormDialog({
	publisher,
	open,
	onOpenChange,
	mode,
}: PublisherFormDialogProps) {
	const createPublisherMutation = useCreatePublisher();
	const updatePublisherMutation = useUpdatePublisher();

	const form = useForm<PublisherFormValues>({
		resolver: zodResolver(publisherFormSchema),
		defaultValues: {
			name: "",
			description: "",
		},
	});

	// Reset form when dialog opens/closes or publisher changes
	useEffect(() => {
		if (open && publisher && mode === "edit") {
			form.reset({
				name: publisher.name,
				description: publisher.description,
			});
		} else if (open && mode === "create") {
			form.reset({
				name: "",
				description: "",
			});
		}
	}, [open, publisher, mode, form]);

	const onSubmit = async (data: PublisherFormValues) => {
		try {
			const publisherData: IPublisherCreateBody = {
				name: data.name,
				description: data.description,
			};

			if (mode === "create") {
				await createPublisherMutation.mutateAsync(publisherData);
			} else if (mode === "edit" && publisher) {
				await updatePublisherMutation.mutateAsync({
					id: publisher.id,
					publisherData,
				});
			}

			onOpenChange(false);
		} catch (error) {
			console.error("Failed to save publisher:", error);
		}
	};

	const isLoading = createPublisherMutation.isPending || updatePublisherMutation.isPending;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>{mode === "create" ? "Create New Publisher" : "Edit Publisher"}</DialogTitle>
					<DialogDescription>
						{mode === "create"
							? "Add a new publisher to organize your books."
							: "Update the publisher information."}
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
										<FormLabel>Publisher Name</FormLabel>
										<FormControl>
											<Input
												placeholder="Enter publisher name (e.g., Penguin Books, Harper Collins)"
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
												placeholder="Describe this publisher and what types of books they publish..."
												className="min-h-[100px]"
												{...field}
											/>
										</FormControl>
										<FormDescription>
											Provide a clear description of what this publisher represents.
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
									? "Create Publisher"
									: "Update Publisher"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
