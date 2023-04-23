import type { FastifyReply, preHandlerHookHandler } from "fastify";
import JWTSigner from "./jwt";
import config from "../config";
import statusCodes from "http-status-codes";
import Container from "typedi";
import UserService from "../services/user.service";
import SessionService from "../services/session.service";
import { FastifyReplyType } from "fastify/types/type-provider";
import { IUserRequest } from "../@types/routes/auth";
import ROLES from "../@types/models/user/roles";
import { FindById } from "../@types/routes";

/**
 * Sends a Fastify reply with the specified payload and HTTP status code.
 * If `payload` and `code` are not specified, sends a 400 Bad Request response.
 *
 * @param reply - Fastify reply object.
 * @param options - An object containing the following optional properties:
 *   - payload: Response payload.
 *   - code: HTTP status code.
 */
const replyWith = (
    reply: FastifyReply,
    {
        payload,
        code,
    }: {
        payload?: FastifyReplyType;
        code?: number;
    } = {},
) =>
    reply
        .code(code ?? statusCodes.BAD_REQUEST)
        .send(payload ?? code ?? statusCodes.BAD_REQUEST);

/**
 * A Fastify preHandler hook that checks if a request has a valid JWT token in the Authorization header.
 *
 * @param request - Fastify request object.
 * @param reply - Fastify reply object.
 * @param done - Fastify done callback.
 */
export const checkValidRequest: preHandlerHookHandler = async (
    request,
    reply,
) => {
    try {
        let token = request.headers.authorization;

        if (!token) {
            throw new Error("Invalid Authorization");
        }

        token = token.replace("Bearer ", "");
        try {
            await JWTSigner.verify(token, config.JWT_SECRET);
        } catch (error) {
            return replyWith(reply, { payload: { error } });
        }
    } catch (error) {
        return replyWith(reply, { payload: { error } });
    }
};

/**
 * A Fastify preHandler hook that checks if a request has a valid user JWT token in the Authorization header.
 * If the token is valid, attaches the authenticated user object to the request object.
 *
 * @param request - Fastify request object.
 * @param reply - Fastify reply object.
 * @param done - Fastify done callback.
 */

export const checkValidUser: preHandlerHookHandler = async (
    request,
    reply,
    done,
) => {
    try {
        const userService = Container.get(UserService);
        const sessionService = Container.get(SessionService);
        let token = request.headers.authorization;

        if (!token) {
            throw new Error("Invalid Authorization");
        }

        token = token.replace("Bearer ", "");

        const userFromToken = await JWTSigner.verify(token, config.JWT_SECRET);

        if (!userFromToken._id) {
            return replyWith(reply, {
                code: statusCodes.UNAUTHORIZED,
            });
        }

        const user = await userService.findById(userFromToken._id);

        if (!user) {
            return replyWith(reply, { code: statusCodes.UNAUTHORIZED });
        }

        // TODO check token in session if assigned to user, if deleted, send bad request
        const sessionIsAlive = await sessionService.checkSessionIsAlive(
            user.id,
            token,
        );

        if (!sessionIsAlive) {
            return replyWith(reply, { code: statusCodes.UNAUTHORIZED });
        }

        // TODO temp, look for ts solution
        // ! temp
        (request as IUserRequest).authUser = user;
    } catch (error) {
        return replyWith(reply, {
            code: statusCodes.UNAUTHORIZED,
            payload: { error },
        });
    }
};

/**
 * Validates if the authenticated user is an admin.
 * @param request A pre-handler hook to check if the authenticated user is an admin
 * @param {FastifyRequest} request - The Fastify request object
 * @param {FastifyReply} reply - The Fastify reply object
 * @returns {void}
 */
export const checkValidUserIsAdmin: preHandlerHookHandler = async (
    request,
    reply,
) => {
    const authUser = (request as IUserRequest).authUser;
    if (!authUser || (authUser && authUser.role !== ROLES.admin)) {
        return replyWith(reply, {
            code: statusCodes.UNAUTHORIZED,
        });
    }
};

/**
 * A pre-handler hook to check if the authenticated user is authorized to update a user
 * @param {FastifyRequest} request - The Fastify request object
 * @param {FastifyReply} reply - The Fastify reply object
 * @returns {void}
 */
export const checkValidUserUpdate: preHandlerHookHandler = async (
    request,
    reply,
) => {
    const authUser = (request as IUserRequest).authUser;
    const requestedId = (request.params as FindById).id;

    if (
        Boolean(!authUser || !Number(requestedId)) ||
        (authUser && authUser.id !== Number(requestedId))
    ) {
        return replyWith(reply, {
            code: statusCodes.UNAUTHORIZED,
        });
    }
};
