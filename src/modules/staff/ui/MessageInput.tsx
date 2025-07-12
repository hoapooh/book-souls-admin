"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useState, KeyboardEvent } from "react";

interface MessageInputProps {
	onSendMessage: (text: string) => Promise<boolean>;
	disabled?: boolean;
}

export function MessageInput({ onSendMessage, disabled }: MessageInputProps) {
	const [message, setMessage] = useState("");
	const [isSending, setIsSending] = useState(false);

	const handleSend = async () => {
		if (!message.trim() || isSending || disabled) return;

		setIsSending(true);
		const success = await onSendMessage(message.trim());
		if (success) {
			setMessage("");
		}
		setIsSending(false);
	};

	const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	return (
		<div className="flex items-center space-x-2 p-4 border-t">
			<Input
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				onKeyDown={handleKeyPress}
				placeholder="Type a message..."
				disabled={disabled || isSending}
				className="flex-1"
			/>
			<Button
				onClick={handleSend}
				disabled={!message.trim() || disabled || isSending}
				size="icon"
				className="shrink-0"
			>
				<Send className="h-4 w-4" />
			</Button>
		</div>
	);
}
