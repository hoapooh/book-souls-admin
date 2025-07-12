"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Package, DollarSign, User, Calendar, CreditCard } from "lucide-react";
import { IOrder } from "@/interfaces/order";

interface OrderDetailModalProps {
	order: IOrder | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function OrderDetailModal({ order, open, onOpenChange }: OrderDetailModalProps) {
	if (!order) return null;

	const getOrderStatusVariant = (status: string) => {
		switch (status) {
			case "Accepted":
				return "default";
			case "Pending":
				return "secondary";
			case "Shipping":
				return "outline";
			case "Cancel":
				return "destructive";
			default:
				return "secondary";
		}
	};

	const getPaymentStatusVariant = (status: string) => {
		switch (status) {
			case "Paid":
				return "default";
			case "Refund":
				return "destructive";
			case "None":
				return "secondary";
			default:
				return "secondary";
		}
	};

	const totalItems = order.orderBooks.reduce((sum, book) => sum + book.quantity, 0);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="min-w-4xl max-w-6xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Order Details</DialogTitle>
					<DialogDescription>Detailed information about order {order.code}</DialogDescription>
				</DialogHeader>

				<div className="space-y-6">
					{/* Order Summary */}
					<Card>
						<CardHeader>
							<CardTitle className="flex flex-col gap-y-2 justify-between w-full">
								<div className="flex items-center gap-2">
									<Package className="h-5 w-5" />
									Order Summary
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Order ID</p>
									<p className="font-mono text-sm">{order.id}</p>
								</div>
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
								<div>
									<p className="text-sm text-muted-foreground">Order Code</p>
									<p className="font-mono font-medium">{order.code}</p>
								</div>

								<div>
									<p className="text-sm text-muted-foreground">Total Price</p>
									<p className="font-medium text-lg flex items-center gap-1">
										{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
											order.totalPrice
										)}
									</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Total Items</p>
									<p className="font-medium">{totalItems} items</p>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div>
									<p className="text-sm text-muted-foreground">Order Status</p>
									<Badge
										variant={getOrderStatusVariant(order.orderStatus)}
										className={
											order.orderStatus === "Accepted"
												? "bg-green-100 text-green-800 hover:bg-green-100"
												: order.orderStatus === "Shipping"
												? "bg-blue-100 text-blue-800 hover:bg-blue-100"
												: ""
										}
									>
										{order.orderStatus}
									</Badge>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Payment Status</p>
									<Badge
										variant={getPaymentStatusVariant(order.paymentStatus)}
										className={
											order.paymentStatus === "Paid"
												? "bg-green-100 text-green-800 hover:bg-green-100"
												: order.paymentStatus === "Refund"
												? "bg-red-100 text-red-800 hover:bg-red-100"
												: ""
										}
									>
										{order.paymentStatus}
									</Badge>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Created At</p>
									<div className="flex items-center gap-1">
										<Calendar className="h-4 w-4 text-blue-600" />
										<span className="text-sm">
											{new Date(order.createdAt).toLocaleDateString("en-US", {
												year: "numeric",
												month: "short",
												day: "numeric",
												hour: "2-digit",
												minute: "2-digit",
											})}
										</span>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Customer Information */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<User className="h-5 w-5" />
								Customer Information
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div>
								<p className="text-sm text-muted-foreground">Customer ID</p>
								<p className="font-mono">{order.customerId}</p>
							</div>
						</CardContent>
					</Card>

					{/* Cancel Reason (if applicable) */}
					{order.cancelReason && (
						<Card>
							<CardHeader>
								<CardTitle className="text-red-600">Cancel Reason</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm">{order.cancelReason}</p>
							</CardContent>
						</Card>
					)}

					{/* Order Items */}
					<Card>
						<CardHeader>
							<CardTitle>Order Items</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{order.orderBooks.map((book, index) => (
									<div key={book.bookId}>
										<div className="flex items-center justify-between p-4 rounded-lg border">
											<div className="flex-1">
												<h4 className="font-medium">{book.bookTitle}</h4>
												<p className="text-sm text-muted-foreground">ID: {book.bookId}</p>
											</div>
											<div className="text-right space-y-1">
												<div className="flex items-center gap-2">
													<span className="text-sm text-muted-foreground">Qty:</span>
													<span className="font-medium">{book.quantity}</span>
												</div>
												<div className="flex items-center gap-1">
													<span className="font-medium">
														{new Intl.NumberFormat("vi-VN", {
															style: "currency",
															currency: "VND",
														}).format(book.bookPrice)}
													</span>
													<span className="text-sm text-muted-foreground">each</span>
												</div>
												<div className="flex items-center gap-1">
													<span className="text-sm text-muted-foreground">Total:</span>
													<span className="font-bold text-green-600">
														{new Intl.NumberFormat("vi-VN", {
															style: "currency",
															currency: "VND",
														}).format(book.bookPrice * book.quantity)}
													</span>
												</div>
											</div>
										</div>
										{index < order.orderBooks.length - 1 && <Separator />}
									</div>
								))}
							</div>

							{/* Order Total */}
							<Separator className="my-4" />
							<div className="flex justify-between items-center p-4 bg-muted rounded-lg">
								<span className="text-lg font-medium">Order Total:</span>
								<span className="text-2xl font-bold text-green-600 flex items-center gap-1">
									{new Intl.NumberFormat("vi-VN", {
										style: "currency",
										currency: "VND",
									}).format(order.totalPrice)}
								</span>
							</div>
						</CardContent>
					</Card>
				</div>
			</DialogContent>
		</Dialog>
	);
}
