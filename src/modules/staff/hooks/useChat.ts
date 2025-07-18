"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { IConversation, IMessage, ISignalRMessage } from "@/interfaces/chat";
import {
	HttpTransportType,
	HubConnection,
	HubConnectionBuilder,
	LogLevel,
} from "@microsoft/signalr";

import { chatService } from "../services/chat.service";
import { useStaffAuthStore } from "../stores/auth.store";

export const useChat = () => {
	const [connection, setConnection] = useState<HubConnection | null>(null);
	const [conversations, setConversations] = useState<IConversation[]>([]);
	const [selectedConversation, setSelectedConversation] = useState<IConversation | null>(null);
	const [messages, setMessages] = useState<IMessage[]>([]);
	const [isConnected, setIsConnected] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingMessages, setIsLoadingMessages] = useState(false);
	const connectionRef = useRef<HubConnection | null>(null);
	const selectedConversationRef = useRef<IConversation | null>(null);
	const { accessToken, isAuthenticated } = useStaffAuthStore();

	// Keep selectedConversationRef in sync
	useEffect(() => {
		selectedConversationRef.current = selectedConversation;
	}, [selectedConversation]);

	// Initialize SignalR connection
	useEffect(() => {
		// Skip if not authenticated or no access token
		if (!isAuthenticated || !accessToken) {
			console.log("Not authenticated or no access token, skipping SignalR connection");
			// Clean up existing connection if user logs out
			if (connectionRef.current) {
				console.log("Cleaning up existing SignalR connection due to logout");
				connectionRef.current.stop();
				connectionRef.current = null;
				setConnection(null);
				setIsConnected(false);
			}
			return;
		}

		const hubUrl = process.env.NEXT_PUBLIC_CHAT_URL;
		if (!hubUrl) {
			console.error("NEXT_PUBLIC_CHAT_URL is not defined in environment variables");
			return;
		}

		console.log("Initializing SignalR connection...");

		const newConnection = new HubConnectionBuilder()
			.withUrl(hubUrl, {
				transport: HttpTransportType.WebSockets,
				accessTokenFactory: () => accessToken || "",
				skipNegotiation: true,
			})
			.withAutomaticReconnect([0, 2000, 10000, 30000])
			.configureLogging(LogLevel.Debug)
			.build();

		// Register event listeners BEFORE starting connection
		newConnection.on("ReceiveMessage", (signalRMessage: ISignalRMessage) => {
			// Validate that we have the required fields
			if (!signalRMessage || !signalRMessage.conversationId || !signalRMessage.text) {
				console.error("Invalid SignalRMessage received:", signalRMessage);
				return;
			}

			const newMessage: IMessage = {
				id: signalRMessage.id || `temp-${Date.now()}`,
				conversationId: signalRMessage.conversationId,
				senderId: signalRMessage.senderId,
				receiverId: signalRMessage.receiverId,
				text: signalRMessage.text || "",
				sentAt: signalRMessage.sentAt,
				isRead: signalRMessage.isRead || false,
				isDeleted: signalRMessage.isDeleted || false,
			};

			setMessages((prevMessages) => {
				// Only add if it's for the current conversation
				if (selectedConversationRef.current?.conversationId === signalRMessage.conversationId) {
					// Check for duplicates using message ID if available, or text + timestamp
					const exists = prevMessages.some((msg) => {
						if (signalRMessage.id && msg.id === signalRMessage.id) {
							return true; // Same ID = duplicate
						}
						// Fallback: check text + sender + similar timestamp
						return (
							msg.text === signalRMessage.text &&
							msg.senderId === signalRMessage.senderId &&
							Math.abs(new Date(msg.sentAt).getTime() - new Date(signalRMessage.sentAt).getTime()) <
								1000
						);
					});

					if (!exists) {
						const updatedMessages = [...prevMessages, newMessage];
						console.log("Messages list size after:", updatedMessages.length);
						console.log("SignalRMessage added to UI successfully");
						return updatedMessages;
					} else {
						console.log("Duplicate message detected, not adding");
					}
				} else {
					console.log("Message not for current conversation, not adding to UI");
				}
				return prevMessages;
			});

			// Update last message in conversations list
			setConversations((prevConversations) =>
				prevConversations.map((conv) =>
					conv.conversationId === signalRMessage.conversationId
						? {
								...conv,
								lastMessage: signalRMessage.text,
								lastSentAt: signalRMessage.sentAt,
								lastSenderId: signalRMessage.senderId,
						  }
						: conv
				)
			);
		});

		newConnection.on("ReceiveException", (error: string) => {
			console.error("SignalR Exception:", error);
		});

		// Add connection state listeners
		newConnection.onreconnecting(() => {
			console.log("SignalR reconnecting...");
			setIsConnected(false);
		});

		newConnection.onreconnected(() => {
			console.log("SignalR reconnected");
			setIsConnected(true);
		});

		newConnection.onclose(() => {
			console.log("SignalR connection closed");
			setIsConnected(false);
		});

		connectionRef.current = newConnection;
		setConnection(newConnection);

		const startConnection = async () => {
			try {
				await newConnection.start();
				setIsConnected(true);
				console.log("SignalR connected successfully");
			} catch (error) {
				console.error("SignalR connection error:", error);
				setIsConnected(false);
			}
		};

		startConnection();

		return () => {
			if (connectionRef.current) {
				console.log("Cleaning up SignalR connection");
				connectionRef.current.stop();
			}
		};
	}, [accessToken, isAuthenticated]); // Include isAuthenticated in dependencies

	// Load conversations
	const loadConversations = useCallback(async () => {
		if (!isAuthenticated || !accessToken) {
			console.log("Not authenticated, skipping load conversations");
			return;
		}

		try {
			setIsLoading(true);
			const response = await chatService.getConversations();
			setConversations(response.result.result);
		} catch (error) {
			console.error("Error loading conversations:", error);
		} finally {
			setIsLoading(false);
		}
	}, [isAuthenticated, accessToken]);

	// Load messages for a conversation
	const loadMessages = useCallback(async (conversationId: string) => {
		try {
			setIsLoadingMessages(true);
			const response = await chatService.getConversationsMessages(conversationId);
			setMessages(response.result.result);
		} catch (error) {
			console.error("Error loading messages:", error);
		} finally {
			setIsLoadingMessages(false);
		}
	}, []);

	// Send message
	const sendMessage = useCallback(
		async (conversationId: string, senderId: string, receiverId: string, text: string) => {
			if (!connection || !isConnected) {
				return false;
			}

			try {
				await connection.invoke("SendMessage", conversationId, senderId, receiverId, text);

				// Add message optimistically to UI
				const newMessage: IMessage = {
					id: `temp-${Date.now()}`,
					conversationId,
					senderId,
					receiverId,
					text,
					sentAt: new Date().toISOString(),
					isRead: false,
					isDeleted: false,
				};

				setMessages((prevMessages) => [...prevMessages, newMessage]);

				// Update conversations list
				setConversations((prevConversations) =>
					prevConversations.map((conv) =>
						conv.conversationId === conversationId
							? {
									...conv,
									lastMessage: text,
									lastSentAt: newMessage.sentAt,
									lastSenderId: senderId,
							  }
							: conv
					)
				);

				return true;
			} catch (error) {
				console.error("Error sending message:", error);
				return false;
			}
		},
		[connection, isConnected]
	);

	// Select conversation
	const selectConversation = useCallback(
		(conversation: IConversation) => {
			setSelectedConversation(conversation);
			loadMessages(conversation.conversationId);
		},
		[loadMessages]
	);

	// Initialize conversations on mount
	useEffect(() => {
		if (isAuthenticated && accessToken) {
			loadConversations();
		}
	}, [loadConversations, isAuthenticated, accessToken]);

	return {
		conversations,
		selectedConversation,
		messages,
		isConnected,
		isLoading,
		isLoadingMessages,
		loadConversations,
		selectConversation,
		sendMessage,
		connection,
	};
};
