import type { FastifyPluginAsync } from "fastify";
import findParamsSchema from "../schemas/user/findIdOrEmailParamsInput";
import * as userController from "../controllers/user.controller";
import {
    checkValidRequest,
    checkValidUser,
    checkValidUserIsAdmin,
    checkValidUserUpdate,
} from "../helpers/auth";
import userInputSchema from "../schemas/user/userInput";
import userEditInputSchema from "../schemas/user/userEditInput";
import { idParamInput } from "../schemas/common";

const baseUserSubPath = "/";

/**
 * Registration of User Routes
 */
const userRoutes: FastifyPluginAsync = async (app) => {
    app.decorateRequest("authUser", "");

    /**
     * Route to find all users
     *
     * @route GET /users
     * @returns {User[]} An array of all users
     */
    app.get(
        baseUserSubPath,
        {
            preHandler: [
                checkValidRequest,
                checkValidUser,
                checkValidUserIsAdmin,
            ],
        },
        userController.findAll,
    );

    /**
     * Route to find a user by ID or email address
     *
     * @route GET /users/:idOrEmail
     * @param {string} idOrEmail - The ID or email address of the user to find
     * @returns {User} The user object with the specified ID or email address
     */
    app.get(
        `${baseUserSubPath}:idOrEmail`,
        {
            schema: findParamsSchema,
            preHandler: [
                checkValidRequest,
                checkValidUser,
                checkValidUserIsAdmin,
            ],
        },
        userController.findByIdOrEmail,
    );

    /**
     * Route to create a new user
     *
     * @route POST /users
     * @param {object} request.body.required - The request body containing user information
     * @param {string} request.body.email.required - The email of the user
     * @param {string} request.body.password.required - The password of the user
     * @param {string} request.body.repeatPassword.required - The password of the user
     * @param {string} request.body.firstName.optional - The first name of the user
     * @param {string} request.body.lastName.optional - The last name of the user
     * @returns {User} The newly created user object
     */
    app.post(
        baseUserSubPath,
        {
            schema: userInputSchema,
            preHandler: [
                checkValidRequest,
                checkValidUser,
                checkValidUserIsAdmin,
            ],
        },
        userController.create,
    );

    /**
     * Route to update a user by ID
     *
     * @route PUT /users/:id
     * @param {string} id - The ID of the user to update
     * @param {UserEditInput} userEditInput - The user properties to update
     * @returns {User} The updated user object
     */

    app.put(
        `${baseUserSubPath}:id`,
        {
            schema: userEditInputSchema,
            preHandler: [
                checkValidRequest,
                checkValidUser,
                checkValidUserUpdate,
            ],
        },
        userController.update,
    );

    /**
     * Route to delete a user by ID
     *
     * @route DELETE /users/:id
     * @param {string} id - The ID of the user to delete
     * @param {UserDeleteInput} userDeleteInput - The user object containing the deletion reason
     * @returns {boolean} True if the user was deleted successfully, false otherwise
     */
    app.delete(
        `${baseUserSubPath}:id`,
        {
            schema: idParamInput,
            preHandler: [
                checkValidRequest,
                checkValidUser,
                checkValidUserIsAdmin,
            ],
        },
        userController.remove,
    );
};

export const routePathPrefix = "/users";

export default userRoutes;
