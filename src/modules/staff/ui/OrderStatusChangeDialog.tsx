"use client";

import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Truck, XCircle } from "lucide-react";
import { IOrder, OrderStatus } from "@/interfaces/order";
import { useChangeOrderStatus, useCancelOrder } from "../hooks/useOrders";

interface OrderStatusChangeDialogProps {
	order: IOrder | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function OrderStatusChangeDialog({
	order,
	open,
	onOpenChange,
}: OrderStatusChangeDialogProps) {
	const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "">("");
	const [cancelReason, setCancelReason] = useState("");
	const [showCancelConfirm, setShowCancelConfirm] = useState(false);

	const changeStatusMutation = useChangeOrderStatus();
	const cancelOrderMutation = useCancelOrder();

	if (!order) return null;

	// Define status transitions and validations
	const getValidNextStatuses = (currentStatus: OrderStatus): OrderStatus[] => {
		switch (currentStatus) {
			case OrderStatus.PENDING:
				return [OrderStatus.ACCEPTED]; // Cancel is handled separately
			case OrderStatus.ACCEPTED:
				return [OrderStatus.SHIPPING]; // Cancel is handled separately
			case OrderStatus.SHIPPING:
				return []; // Once shipping, can't change status
			case OrderStatus.CANCEL:
				return []; // Once cancelled, can't change status
			default:
				return [];
		}
	};

	const isStatusChangeable = (currentStatus: OrderStatus): boolean => {
		return currentStatus !== OrderStatus.CANCEL && currentStatus !== OrderStatus.SHIPPING;
	};

	const getStatusIcon = (status: OrderStatus) => {
		switch (status) {
			case OrderStatus.ACCEPTED:
				return <CheckCircle className="h-4 w-4 text-green-600" />;
			case OrderStatus.SHIPPING:
				return <Truck className="h-4 w-4 text-blue-600" />;
			case OrderStatus.CANCEL:
				return <XCircle className="h-4 w-4 text-red-600" />;
			default:
				return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
		}
	};

	const getStatusVariant = (status: OrderStatus) => {
		switch (status) {
			case OrderStatus.ACCEPTED:
				return "default";
			case OrderStatus.PENDING:
				return "secondary";
			case OrderStatus.SHIPPING:
				return "outline";
			case OrderStatus.CANCEL:
				return "destructive";
			default:
				return "secondary";
		}
	};

	const validNextStatuses = getValidNextStatuses(order.orderStatus);
	const canChangeStatus = isStatusChangeable(order.orderStatus);

	const handleStatusChange = async () => {
		if (!selectedStatus) return;

		// Proceed with status change
		await changeStatusMutation.mutateAsync({
			orderId: order.id,
			status: selectedStatus,
		});

		handleClose();
	};

	const handleCancelConfirm = async () => {
		if (!cancelReason.trim()) {
			return;
		}

		await cancelOrderMutation.mutateAsync({
			orderId: order.id,
			cancelReason: cancelReason.trim(),
		});

		setShowCancelConfirm(false);
		handleClose();
	};

	const handleClose = () => {
		setSelectedStatus("");
		setCancelReason("");
		setShowCancelConfirm(false);
		onOpenChange(false);
	};

	return (
		<>
			<Dialog open={open} onOpenChange={handleClose}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Change Order Status</DialogTitle>
						<DialogDescription>Update the status of order {order.code}</DialogDescription>
					</DialogHeader>

					<div className="space-y-4">
						{/* Current Status */}
						<div>
							<Label className="text-sm font-medium">Current Status</Label>
							<div className="mt-1">
								<Badge
									variant={getStatusVariant(order.orderStatus)}
									className={`flex items-center gap-2 w-fit ${
										order.orderStatus === "Accepted"
											? "bg-green-100 text-green-800 hover:bg-green-100"
											: order.orderStatus === "Shipping"
											? "bg-blue-100 text-blue-800 hover:bg-blue-100"
											: ""
									}`}
								>
									{getStatusIcon(order.orderStatus)}
									{order.orderStatus}
								</Badge>
							</div>
						</div>

						{/* Status Change Section */}
						{canChangeStatus ? (
							<div>
								<Label htmlFor="status" className="text-sm font-medium">
									New Status
								</Label>
								<Select
									value={selectedStatus}
									onValueChange={(value) => setSelectedStatus(value as OrderStatus)}
								>
									<SelectTrigger className="mt-1">
										<SelectValue placeholder="Select new status" />
									</SelectTrigger>
									<SelectContent>
										{validNextStatuses.map((status) => (
											<SelectItem key={status} value={status}>
												<div className="flex items-center gap-2">
													{getStatusIcon(status)}
													{status}
												</div>
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						) : (
							<div className="p-4 bg-muted rounded-lg">
								<div className="flex items-center gap-2 text-sm text-muted-foreground">
									<AlertTriangle className="h-4 w-4" />
									{order.orderStatus === OrderStatus.CANCEL
										? "This order has been cancelled and cannot be changed."
										: "This order is being shipped and cannot be changed."}
								</div>
							</div>
						)}

						{/* Cancel Reason (if applicable) */}
						{order.cancelReason && (
							<div>
								<Label className="text-sm font-medium text-red-600">Cancel Reason</Label>
								<div className="mt-1 p-3 bg-red-50 border border-red-200 rounded-md">
									<p className="text-sm text-red-800">{order.cancelReason}</p>
								</div>
							</div>
						)}
					</div>

					<DialogFooter>
						<Button variant="outline" onClick={handleClose}>
							Close
						</Button>
						{canChangeStatus && (
							<>
								<Button
									variant="destructive"
									onClick={() => setShowCancelConfirm(true)}
									disabled={cancelOrderMutation.isPending}
								>
									Cancel Order
								</Button>
								<Button
									onClick={handleStatusChange}
									disabled={!selectedStatus || changeStatusMutation.isPending}
								>
									{changeStatusMutation.isPending ? "Updating..." : "Update Status"}
								</Button>
							</>
						)}
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Cancel Confirmation Dialog */}
			<AlertDialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle className="flex items-center gap-2">
							<XCircle className="h-5 w-5 text-red-600" />
							Cancel Order
						</AlertDialogTitle>
						<AlertDialogDescription>
							You are about to cancel order {order.code}. This action cannot be undone. Please
							provide a reason for cancellation.
						</AlertDialogDescription>
					</AlertDialogHeader>

					<div className="my-4">
						<Label htmlFor="cancel-reason" className="text-sm font-medium">
							Cancel Reason <span className="text-red-600">*</span>
						</Label>
						<Textarea
							id="cancel-reason"
							placeholder="Please provide a reason for cancelling this order..."
							value={cancelReason}
							onChange={(e) => setCancelReason(e.target.value)}
							className="mt-1"
							rows={3}
						/>
					</div>

					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => setShowCancelConfirm(false)}>
							Keep Order
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleCancelConfirm}
							disabled={!cancelReason.trim() || cancelOrderMutation.isPending}
							className="bg-red-600 hover:bg-red-700"
						>
							{cancelOrderMutation.isPending ? "Cancelling..." : "Cancel Order"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
