import type { FastifyPluginAsync } from "fastify";
import * as sessionControllers from "../controllers/session.controller";
import { checkValidRequest, checkValidUser } from "../helpers/auth";

const baseSessionSubPath = "/";

/**
 * Registration of Session Routes
 */
const sessionRoutes: FastifyPluginAsync = async (app) => {
    /**
     * Route handler for getting all sessions.
     * @name getAll
     * @function
     * @async
     * @param {Object} req - Request object.
     * @param {Object} reply - Reply object.
     */
    app.get(
        baseSessionSubPath,
        {
            preHandler: [checkValidRequest, checkValidUser],
        },
        sessionControllers.getAll,
    );

    /**
     * Route handler for deleting multiple sessions.
     * @name deleteMany
     * @function
     * @async
     * @param {Object} req - Request object.
     * @param {Object} reply - Reply object.
     */
    app.delete(
        `${baseSessionSubPath}:ids`,
        {
            preHandler: [checkValidRequest, checkValidUser],
        },
        sessionControllers.deleteMany,
    );
};

export const routePathPrefix = "/sessions";

export default sessionRoutes;
