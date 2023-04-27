import type { RouteHandlerMethod } from "fastify";
import type { IUserRequest } from "../@types/routes/auth";
import Container from "typedi";
import SessionService from "../services/session.service";
import { DeleteManyParams } from "../@types/routes/session";

const sessionService = Container.get(SessionService);

/**
 * Get all sessions for the authenticated user
 *
 * @route GET /api/sessions
 * @security BearerAuth
 */
export const getAll: RouteHandlerMethod = async (req, reply) => {
    const user = (req as IUserRequest).authUser;
    const sessions = await sessionService.findAllSessionsForUser(user.id);

    reply.send(sessions);
};

/**
 * Delete multiple sessions for the authenticated user
 *
 * @route DELETE /api/sessions/:ids
 * @security BearerAuth
 */
export const deleteMany: RouteHandlerMethod = async (req, reply) => {
    const user = (req as IUserRequest).authUser;
    const ids = (req.params as DeleteManyParams).ids
        .split(",")
        .filter(Number)
        .map(Number);

    const deleted = await sessionService.deleteManySessions(user.id, ids);

    reply.send(deleted);
};
