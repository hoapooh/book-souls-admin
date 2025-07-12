"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { IConversation } from "@/interfaces/chat";
import { formatDistanceToNow, subHours } from "date-fns";

interface ConversationListProps {
	conversations: IConversation[];
	selectedConversation: IConversation | null;
	onSelectConversation: (conversation: IConversation) => void;
	isLoading: boolean;
}

export function ConversationList({
	conversations,
	selectedConversation,
	onSelectConversation,
	isLoading,
}: ConversationListProps) {
	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-full">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
			</div>
		);
	}

	return (
		<ScrollArea className="h-full">
			<div className="space-y-1 p-2">
				{conversations.map((conversation) => (
					<div
						key={conversation.conversationId}
						onClick={() => onSelectConversation(conversation)}
						className={cn(
							"flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors",
							"hover:bg-muted/50",
							selectedConversation?.conversationId === conversation.conversationId && "bg-muted"
						)}
					>
						<Avatar className="h-10 w-10">
							<AvatarFallback className="text-sm">
								{conversation.otherUserId.slice(0, 2).toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<div className="flex-1 min-w-0">
							<div className="flex items-center justify-between">
								<p className="text-sm font-medium truncate">User</p>
								<p className="text-xs text-muted-foreground shrink-0">
									{formatDistanceToNow(subHours(new Date(conversation.lastSentAt), 7), {
										addSuffix: true,
									})}
								</p>
							</div>
							<p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
						</div>
					</div>
				))}
				{conversations.length === 0 && (
					<div className="text-center text-muted-foreground py-8">No conversations yet</div>
				)}
			</div>
		</ScrollArea>
	);
}
