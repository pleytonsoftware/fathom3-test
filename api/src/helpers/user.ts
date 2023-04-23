import type { User } from "@prisma/client";
import type { UserWithoutPassword } from "../@types/models/user/output";

export const excludePassword = (
    user: User | null,
): UserWithoutPassword | null => {
    if (!user) return user;

    const userNew = { ...user } as Partial<User>;
    delete userNew.password;
    return userNew as UserWithoutPassword;
};
