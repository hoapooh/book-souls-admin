import { Base } from "./base";

export interface IBook {
	id: string;
	title: string;
	description: string;
	author: string;
	isbn: string;
	publisherId: string;
	categoryIds: string[];
	releaseYear: number;
	isStricted: boolean;
	price: number;
	stock: number;
	image: string;
	rating: number;
	ratingCount: number;
	createdAt: string;
	updatedAt: string | null;
}

export interface IBookResponse {
	items: IBook[];
	totalCount: number;
}

export type IBookResponseType = Base<IBookResponse>;
export type IBookDetailResponseType = Base<IBook>;

export interface BookCreateParams {
	title: string;
	author: string;
	publisherId: string;
	categoryIds: string;
	releaseYear: number;
	isStricted: boolean;
	price: number;
	stock: number;
	description: string;
}

export interface BookCreateBody {
	image: File | null;
}

export interface BookCreateRequest {
	metadata: BookCreateParams;
	body: BookCreateBody;
}
