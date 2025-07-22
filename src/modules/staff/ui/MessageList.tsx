"use client";

import { format, subHours } from "date-fns";
import { useEffect, useRef } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IMessage } from "@/interfaces/chat";
import { cn } from "@/lib/utils";

interface MessageListProps {
	messages: IMessage[];
	currentUserId?: string;
	isLoading: boolean;
}

export function MessageList({ messages, currentUserId, isLoading }: MessageListProps) {
	const scrollAreaRef = useRef<HTMLDivElement>(null);
	const bottomRef = useRef<HTMLDivElement>(null);

	// Auto scroll to bottom when new messages arrive
	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-full">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
			</div>
		);
	}

	return (
		<ScrollArea className="h-full p-4" ref={scrollAreaRef}>
			<div className="space-y-4">
				{messages.map((message) => {
					const isCurrentUser = message.senderId === currentUserId;
					console.log("Message data:", {
						id: message.id,
						sentAt: message.sentAt,
						sentAtParsed: new Date(message.sentAt),
						sentAtLocal: new Date(message.sentAt).toLocaleString(),
						sentAtISO: new Date(message.sentAt).toISOString(),
					});

					// Helper function to handle timezone safely
					const formatMessageTime = (sentAt: string) => {
						try {
							const date = new Date(sentAt);
							// Check if the date is valid
							if (isNaN(date.getTime())) {
								return "Invalid time";
							}

							// If the time seems to be in UTC and needs local conversion
							const now = new Date();
							const timezoneOffset = now.getTimezoneOffset(); // in minutes

							// Log for debugging
							console.log("Timezone offset (minutes):", timezoneOffset);
							console.log("Original date:", date);
							console.log("Local date:", new Date(date.getTime() - timezoneOffset * 60 * 1000));

							return format(subHours(date, 7), "HH:mm");
						} catch (error) {
							console.error("Error formatting time:", error);
							return "Error";
						}
					};

					return (
						<div
							key={message.id}
							className={cn(
								"flex items-start space-x-2",
								isCurrentUser && "flex-row-reverse space-x-reverse"
							)}
						>
							<Avatar className="h-8 w-8">
								{message.senderAvatar && !isCurrentUser && (
									<AvatarImage
										src={message.senderAvatar}
										alt={message.senderId}
										className="object-cover"
									/>
								)}
								<AvatarFallback className="text-xs">
									{isCurrentUser ? "S" : message.senderId.slice(0, 2).toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<div
								className={cn(
									"max-w-[70%] rounded-lg p-3",
									isCurrentUser ? "bg-primary text-primary-foreground ml-auto" : "bg-muted"
								)}
							>
								<p className="text-sm">{message.text}</p>
								<p
									className={cn(
										"text-xs mt-1",
										isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground"
									)}
								>
									{formatMessageTime(message.sentAt)}
								</p>
							</div>
						</div>
					);
				})}
				{messages.length === 0 && (
					<div className="text-center text-muted-foreground py-8">
						No messages yet. Start the conversation!
					</div>
				)}
				<div ref={bottomRef} />
			</div>
		</ScrollArea>
	);
}
