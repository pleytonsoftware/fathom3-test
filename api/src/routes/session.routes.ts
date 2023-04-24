import type { FastifyPluginAsync } from "fastify";
import * as sessionControllers from "../controllers/session.controller";
import { checkValidRequest, checkValidUser } from "../helpers/auth";

const baseSessionSubPath = "/";

/**
 * Registration of Session Routes
 */
const sessionRoutes: FastifyPluginAsync = async (app) => {
    app.get(
        baseSessionSubPath,
        {
            preHandler: [checkValidRequest, checkValidUser],
        },
        sessionControllers.getAll,
    );

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
