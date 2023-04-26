export interface AdminAddUser {
    email: string;
    password: string;
    repeatPassword: string;
    firstName?: string;
    lastName?: string;
    role: string;
}
