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
import { PaginationQueryParam, PaginationQuery } from "../@types/routes/input";
import { IUserRequest } from "../@types/routes/auth";
import ROLES from "../@types/models/user/roles";

const userService = Container.get(UserService);

/**
 * Route handler for finding all users
 * @param {FastifyRequest} req - The incoming request object
 * @param {FastifyReply} reply - The outgoing reply object
 * @returns {Promise<void>} - A promise that resolves when the response is sent
 */
export const findAll: RouteHandlerMethod = async (req, reply) => {
    const {
        offset,
        size,
        sortby_direction,
        sortby_field,
        filterby_key,
        filterby_value,
    } = req.query as PaginationQueryParam;

    const usersPaginated = await userService.findAll({
        pagination:
            Number(offset) >= 0 && Number(size) > 0
                ? {
                      offset: Number(offset),
                      size: Number(size),
                  }
                : undefined,
        filterBy:
            filterby_key && filterby_value
                ? {
                      key: filterby_key,
                      value: Boolean(Number(filterby_value))
                          ? Number(filterby_value)
                          : filterby_value === "true" ||
                            filterby_value === "false"
                          ? filterby_value === "true"
                          : filterby_value,
                  }
                : undefined,
        sortBy:
            sortby_field && sortby_direction
                ? {
                      field: sortby_field,
                      direction: sortby_direction,
                  }
                : undefined,
    });
    reply.send(usersPaginated);
};

/**
 * Route handler for finding a user by ID or email
 * @param {FastifyRequest} req - The incoming request object
 * @param {FastifyReply} reply - The outgoing reply object
 * @returns {Promise<void>} - A promise that resolves when the response is sent
 */
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

/**
 * Route handler for creating a new user
 * @param {FastifyRequest} req - The incoming request object
 * @param {FastifyReply} reply - The outgoing reply object
 * @returns {Promise<void>} - A promise that resolves when the response is sent
 */
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

/**
 * Route handler for updating a user
 * @param {FastifyRequest} req - The incoming request object
 * @param {FastifyReply} reply - The outgoing reply object
 * @returns {Promise<void>} - A promise that resolves when the response is sent
 */
export const update: RouteHandlerMethod = async (req, reply) => {
    const user = (req as IUserRequest).authUser;
    const { id } = req.params as FindById;
    const { firstName, lastName, role } = req.body as EditUserInput;

    await userService.updateById(Number(id), {
        firstName,
        lastName,
        role: user.role === ROLES.admin ? role : undefined,
    });
};

/**
 * Route handler for deleting a user
 * @param {FastifyRequest} req - The incoming request object
 * @param {FastifyReply} reply - The outgoing reply object
 * @returns {Promise<void>} - A promise that resolves when the response is sent
 */
export const remove: RouteHandlerMethod = async (req, reply) => {
    const { id } = req.params as FindById;

    await userService.deleteById(Number(id));
};
