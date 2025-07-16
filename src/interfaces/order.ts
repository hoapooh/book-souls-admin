import { Base } from "./base";

export enum OrderStatus {
	PENDING = "Pending",
	COMPLETED = "Completed",
	ACCEPTED = "Accepted",
	CANCEL = "Cancel",
}

export enum PaymentStatus {
	NONE = "None",
	PAID = "Paid",
	REFUND = "Refund",
}

export interface IOrderBook {
	bookId: string;
	bookTitle: string;
	bookPrice: number;
	quantity: number;
}

export interface IOrder {
	id: string;
	customerId: string;
	code: string;
	totalPrice: number;
	orderStatus: OrderStatus;
	cancelReason?: string;
	paymentStatus: PaymentStatus;
	createdAt: string;
	orderBooks: IOrderBook[];
}

export interface IOrderParams {
	pageIndex?: number;
	limit?: number;
	customerId?: string;
	orderStatus?: OrderStatus;
	paymentStatus?: PaymentStatus;
}

export interface IOrderListResponse {
	items: IOrder[];
	totalCount: number;
}

export type IOrderListResponseType = Base<IOrderListResponse>;
