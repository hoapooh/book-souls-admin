import { AccountRole } from "./authentication";

enum Gender {
	MALE = "male",
	FEMALE = "female",
}

export interface IUser {
	id: string;
	fullName: string;
	email: string;
	phoneNumber: string;
	role: AccountRole;
	gender: Gender;
	avatar: string;
	address?: {
		street: string;
		ward: string;
		district: string;
		city: string;
		country: string;
	};
	createdAt: string;
	updatedAt: string;
}

export interface AllUserResponse {
	items: IUser[];
	totalCount: number;
}

export interface AllUserParams {
	pageIndex: number;
	limit: number;
}
