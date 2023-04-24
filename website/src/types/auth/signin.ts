import type User from "../model/user";

export interface SignInData {
    email: string;
    password: string;
}
export interface SignInDataReturn {
    user: User;
    token: string;
    expiryDate: string;
}
