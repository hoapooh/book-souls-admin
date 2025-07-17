import { Base } from "./base";

export interface ICategory {
	id: string;
	name: string;
	description: string;
	createdAt: string;
	updatedAt: string;
}

export interface ICategoryResponse {
	items: ICategory[];
	totalCount: number;
}

export interface ICategoryParams {
	pageIndex: number;
	limit: number;
}

export type ICategoryListResponseType = Base<ICategoryResponse>;

// POST
export interface ICategoryCreateBody {
	name: string;
	description: string;
}
