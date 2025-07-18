"use client";

import { Building, Calendar, Edit, Eye, MoreVertical, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";

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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { IPublisher } from "@/interfaces/publisher";
import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	PaginationState,
	SortingState,
	useReactTable,
} from "@tanstack/react-table";

import { useDeletePublisher, useGetAllPublishers } from "../hooks/usePublishers";
import { PublisherDetailDialog } from "./PublisherDetailDialog";
import { PublisherFormDialog } from "./PublisherFormDialog";

interface PublisherManagementTableProps {
	onViewPublisher?: (publisher: IPublisher) => void;
	onEditPublisher?: (publisher: IPublisher) => void;
	onCreatePublisher?: () => void;
}

export function PublisherManagementTable({
	onViewPublisher,
	onEditPublisher,
	onCreatePublisher,
}: PublisherManagementTableProps) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [globalFilter, setGlobalFilter] = useState("");
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});
	const [publisherToDelete, setPublisherToDelete] = useState<IPublisher | null>(null);

	// Dialog states
	const [viewDialogOpen, setViewDialogOpen] = useState(false);
	const [formDialogOpen, setFormDialogOpen] = useState(false);
	const [selectedPublisher, setSelectedPublisher] = useState<IPublisher | null>(null);
	const [formMode, setFormMode] = useState<"create" | "edit">("create");

	// Query to get publishers
	const {
		data: publishersData,
		isLoading,
		error,
	} = useGetAllPublishers({
		pageIndex: pagination.pageIndex + 1, // API expects 1-based indexing
		limit: pagination.pageSize,
	});

	// Delete mutation
	const deletePublisherMutation = useDeletePublisher();

	// Handle dialog actions
	const handleViewPublisher = (publisher: IPublisher) => {
		setSelectedPublisher(publisher);
		setViewDialogOpen(true);
		onViewPublisher?.(publisher);
	};

	const handleEditPublisher = (publisher: IPublisher) => {
		setSelectedPublisher(publisher);
		setFormMode("edit");
		setFormDialogOpen(true);
		onEditPublisher?.(publisher);
	};

	const handleCreatePublisher = () => {
		setSelectedPublisher(null);
		setFormMode("create");
		setFormDialogOpen(true);
		onCreatePublisher?.();
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	const columns: ColumnDef<IPublisher>[] = [
		{
			accessorKey: "name",
			header: "Publisher Name",
			cell: ({ row }) => {
				const publisher = row.original;
				return (
					<div className="flex items-center gap-2">
						<Building className="h-4 w-4 text-muted-foreground" />
						<div>
							<div className="font-medium">{publisher.name}</div>
							<div className="text-sm text-muted-foreground truncate max-w-[200px]">
								{publisher.description}
							</div>
						</div>
					</div>
				);
			},
		},
		{
			accessorKey: "id",
			header: "ID",
			cell: ({ row }) => {
				return (
					<Badge variant="outline" className="font-mono text-xs">
						{row.getValue("id")}
					</Badge>
				);
			},
		},
		{
			accessorKey: "createdAt",
			header: "Created",
			cell: ({ row }) => {
				const createdAt = row.getValue("createdAt") as string;
				return (
					<div className="flex items-center gap-2 text-sm">
						<Calendar className="h-3 w-3 text-muted-foreground" />
						{formatDate(createdAt)}
					</div>
				);
			},
		},
		{
			accessorKey: "updatedAt",
			header: "Last Updated",
			cell: ({ row }) => {
				const updatedAt = row.getValue("updatedAt") as string;
				return (
					<div className="flex items-center gap-2 text-sm">
						<Calendar className="h-3 w-3 text-muted-foreground" />
						{formatDate(updatedAt)}
					</div>
				);
			},
		},
		{
			id: "actions",
			header: "Actions",
			cell: ({ row }) => {
				const publisher = row.original;
				return (
					<div className="flex items-center gap-2">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="sm">
									<MoreVertical className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent side="bottom" align="end">
								<DropdownMenuItem onClick={() => handleViewPublisher(publisher)}>
									<Eye className="h-4 w-4" />
									View
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => handleEditPublisher(publisher)}>
									<Edit className="h-4 w-4" />
									Edit
								</DropdownMenuItem>
								<DropdownMenuItem
									className="text-destructive"
									onClick={() => setPublisherToDelete(publisher)}
								>
									<Trash2 className="h-4 w-4 text-destructive" />
									<span className="text-sm">Delete</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				);
			},
		},
	];

	// Filter function for global search
	const globalFilterFn = (row: { original: IPublisher }, columnId: string, value: string) => {
		const publisher = row.original as IPublisher;
		const searchValue = value.toLowerCase();

		return (
			publisher.name.toLowerCase().includes(searchValue) ||
			publisher.description.toLowerCase().includes(searchValue) ||
			publisher.id.toLowerCase().includes(searchValue)
		);
	};

	const table = useReactTable({
		data: publishersData?.result?.items || [],
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onGlobalFilterChange: setGlobalFilter,
		onPaginationChange: setPagination,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		globalFilterFn,
		rowCount: publishersData?.result?.totalCount || 0,
		manualPagination: true,
		state: {
			sorting,
			columnFilters,
			globalFilter,
			pagination,
		},
	});

	const handleDeletePublisher = async () => {
		if (publisherToDelete) {
			await deletePublisherMutation.mutateAsync(publisherToDelete.id);
			setPublisherToDelete(null);
		}
	};

	if (error) {
		return (
			<Card>
				<CardContent className="p-6">
					<div className="text-center text-red-600">Error loading publishers: {error.message}</div>
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
							<CardTitle>Publisher Management</CardTitle>
							<CardDescription>
								Manage all publishers in the system. Total publishers:{" "}
								{publishersData?.result?.totalCount || 0}
							</CardDescription>
						</div>
						<Button onClick={handleCreatePublisher}>
							<Plus className="h-4 w-4 mr-2" />
							Add New Publisher
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					{/* Search */}
					<div className="flex items-center space-x-2 mb-4">
						<div className="relative flex-1 max-w-sm">
							<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search publishers..."
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
											Loading publishers...
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
											No publishers found.
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
								publishersData?.result?.totalCount || 0
							)}{" "}
							of {publishersData?.result?.totalCount || 0} publishers
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
			<AlertDialog open={!!publisherToDelete} onOpenChange={() => setPublisherToDelete(null)}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete the publisher &quot;{publisherToDelete?.name}&quot;. This
							action cannot be undone and may affect books published by this publisher.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDeletePublisher}
							className="bg-destructive hover:bg-destructive/90 text-white"
							disabled={deletePublisherMutation.isPending}
						>
							{deletePublisherMutation.isPending ? "Deleting..." : "Delete"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Publisher Detail Dialog */}
			<PublisherDetailDialog
				publisher={selectedPublisher}
				open={viewDialogOpen}
				onOpenChange={setViewDialogOpen}
			/>

			{/* Publisher Form Dialog */}
			<PublisherFormDialog
				publisher={selectedPublisher}
				open={formDialogOpen}
				onOpenChange={setFormDialogOpen}
				mode={formMode}
			/>
		</div>
	);
}
