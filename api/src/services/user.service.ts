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

interface FindOptions {
    excludeDeleted?: boolean;
}

@Service()
class UserService {
    /**
     * Finds a user by email.
     * @param {string} email - The email of the user to find.
     * @param {object} [options={}] - Additional options for the query.
     * @param {boolean} [options.excludeDeleted=false] - Whether to exclude deleted users from the query.
     * @returns {Promise<User>} A Promise that resolves to the User object or null if not found.
     */
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

    /**
     * Finds a user by id.
     * @param {number} id - The id of the user to find.
     * @param {object} [options={}] - Additional options for the query.
     * @param {boolean} [options.excludeDeleted=false] - Whether to exclude deleted users from the query.
     * @returns {Promise<User>} A Promise that resolves to the User object or null if not found.
     */
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

    /**
     * Creates a new user.
     * @param {object} userInput - The input data for creating a new user.
     * @param {string} userInput.email - The email of the user to create.
     * @param {string} userInput.password - The password of the user to create.
     * @param {string} userInput.firstName - The first name of the user to create.
     * @param {string} userInput.lastName - The last name of the user to create.
     * @returns {Promise<User>} A Promise that resolves to the created User object or null if the user already exists.
     */
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

    /**
     * Finds all users with optional pagination, sorting, and filtering options.
     *
     * @param opts - Optional query options for pagination, sorting, and filtering.
     * @returns A promise containing an object with an array of users and the total number of users.
     */
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

    /**
     * Updates a user by ID with the provided fields.
     *
     * @param id - The ID of the user to update.
     * @param updatedFields - An object containing the updated fields for the user.
     * @returns A promise containing the updated user.
     */
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

    /**
     * Soft-deletes a user by ID.
     *
     * @param id - The ID of the user to delete.
     * @returns A promise containing a boolean indicating whether the user was successfully deleted.
     */
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
