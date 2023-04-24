import type { FastifyRequest } from "fastify";
import { UserWithoutPassword } from "../models/user/output";

export interface SignInInput {
    email: string;
    password: string;
}

export interface SignInOutput {
    user: UserWithoutPassword;
    token: string;
    expiryDate: Date;
}

export interface IUserAuthToken {
    _id: number;
    email: string;
    role: string;
}

export interface IUserRequest extends FastifyRequest {
    authUser: UserWithoutPassword;
}
