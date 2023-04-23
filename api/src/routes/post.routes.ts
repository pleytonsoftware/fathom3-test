import type { FastifyPluginAsync } from "fastify";
import { checkValidRequest, checkValidUser } from "../helpers/auth";
import postInputSchema from "../schemas/post/postInput";
import * as postController from "../controllers/post.controller";
import { idParamInput } from "../schemas/common";
import postEditInputSchema from "../schemas/post/postEditInput";
import addCommentInputSchema from "../schemas/post/addCommentInput";

const baseUserSubPath = "/";

/**
 * Registration of User Routes
 */
const postRoutes: FastifyPluginAsync = async (app) => {
    app.decorateRequest("authUser", "");

    /**
     * Finds all posts.
     * @function
     * @async
     * @param {Object} req - The HTTP request.
     * @param {Object} res - The HTTP response.
     */
    app.get(baseUserSubPath, postController.findAll);

    /**
     * Finds a post by ID.
     * @function
     * @async
     * @param {Object} req - The HTTP request.
     * @param {Object} res - The HTTP response.
     */
    app.get(
        `${baseUserSubPath}:id`,
        {
            schema: idParamInput,
        },
        postController.find,
    );

    /**
     * Creates a new post.
     * @function
     * @async
     * @param {Object} req - The HTTP request.
     * @param {Object} res - The HTTP response.
     */
    app.post(
        baseUserSubPath,
        {
            schema: postInputSchema,
            preHandler: [checkValidRequest, checkValidUser],
        },
        postController.create,
    );

    /**
     * Finds a post by ID and updates it.
     * @function
     * @async
     * @param {Object} req - The HTTP request.
     * @param {Object} res - The HTTP response.
     */
    app.put(
        `${baseUserSubPath}:id`,
        {
            schema: postEditInputSchema,
            preHandler: [checkValidRequest, checkValidUser],
        },
        postController.update,
    );

    /**
     * Finds a post by ID and deletes it.
     * @function
     * @async
     * @param {Object} req - The HTTP request.
     * @param {Object} res - The HTTP response.
     */
    app.delete(
        `${baseUserSubPath}:id`,
        {
            schema: idParamInput,
            preHandler: [checkValidRequest, checkValidUser],
        },
        postController.remove,
    );

    /**
     * Adds a comment to a post.
     * @function
     * @async
     * @param {Object} req - The HTTP request.
     * @param {Object} res - The HTTP response.
     */
    app.post(
        `${baseUserSubPath}:id`,
        {
            schema: addCommentInputSchema,
            preHandler: [checkValidRequest, checkValidUser],
        },
        postController.addComment,
    );
};

export const routePathPrefix = "/posts";

export default postRoutes;
