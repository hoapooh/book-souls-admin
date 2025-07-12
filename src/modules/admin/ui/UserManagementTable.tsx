"use client";

import { useState } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Search, Eye } from "lucide-react";
import { IUser } from "@/interfaces/user";
import { useGetAllUsers, useDeleteUser } from "../hooks/useUsers";
import { AccountRole } from "@/interfaces/authentication";

interface UserManagementTableProps {
	onViewUser?: (user: IUser) => void;
}

export function UserManagementTable({ onViewUser }: UserManagementTableProps) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [globalFilter, setGlobalFilter] = useState("");
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});
	const [userToDelete, setUserToDelete] = useState<IUser | null>(null);

	// Query to get users
	const {
		data: usersData,
		isLoading,
		error,
	} = useGetAllUsers({
		pageIndex: pagination.pageIndex + 1, // API expects 1-based indexing
		limit: pagination.pageSize,
	});

	// Delete mutation
	const deleteUserMutation = useDeleteUser();

	const columns: ColumnDef<IUser>[] = [
		{
			id: "avatar",
			header: "",
			cell: ({ row }) => {
				const user = row.original;
				return (
					<Avatar className="h-10 w-10 object-cover">
						<AvatarImage src={user.avatar} alt={user.fullName} className="object-cover" />
						<AvatarFallback>
							{user.fullName
								.split(" ")
								.map((n) => n[0])
								.join("")
								.toUpperCase()}
						</AvatarFallback>
					</Avatar>
				);
			},
		},
		{
			accessorKey: "fullName",
			header: "Full Name",
			cell: ({ row }) => {
				const user = row.original;
				return (
					<div>
						<div className="font-medium">{user.fullName}</div>
						<div className="text-sm text-muted-foreground">{user.email}</div>
					</div>
				);
			},
		},
		{
			accessorKey: "phoneNumber",
			header: "Phone Number",
		},
		{
			accessorKey: "role",
			header: "Role",
			cell: ({ row }) => {
				const role = row.getValue("role") as AccountRole;
				return (
					<Badge
						variant={
							role === AccountRole.ADMIN
								? "destructive"
								: role === AccountRole.STAFF
								? "default"
								: "secondary"
						}
					>
						{role}
					</Badge>
				);
			},
		},
		{
			accessorKey: "gender",
			header: "Gender",
			cell: ({ row }) => {
				const gender = row.getValue("gender") as string;
				return <span className="capitalize">{gender || "Not specified"}</span>;
			},
		},
		{
			accessorKey: "address",
			header: "Location",
			cell: ({ row }) => {
				const address = row.getValue("address") as IUser["address"];
				return (
					<div className="text-sm">
						{address ? (
							<>
								<div>{address.city}</div>
								<div className="text-muted-foreground">{address.country}</div>
							</>
						) : (
							<div className="text-muted-foreground">No address</div>
						)}
					</div>
				);
			},
		},
		{
			accessorKey: "createdAt",
			header: "Created At",
			cell: ({ row }) => {
				const date = new Date(row.getValue("createdAt"));
				return date.toLocaleDateString("en-US", {
					year: "numeric",
					month: "2-digit",
					day: "2-digit",
				});
			},
		},
		{
			id: "actions",
			header: "Actions",
			cell: ({ row }) => {
				const user = row.original;
				return (
					<div className="flex items-center gap-2">
						<Button variant="ghost" size="sm" onClick={() => onViewUser?.(user)}>
							<Eye className="h-4 w-4" />
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setUserToDelete(user)}
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
		data: usersData?.items || [],
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onGlobalFilterChange: setGlobalFilter,
		onPaginationChange: setPagination,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		rowCount: usersData?.totalCount || 0,
		manualPagination: true,
		state: {
			sorting,
			columnFilters,
			globalFilter,
			pagination,
		},
	});

	const handleDeleteUser = async () => {
		if (userToDelete) {
			await deleteUserMutation.mutateAsync(userToDelete.id);
			setUserToDelete(null);
		}
	};

	if (error) {
		return (
			<Card>
				<CardContent className="p-6">
					<div className="text-center text-red-600">Error loading users: {error.message}</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="space-y-4">
			<Card>
				<CardHeader>
					<CardTitle>User Management</CardTitle>
					<CardDescription>
						Manage all users in the system. Total users: {usersData?.totalCount || 0}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{/* Search */}
					<div className="flex items-center space-x-2 mb-4">
						<div className="relative flex-1 max-w-sm">
							<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search users..."
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
											Loading users...
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
											No users found.
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
								usersData?.totalCount || 0
							)}{" "}
							of {usersData?.totalCount || 0} users
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
			<AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete the user "{userToDelete?.fullName}". This action cannot
							be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleDeleteUser} disabled={deleteUserMutation.isPending}>
							{deleteUserMutation.isPending ? "Deleting..." : "Delete"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
