"use client";

import { useStaffAuthStore } from "../stores/auth.store";
import { useState, useEffect } from "react";

interface ChatDebugProps {
	isConnected: boolean;
	connection: any;
}

export function ChatDebugInfo({ isConnected, connection }: ChatDebugProps) {
	const { accessToken, user } = useStaffAuthStore();
	const [lastMessage, setLastMessage] = useState<any>(null);

	useEffect(() => {
		if (!connection) return;

		// Listen for debug messages
		const handleReceiveMessage = (message: any) => {
			setLastMessage({
				time: new Date().toLocaleTimeString(),
				data: message,
			});
		};

		connection.on?.("ReceiveMessage", handleReceiveMessage);

		return () => {
			connection.off?.("ReceiveMessage", handleReceiveMessage);
		};
	}, [connection]);

	if (process.env.NODE_ENV === "production") {
		return null;
	}

	return (
		<div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs font-mono max-w-sm">
			<div className="font-bold mb-2">Chat Debug Info</div>
			<div>Connection: {isConnected ? "✅ Connected" : "❌ Disconnected"}</div>
			<div>State: {connection?.state || "None"}</div>
			<div>User ID: {user?.id || "N/A"}</div>
			<div>Has Token: {accessToken ? "✅ Yes" : "❌ No"}</div>
			<div>Chat URL: {process.env.NEXT_PUBLIC_CHAT_URL || "Not set"}</div>
			{lastMessage && (
				<div className="mt-2 pt-2 border-t border-gray-600">
					<div className="font-bold">Last Message:</div>
					<div>Time: {lastMessage.time}</div>
					<div>ID: {lastMessage.data?.id}</div>
					<div>Text: {lastMessage.data?.text?.substring(0, 20)}...</div>
				</div>
			)}
		</div>
	);
}
