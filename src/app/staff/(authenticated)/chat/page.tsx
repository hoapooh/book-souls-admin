"use client";

import { ChatInterface } from "@/modules/staff/ui/ChatInterface";
import { useStaffAuthStore } from "@/modules/staff/stores/auth.store";

export default function ChatPage() {
	const { user, isAuthenticated } = useStaffAuthStore();

	if (!isAuthenticated || !user) {
		return (
			<div className="flex items-center justify-center h-full">
				<div className="text-center">
					<h2 className="text-lg font-semibold mb-2">Authentication Required</h2>
					<p className="text-muted-foreground">Please log in to access the chat</p>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-6">
			<div className="mb-6">
				<h1 className="text-2xl font-bold">Chat Support</h1>
				<p className="text-muted-foreground">Communicate with customers in real-time</p>
			</div>
			<ChatInterface currentUserId={user.id} />
		</div>
	);
}
