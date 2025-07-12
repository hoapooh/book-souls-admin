import { Base } from "./base";

export interface IConversation {
	conversationId: string;
	otherUserId: string;
	lastMessage: string;
	lastSenderId: string;
	lastSentAt: string;
}

export interface IConversationRoom {
	result: IConversation[];
}

export interface IMessage {
	id: string;
	conversationId: string;
	senderId: string;
	receiverId: string;
	text: string;
	sentAt: string;
	isRead: boolean;
	isDeleted: boolean;
}

export interface IMessageRoom {
	result: IMessage[];
}

// SignalR message interface that matches your Android Java model
export interface ISignalRMessage {
	id: string;
	conversationId: string;
	senderId: string;
	receiverId: string;
	text: string;
	sentAt: string;
	isRead: boolean;
	isDeleted: boolean;
}

export type IChatResponseType = Base<IConversationRoom>;
export type IChatMessageResponseType = Base<IMessageRoom>;
