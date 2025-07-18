"use client";

import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { useGetBookById } from "../hooks/useBooks";

interface BookDetailDialogProps {
	bookId: string | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function BookDetailDialog({ bookId, open, onOpenChange }: BookDetailDialogProps) {
	const { data: bookData, isLoading, error } = useGetBookById(bookId || "", open && !!bookId);

	const book = bookData?.result;

	if (!open) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="min-w-4xl max-w-6xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Book Details</DialogTitle>
					<DialogDescription>View detailed information about this book</DialogDescription>
				</DialogHeader>

				{isLoading ? (
					<div className="space-y-4">
						<div className="flex gap-6">
							<Skeleton className="w-48 h-64" />
							<div className="flex-1 space-y-4">
								<Skeleton className="h-8 w-3/4" />
								<Skeleton className="h-4 w-1/2" />
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-2/3" />
							</div>
						</div>
					</div>
				) : error ? (
					<div className="text-center text-red-600 py-8">
						Error loading book details: {error.message}
					</div>
				) : book ? (
					<div className="space-y-6">
						{/* Header Section */}
						<div className="flex gap-6">
							{/* Book Image */}
							<div className="w-48 h-64 bg-gray-100 rounded-lg overflow-hidden relative flex-shrink-0">
								{book.image ? (
									<Image src={book.image} alt={book.title} fill className="object-cover" />
								) : (
									<div className="w-full h-full flex items-center justify-center text-gray-400">
										<div className="text-center">
											<div className="text-4xl mb-2">📚</div>
											<div className="text-sm">No Image</div>
										</div>
									</div>
								)}
							</div>

							{/* Basic Info */}
							<div className="flex-1 space-y-4">
								<div>
									<h2 className="text-2xl font-bold">{book.title}</h2>
									<p className="text-lg text-muted-foreground">by {book.author}</p>
								</div>

								<div className="flex flex-wrap gap-2">
									<Badge variant={book.isStricted ? "secondary" : "default"}>
										{book.isStricted ? "Restricted" : "Available"}
									</Badge>
									<Badge variant={book.stock > 0 ? "default" : "destructive"}>
										{book.stock} {book.stock === 1 ? "copy" : "copies"} in stock
									</Badge>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div>
										<p className="text-sm text-muted-foreground">Price</p>
										<p className="text-2xl font-bold">
											{new Intl.NumberFormat("vi-VN", {
												style: "currency",
												currency: "VND",
											}).format(book.price)}
										</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Rating</p>
										<p className="text-xl">
											⭐ {book.rating.toFixed(1)} ({book.ratingCount} reviews)
										</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Release Year</p>
										<p className="text-lg font-medium">{book.releaseYear}</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">ISBN</p>
										<p className="text-lg font-mono">{book.isbn}</p>
									</div>
								</div>
							</div>
						</div>

						<Separator />

						{/* Description */}
						<Card>
							<CardHeader>
								<CardTitle>Description</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground leading-relaxed">
									{book.description || "No description available."}
								</p>
							</CardContent>
						</Card>

						{/* Additional Details */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<Card>
								<CardHeader>
									<CardTitle>Publishing Information</CardTitle>
								</CardHeader>
								<CardContent className="space-y-2">
									<div className="flex justify-between">
										<span className="text-muted-foreground">Publisher ID:</span>
										<span className="font-mono">{book.publisherId}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Categories:</span>
										<span className="font-mono">
											{book.categoryIds.length > 0 ? book.categoryIds.join(", ") : "No categories"}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Release Year:</span>
										<span>{book.releaseYear}</span>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>System Information</CardTitle>
								</CardHeader>
								<CardContent className="space-y-2">
									<div className="flex justify-between">
										<span className="text-muted-foreground">Book ID:</span>
										<span className="font-mono">{book.id}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Created:</span>
										<span>{new Date(book.createdAt).toLocaleDateString()}</span>
									</div>
									{book.updatedAt && (
										<div className="flex justify-between">
											<span className="text-muted-foreground">Updated:</span>
											<span>{new Date(book.updatedAt).toLocaleDateString()}</span>
										</div>
									)}
								</CardContent>
							</Card>
						</div>
					</div>
				) : (
					<div className="text-center py-8">Book not found.</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
