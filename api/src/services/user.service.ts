import type UserInput from "../@types/models/user/input";
import type { Prisma, User } from "@prisma/client";
import { Service } from "typedi";
import prisma from "../prisma";
import { Crypter } from "../helpers/crypter";
import EditUserInput from "../@types/models/user/edit";
import { excludePassword } from "../helpers/user";
import { PaginationQuery } from "../@types/routes/input";
import log from "../helpers/logger";
import { UserWithoutPassword } from "../@types/models/user/output";

// TODO move to @types
interface FindOptions {
    excludeDeleted?: boolean;
}

@Service()
class UserService {
    public async findByEmail(
        email: UserInput["email"],
        { excludeDeleted }: FindOptions = {},
    ) {
        if (!email) {
            return null;
        }

        let excludeDeletedStatement = excludeDeleted
            ? {
                  deleted: false,
              }
            : {};

        const user = await prisma.user.findFirst({
            where: {
                email,
                ...excludeDeletedStatement,
            },
        });

        if (!user) {
            log.debug("findByEmail - user not found", email);
        }

        return excludePassword(user);
    }

    public async findById(
        id: number,
        { excludeDeleted = false }: FindOptions = {},
    ) {
        if (!id) {
            return null;
        }

        let excludeDeletedStatement = excludeDeleted
            ? {
                  deleted: false,
              }
            : {};

        const user = await prisma.user.findFirst({
            where: {
                id,
                ...excludeDeletedStatement,
            },
        });

        if (!user) {
            log.debug("findById - user not found", id);
        }

        return excludePassword(user);
    }

    public async create({
        email,
        password,
        firstName,
        lastName,
    }: Omit<UserInput, "repeatPassword">) {
        const userFound = await this.findByEmail(email);

        if (userFound) {
            log.debug("create(user) - user found", userFound);
            return null;
        }

        const hashedPassword = await Crypter.generatePassword(password);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
            },
        });

        return excludePassword(user);
    }

    public async findAll(opts?: PaginationQuery): Promise<{
        data: Array<UserWithoutPassword>;
        total: number;
    }> {
        const { pagination, sortBy, filterBy } = opts ?? {};

        const filtering = filterBy
            ? {
                  [filterBy.key]:
                      typeof filterBy.value === "string"
                          ? {
                                contains: filterBy.value,
                                mode: "insensitive",
                            }
                          : filterBy.value,
              }
            : {};

        const users = await prisma.user.findMany({
            where: filtering,
            skip: pagination?.offset,
            take: pagination?.size,
            ...(sortBy
                ? {
                      orderBy: {
                          [sortBy.field]: sortBy.direction,
                      },
                  }
                : {}),
        });
        const total = await prisma.user.count({
            where: filtering,
        });

        return {
            data: users.map(
                (user) => excludePassword(user) as UserWithoutPassword,
            ),
            total,
        };
    }

    public async updateById(id: number, updatedFields: EditUserInput) {
        if (!id) {
            log.debug("updateById(user) - id not found", id, updatedFields);
            return null;
        }

        const optionalRole = updatedFields.role
            ? { role: updatedFields.role }
            : {};

        const user = await prisma.user.update({
            data: {
                firstName: updatedFields.firstName,
                lastName: updatedFields.lastName,
                ...optionalRole,
            },
            where: {
                id,
            },
        });

        return excludePassword(user);
    }

    public async deleteById(id: number) {
        log.debug("deleteById(user) - id not found", id);
        const user = await prisma.user.update({
            data: {
                deleted: true,
            },
            where: {
                id,
            },
        });

        return Boolean(user);
    }
}

export default UserService;
