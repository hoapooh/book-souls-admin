"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Wifi, WifiOff } from "lucide-react";
import { useChat } from "../hooks/useChat";
import { ConversationList } from "./ConversationList";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";

interface ChatInterfaceProps {
	currentUserId: string;
}

export function ChatInterface({ currentUserId }: ChatInterfaceProps) {
	// Early return if no currentUserId to prevent hook issues
	if (!currentUserId) {
		return (
			<div className="flex items-center justify-center h-full">
				<div className="text-center text-muted-foreground">
					<h3 className="text-lg font-medium mb-2">Authentication Required</h3>
					<p>Please log in to access the chat</p>
				</div>
			</div>
		);
	}

	const {
		conversations,
		selectedConversation,
		messages,
		isConnected,
		isLoading,
		isLoadingMessages,
		selectConversation,
		sendMessage,
	} = useChat();

	const handleSendMessage = async (text: string) => {
		if (!selectedConversation) return false;

		return await sendMessage(
			selectedConversation.conversationId,
			currentUserId,
			selectedConversation.otherUserId,
			text
		);
	};

	return (
		<div className="h-[calc(100vh-8rem)] flex gap-4">
			{/* Conversations Sidebar */}
			<Card className="w-80 flex flex-col">
				<CardHeader className="border-b">
					<div className="flex items-center justify-between">
						<CardTitle className="flex items-center gap-2">
							<MessageCircle className="h-5 w-5" />
							Conversations
						</CardTitle>
						<Badge
							variant={isConnected ? "default" : "destructive"}
							className="flex items-center gap-1"
						>
							{isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
							{isConnected ? "Online" : "Offline"}
						</Badge>
					</div>
				</CardHeader>
				<CardContent className="flex-1 p-0">
					<ConversationList
						conversations={conversations}
						selectedConversation={selectedConversation}
						onSelectConversation={selectConversation}
						isLoading={isLoading}
					/>
				</CardContent>
			</Card>

			{/* Chat Area */}
			<Card className="flex-1 flex flex-col">
				{selectedConversation ? (
					<>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<MessageCircle className="h-5 w-5" />
								Chat with User {selectedConversation.otherUserId}
							</CardTitle>
						</CardHeader>
						<Separator />
						<CardContent className="flex-1 p-0 flex flex-col overflow-auto">
							<div className="flex-1">
								<MessageList
									messages={messages}
									currentUserId={currentUserId}
									isLoading={isLoadingMessages}
								/>
							</div>
						</CardContent>
						<MessageInput onSendMessage={handleSendMessage} disabled={!isConnected} />
					</>
				) : (
					<CardContent className="flex-1 flex items-center justify-center">
						<div className="text-center text-muted-foreground">
							<MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
							<h3 className="text-lg font-medium mb-2">Select a conversation</h3>
							<p>Choose a conversation from the sidebar to start chatting</p>
						</div>
					</CardContent>
				)}
			</Card>
			{/* <ChatDebugInfo isConnected={isConnected} connection={connection} /> */}
		</div>
	);
}
