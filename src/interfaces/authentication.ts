export enum AccountRole {
	STAFF = "staff",
	CUSTOMER = "customer",
	ADMIN = "admin",
}

export interface LoginBody {
	email: string;
	password: string;
}

export interface LoginResponse {
	token: {
		accessToken: string;
		id: string;
		fullName: string;
		role: AccountRole;
		avatar: string;
	};
}
