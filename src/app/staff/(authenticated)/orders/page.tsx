"use client";

import { useState } from "react";
import { useStaffAuthStore } from "@/modules/staff/stores/auth.store";
import { redirect } from "next/navigation";
import {
	OrderManagementTable,
	OrderDetailModal,
	OrderStatusChangeDialog,
} from "@/modules/staff/ui";
import { IOrder } from "@/interfaces/order";

export default function StaffOrdersPage() {
	const { user, isLoading } = useStaffAuthStore();
	const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
	const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
	const [isStatusChangeModalOpen, setIsStatusChangeModalOpen] = useState(false);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (!user) {
		redirect("/staff/login");
	}

	const handleViewOrder = (order: IOrder) => {
		setSelectedOrder(order);
		setIsDetailModalOpen(true);
	};

	const handleChangeStatus = (order: IOrder) => {
		setSelectedOrder(order);
		setIsStatusChangeModalOpen(true);
	};

	return (
		<div className="container mx-auto p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Order Management</h1>
					<p className="text-muted-foreground">Manage customer orders and order processing</p>
				</div>
			</div>

			<OrderManagementTable onViewOrder={handleViewOrder} onChangeStatus={handleChangeStatus} />

			<OrderDetailModal
				order={selectedOrder}
				open={isDetailModalOpen}
				onOpenChange={setIsDetailModalOpen}
			/>

			<OrderStatusChangeDialog
				order={selectedOrder}
				open={isStatusChangeModalOpen}
				onOpenChange={setIsStatusChangeModalOpen}
			/>
		</div>
	);
}
