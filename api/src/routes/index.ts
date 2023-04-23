import type { FastifyPluginAsync } from "fastify";
import fs from "fs";
import path from "path";

/**
 * Get the path to the routes folder
 * */
const routesPath = __dirname;

/**
 * Registers all the routes defined in the route files under the current path.
 * @param {FastifyInstance} app - The Fastify app instance.
 */
const includeRoutes: FastifyPluginAsync = async (app) => {
    await includeRouteFiles(app, routesPath);
};

/**
 * Recursively includes all route files under the given directory path and registers their routes with the app.
 * @param {FastifyInstance} app - The Fastify app instance.
 * @param {string} dir - The path of the directory to include the routes from.
 */
const includeRouteFiles = async (
    app: Parameters<FastifyPluginAsync>[0],
    dir: string,
): Promise<void> => {
    const files = await fs.promises.readdir(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = await fs.promises.stat(filePath);

        if (stat.isDirectory()) {
            await includeRouteFiles(app, filePath);
        } else if (filePath.endsWith(".routes.js")) {
            const route = require(filePath);
            const routePathPrefix = route.routePathPrefix ?? "/";
            await app.register(route, {
                prefix: routePathPrefix,
            });
        }
    }
};

export default includeRoutes;
