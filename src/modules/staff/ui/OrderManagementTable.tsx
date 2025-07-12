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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Search, Eye, Package, DollarSign, Edit } from "lucide-react";
import { IOrder, IOrderParams, OrderStatus, PaymentStatus } from "@/interfaces/order";
import { useGetOrders } from "../hooks/useOrders";

interface OrderManagementTableProps {
	onViewOrder?: (order: IOrder) => void;
	onChangeStatus?: (order: IOrder) => void;
}

export function OrderManagementTable({ onViewOrder, onChangeStatus }: OrderManagementTableProps) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});

	// Filter states
	const [customerIdFilter, setCustomerIdFilter] = useState("");
	const [orderStatusFilter, setOrderStatusFilter] = useState<string>("");
	const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("");

	// Build query parameters
	const queryParams: IOrderParams = {
		pageIndex: pagination.pageIndex + 1, // API expects 1-based indexing
		limit: pagination.pageSize,
		...(customerIdFilter && { customerId: customerIdFilter }),
		...(orderStatusFilter && { orderStatus: orderStatusFilter as OrderStatus }),
		...(paymentStatusFilter && { paymentStatus: paymentStatusFilter as PaymentStatus }),
	};

	// Query to get orders
	const { data: ordersData, isLoading, error } = useGetOrders(queryParams);

	const columns: ColumnDef<IOrder>[] = [
		{
			accessorKey: "code",
			header: "Order Code",
			cell: ({ row }) => {
				const order = row.original;
				return (
					<div className="font-mono text-sm">
						<div className="font-medium">{order.code}</div>
						<div className="text-xs text-muted-foreground">{order.id}</div>
					</div>
				);
			},
		},
		{
			accessorKey: "customerId",
			header: "Customer ID",
			cell: ({ row }) => {
				const customerId = row.getValue("customerId") as string;
				return <div className="font-mono text-sm">{customerId}</div>;
			},
		},
		{
			accessorKey: "totalPrice",
			header: "Total Price",
			cell: ({ row }) => {
				const totalPrice = row.getValue("totalPrice") as number;
				return (
					<div className="flex items-center gap-1">
						<span className="font-medium">
							{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
								totalPrice
							)}
						</span>
					</div>
				);
			},
		},
		{
			accessorKey: "orderStatus",
			header: "Order Status",
			cell: ({ row }) => {
				const status = row.getValue("orderStatus") as OrderStatus;
				return (
					<Badge
						variant={
							status === OrderStatus.ACCEPTED
								? "default"
								: status === OrderStatus.PENDING
								? "secondary"
								: status === OrderStatus.SHIPPING
								? "outline"
								: "destructive"
						}
						className={
							status === OrderStatus.ACCEPTED
								? "bg-green-100 text-green-800 hover:bg-green-100"
								: status === OrderStatus.SHIPPING
								? "bg-blue-100 text-blue-800 hover:bg-blue-100"
								: ""
						}
					>
						{status}
					</Badge>
				);
			},
		},
		{
			accessorKey: "paymentStatus",
			header: "Payment Status",
			cell: ({ row }) => {
				const status = row.getValue("paymentStatus") as PaymentStatus;
				return (
					<Badge
						variant={
							status === PaymentStatus.PAID
								? "default"
								: status === PaymentStatus.REFUND
								? "destructive"
								: "secondary"
						}
						className={
							status === PaymentStatus.PAID
								? "bg-green-100 text-green-800 hover:bg-green-100"
								: status === PaymentStatus.REFUND
								? "bg-red-100 text-red-800 hover:bg-red-100"
								: ""
						}
					>
						{status}
					</Badge>
				);
			},
		},
		{
			accessorKey: "orderBooks",
			header: "Items",
			cell: ({ row }) => {
				const orderBooks = row.getValue("orderBooks") as IOrder["orderBooks"];
				const totalItems = orderBooks.reduce((sum, book) => sum + book.quantity, 0);
				return (
					<div className="flex items-center gap-1">
						<Package className="h-4 w-4 text-blue-600" />
						<span>{totalItems} items</span>
						<span className="text-muted-foreground">({orderBooks.length} books)</span>
					</div>
				);
			},
		},
		{
			accessorKey: "createdAt",
			header: "Created At",
			cell: ({ row }) => {
				const date = new Date(row.getValue("createdAt"));
				return (
					<div className="text-sm">
						<div>{date.toLocaleDateString("en-US")}</div>
						<div className="text-muted-foreground">
							{date.toLocaleTimeString("en-US", {
								hour: "2-digit",
								minute: "2-digit",
							})}
						</div>
					</div>
				);
			},
		},
		{
			id: "actions",
			header: "Actions",
			cell: ({ row }) => {
				const order = row.original;
				const canChangeStatus =
					order.orderStatus !== OrderStatus.CANCEL && order.orderStatus !== OrderStatus.SHIPPING;

				return (
					<div className="flex items-center gap-2">
						<Button variant="ghost" size="sm" onClick={() => onViewOrder?.(order)}>
							<Eye className="h-4 w-4" />
						</Button>
						{canChangeStatus && (
							<Button
								variant="ghost"
								size="sm"
								onClick={() => onChangeStatus?.(order)}
								className="text-blue-600 hover:text-blue-700"
							>
								<Edit className="h-4 w-4" />
							</Button>
						)}
					</div>
				);
			},
		},
	];

	const table = useReactTable({
		data: ordersData?.result?.items || [],
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onPaginationChange: setPagination,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		rowCount: ordersData?.result?.totalCount || 0,
		manualPagination: true,
		state: {
			sorting,
			columnFilters,
			pagination,
		},
	});

	const clearFilters = () => {
		setCustomerIdFilter("");
		setOrderStatusFilter("");
		setPaymentStatusFilter("");
	};

	if (error) {
		return (
			<Card>
				<CardContent className="p-6">
					<div className="text-center text-red-600">Error loading orders: {error.message}</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="space-y-4">
			<Card>
				<CardHeader>
					<CardTitle>Order Management</CardTitle>
					<CardDescription>
						Manage all customer orders and track order processing. Total orders:{" "}
						{ordersData?.result?.totalCount || 0}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{/* Filters */}
					<div className="flex flex-col sm:flex-row gap-4 mb-6">
						<div className="relative flex-1 max-w-sm">
							<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search by Customer ID..."
								value={customerIdFilter}
								onChange={(event) => setCustomerIdFilter(event.target.value)}
								className="pl-8"
							/>
						</div>

						<Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Order Status" />
							</SelectTrigger>
							<SelectContent>
								{Object.values(OrderStatus).map((status) => (
									<SelectItem key={status} value={status}>
										{status}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Payment Status" />
							</SelectTrigger>
							<SelectContent>
								{Object.values(PaymentStatus).map((status) => (
									<SelectItem key={status} value={status}>
										{status}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Button variant="outline" onClick={clearFilters}>
							Clear Filters
						</Button>
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
											Loading orders...
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
											No orders found.
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
								ordersData?.result?.totalCount || 0
							)}{" "}
							of {ordersData?.result?.totalCount || 0} orders
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
		</div>
	);
}
