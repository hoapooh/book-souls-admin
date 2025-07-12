import { apiClient } from "@/configs";
import { IChatMessageResponseType, IChatResponseType } from "@/interfaces/chat";

export const chatService = {
	getConversations: async (): Promise<IChatResponseType> => {
		const response = await apiClient.get("/chat/conversations");
		return response.data;
	},
	getConversationsMessages: async (conversationId: string): Promise<IChatMessageResponseType> => {
		const response = await apiClient.get(`/chat/${conversationId}/messages`);
		return response.data;
	},
	sendMessage: async (
		conversationId: string,
		senderId: string,
		receiverId: string,
		text: string
	) => {
		const response = await apiClient.post(`/chat/${conversationId}/messages`, {
			senderId,
			receiverId,
			text,
		});
		return response.data;
	},
};
