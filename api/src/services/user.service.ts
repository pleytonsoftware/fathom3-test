import type UserInput from "../@types/models/user/input";
import type { Prisma, User } from "@prisma/client";
import { Service } from "typedi";
import prisma from "../prisma";
import { Crypter } from "../helpers/crypter";
import EditUserInput from "../@types/models/user/edit";
import { excludePassword } from "../helpers/user";
import { FindAllOptions } from "../@types/routes/input";
import log from "../helpers/logger";

@Service()
class UserService {
    public async findByEmail(
        email: UserInput["email"],
        { excludeDeleted }: { excludeDeleted?: boolean } = {},
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
        { excludeDeleted }: { excludeDeleted?: boolean } = {},
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

    public async findAll(opts?: FindAllOptions) {
        // TODO important!
        // ! add pagination, filtering, sorting using `opts`
        const users = await prisma.user.findMany({
            where: {
                deleted: false,
            },
        });
        return users.map((user) => excludePassword(user));
    }

    public async updateById(id: number, updatedFields: EditUserInput) {
        if (!id) {
            log.debug("updateById(user) - id not found", id, updatedFields);
            return null;
        }

        const user = await prisma.user.update({
            data: {
                firstName: updatedFields.firstName,
                lastName: updatedFields.lastName,
            },
            where: {
                id,
            },
        });

        return excludePassword(user);
    }

    public async deleteById(id: number) {
        log.debug("deleteById(user) - id not found", id);
        const user = await prisma.user.delete({
            where: {
                id,
            },
        });

        return Boolean(user);
    }
}

export default UserService;
