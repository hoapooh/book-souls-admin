"use client";

import { useState } from "react";
import { useStaffAuthStore } from "@/modules/staff/stores/auth.store";
import { redirect } from "next/navigation";
import { OrderManagementTable, OrderDetailModal } from "@/modules/staff/ui";
import { IOrder } from "@/interfaces/order";

export default function StaffOrdersPage() {
	const { user, isLoading } = useStaffAuthStore();
	const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (!user) {
		redirect("/staff/login");
	}

	const handleViewOrder = (order: IOrder) => {
		setSelectedOrder(order);
		setIsModalOpen(true);
	};

	return (
		<div className="container mx-auto p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Order Management</h1>
					<p className="text-muted-foreground">Manage customer orders and order processing</p>
				</div>
			</div>

			<OrderManagementTable onViewOrder={handleViewOrder} />

			<OrderDetailModal order={selectedOrder} open={isModalOpen} onOpenChange={setIsModalOpen} />
		</div>
	);
}
