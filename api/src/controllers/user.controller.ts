import type { RouteHandlerMethod } from "fastify";
import type { FindByIdOrEmailParams } from "../@types/routes/user";
import type { UserWithoutPassword } from "../@types/models/user/output";
import type UserInput from "../@types/models/user/input";
import type EditUserInput from "../@types/models/user/edit";
import Container from "typedi";
import UserService from "../services/user.service";
import statusCodes from "http-status-codes";
import { validatePassword } from "../helpers/validators";
import { FindById } from "../@types/routes";

const userService = Container.get(UserService);

export const findAll: RouteHandlerMethod = async (req, reply) => {
    // TODO add pagination
    // TODO add validation
    const users = await userService.findAll();
    reply.send(users);
};

export const findByIdOrEmail: RouteHandlerMethod = async (req, reply) => {
    const { idOrEmail } = req.params as FindByIdOrEmailParams;

    if (!idOrEmail) {
        reply.code(statusCodes.NOT_FOUND).send();
    }

    const possibleIdAsNumber = Number(idOrEmail);
    let user: UserWithoutPassword | null = null;

    if (typeof possibleIdAsNumber === "number" && !isNaN(possibleIdAsNumber)) {
        user = await userService.findById(possibleIdAsNumber);
    } else if (idOrEmail && typeof idOrEmail === "string") {
        user = await userService.findByEmail(idOrEmail);
    }

    if (!user) {
        reply.code(statusCodes.NOT_FOUND).send();
    }

    reply.send(user);
};

export const create: RouteHandlerMethod = async (req, reply) => {
    const { email, password, repeatPassword, firstName, lastName } =
        req.body as UserInput;

    validatePassword(password, repeatPassword, reply);

    try {
        const user = await userService.create({
            email,
            password,
            firstName,
            lastName,
        });

        if (!user?.id) {
            reply
                .code(statusCodes.UNPROCESSABLE_ENTITY)
                .send({ message: "User already exists", data: email });
        }

        reply.code(statusCodes.CREATED).send(user);
    } catch (error) {
        reply
            .code(statusCodes.INTERNAL_SERVER_ERROR)
            .send({ message: "Error creating user", error });
    }
};

export const update: RouteHandlerMethod = async (req, reply) => {
    // TODO check if user is the logged one
    const { id } = req.params as FindById;
    const { firstName, lastName } = req.params as EditUserInput;
    await userService.updateById(Number(id), { firstName, lastName });
};

export const remove: RouteHandlerMethod = async (req, reply) => {
    // TODO check if user is the logged one
    const { id } = req.params as FindById;

    await userService.deleteById(Number(id));
};
