export default interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string | null;
    createdAt: string;
    updatedAt: string;
    role: string;
    deleted: boolean;
}
