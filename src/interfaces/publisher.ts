import { Base } from "./base";

export interface IPublisher {
	id: string;
	name: string;
	description: string;
	createdAt: string;
	updatedAt: string;
}

export interface IPublisherResponse {
	items: IPublisher[];
	totalCount: number;
}

export interface IPublisherParams {
	pageIndex?: number;
	limit?: number;
}

export type IPublisherListResponseType = Base<IPublisherResponse>;

export interface IPublisherCreateBody {
	name: string;
	description: string;
}
