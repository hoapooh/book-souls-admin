"use client";

import { useState } from "react";
import Image from "next/image";
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
	SortingState,
	ColumnFiltersState,
	PaginationState,
} from "@tanstack/react-table";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Search, Eye, Edit, Plus } from "lucide-react";
import { IBook } from "@/interfaces/book";
import { useGetAllBooks, useDeleteBook } from "../hooks/useBooks";
import { BookDetailDialog } from "./BookDetailDialog";
import { BookFormDialog } from "./BookFormDialog";

interface BookManagementTableProps {
	onViewBook?: (book: IBook) => void;
	onEditBook?: (book: IBook) => void;
	onCreateBook?: () => void;
}

export function BookManagementTable({
	onViewBook,
	onEditBook,
	onCreateBook,
}: BookManagementTableProps) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [globalFilter, setGlobalFilter] = useState("");
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});
	const [bookToDelete, setBookToDelete] = useState<IBook | null>(null);

	// Dialog states
	const [viewDialogOpen, setViewDialogOpen] = useState(false);
	const [formDialogOpen, setFormDialogOpen] = useState(false);
	const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
	const [selectedBook, setSelectedBook] = useState<IBook | null>(null);
	const [formMode, setFormMode] = useState<"create" | "edit">("create");

	// Query to get books
	const {
		data: booksData,
		isLoading,
		error,
	} = useGetAllBooks({
		pageIndex: pagination.pageIndex + 1, // API expects 1-based indexing
		limit: pagination.pageSize,
		title: globalFilter || undefined,
	});

	// Delete mutation
	const deleteBookMutation = useDeleteBook();

	// Handle dialog actions
	const handleViewBook = (book: IBook) => {
		setSelectedBookId(book.id);
		setViewDialogOpen(true);
		onViewBook?.(book);
	};

	const handleEditBook = (book: IBook) => {
		setSelectedBook(book);
		setFormMode("edit");
		setFormDialogOpen(true);
		onEditBook?.(book);
	};

	const handleCreateBook = () => {
		setSelectedBook(null);
		setFormMode("create");
		setFormDialogOpen(true);
		onCreateBook?.();
	};

	const columns: ColumnDef<IBook>[] = [
		{
			accessorKey: "image",
			header: "Image",
			cell: ({ row }) => {
				const book = row.original;
				return (
					<div className="w-12 h-16 bg-gray-100 rounded overflow-hidden relative">
						{book.image ? (
							<Image src={book.image} alt={book.title} fill className="object-cover" />
						) : (
							<div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
								No Image
							</div>
						)}
					</div>
				);
			},
		},
		{
			accessorKey: "title",
			header: "Title",
			cell: ({ row }) => {
				const book = row.original;
				return (
					<div>
						<div className="font-medium">{book.title}</div>
						<div className="text-sm text-muted-foreground">by {book.author}</div>
					</div>
				);
			},
		},
		{
			accessorKey: "isbn",
			header: "ISBN",
			cell: ({ row }) => {
				return <span className="font-mono text-sm">{row.getValue("isbn")}</span>;
			},
		},
		{
			accessorKey: "releaseYear",
			header: "Year",
		},
		{
			accessorKey: "price",
			header: "Price",
			cell: ({ row }) => {
				const price = row.getValue("price") as number;
				return (
					<span className="font-medium">
						{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price)}
					</span>
				);
			},
		},
		{
			accessorKey: "stock",
			header: "Stock",
			cell: ({ row }) => {
				const stock = row.getValue("stock") as number;
				return (
					<Badge variant={stock > 0 ? "default" : "destructive"}>
						{stock} {stock === 1 ? "copy" : "copies"}
					</Badge>
				);
			},
		},
		{
			accessorKey: "isStricted",
			header: "Status",
			cell: ({ row }) => {
				const isStricted = row.getValue("isStricted") as boolean;
				return (
					<Badge variant={isStricted ? "secondary" : "default"}>
						{isStricted ? "Restricted" : "Available"}
					</Badge>
				);
			},
		},
		{
			accessorKey: "rating",
			header: "Rating",
			cell: ({ row }) => {
				const rating = row.getValue("rating") as number;
				const ratingCount = row.original.ratingCount;
				return (
					<div className="text-sm">
						<div>⭐ {rating.toFixed(1)}</div>
						<div className="text-muted-foreground">({ratingCount} reviews)</div>
					</div>
				);
			},
		},
		{
			id: "actions",
			header: "Actions",
			cell: ({ row }) => {
				const book = row.original;
				return (
					<div className="flex items-center gap-2">
						<Button variant="ghost" size="sm" onClick={() => handleViewBook(book)}>
							<Eye className="h-4 w-4" />
						</Button>
						<Button variant="ghost" size="sm" onClick={() => handleEditBook(book)}>
							<Edit className="h-4 w-4" />
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setBookToDelete(book)}
							className="text-destructive hover:text-destructive"
						>
							<Trash2 className="h-4 w-4" />
						</Button>
					</div>
				);
			},
		},
	];

	const table = useReactTable({
		data: booksData?.result?.items || [],
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onGlobalFilterChange: setGlobalFilter,
		onPaginationChange: setPagination,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		rowCount: booksData?.result?.totalCount || 0,
		manualPagination: true,
		state: {
			sorting,
			columnFilters,
			globalFilter,
			pagination,
		},
	});

	const handleDeleteBook = async () => {
		if (bookToDelete) {
			await deleteBookMutation.mutateAsync(bookToDelete.id);
			setBookToDelete(null);
		}
	};

	if (error) {
		return (
			<Card>
				<CardContent className="p-6">
					<div className="text-center text-red-600">Error loading books: {error.message}</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="space-y-4">
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle>Book Management</CardTitle>
							<CardDescription>
								Manage all books in the system. Total books: {booksData?.result?.totalCount || 0}
							</CardDescription>
						</div>
						<Button onClick={handleCreateBook}>
							<Plus className="h-4 w-4 mr-2" />
							Add New Book
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					{/* Search */}
					<div className="flex items-center space-x-2 mb-4">
						<div className="relative flex-1 max-w-sm">
							<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search books..."
								value={globalFilter}
								onChange={(event) => setGlobalFilter(event.target.value)}
								className="pl-8"
							/>
						</div>
					</div>

					{/* Table */}
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								{table.getHeaderGroups().map((headerGroup) => (
									<TableRow key={headerGroup.id}>
										{headerGroup.headers.map((header) => {
											return (
												<TableHead key={header.id}>
													{header.isPlaceholder
														? null
														: flexRender(header.column.columnDef.header, header.getContext())}
												</TableHead>
											);
										})}
									</TableRow>
								))}
							</TableHeader>
							<TableBody>
								{isLoading ? (
									<TableRow>
										<TableCell colSpan={columns.length} className="h-24 text-center">
											Loading books...
										</TableCell>
									</TableRow>
								) : table.getRowModel().rows?.length ? (
									table.getRowModel().rows.map((row) => (
										<TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
											{row.getVisibleCells().map((cell) => (
												<TableCell key={cell.id}>
													{flexRender(cell.column.columnDef.cell, cell.getContext())}
												</TableCell>
											))}
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell colSpan={columns.length} className="h-24 text-center">
											No books found.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>

					{/* Pagination */}
					<div className="flex items-center justify-between space-x-2 py-4">
						<div className="text-sm text-muted-foreground">
							Showing{" "}
							{table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
							{Math.min(
								(table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
								booksData?.result?.totalCount || 0
							)}{" "}
							of {booksData?.result?.totalCount || 0} books
						</div>
						<div className="flex items-center space-x-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => table.previousPage()}
								disabled={!table.getCanPreviousPage()}
							>
								Previous
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => table.nextPage()}
								disabled={!table.getCanNextPage()}
							>
								Next
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={!!bookToDelete} onOpenChange={() => setBookToDelete(null)}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete the book &quot;{bookToDelete?.title}&quot;. This action
							cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDeleteBook}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
							disabled={deleteBookMutation.isPending}
						>
							{deleteBookMutation.isPending ? "Deleting..." : "Delete"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Book Detail Dialog */}
			<BookDetailDialog
				bookId={selectedBookId}
				open={viewDialogOpen}
				onOpenChange={setViewDialogOpen}
			/>

			{/* Book Form Dialog */}
			<BookFormDialog
				book={selectedBook}
				open={formDialogOpen}
				onOpenChange={setFormDialogOpen}
				mode={formMode}
			/>
		</div>
	);
}
