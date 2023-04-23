import type { FastifyPluginAsync } from "fastify";
import signInInputSchema from "../schemas/auth/signin";
import * as authControllers from "../controllers/auth.controller";
import userInputSchema from "../schemas/user/userInput";

/**
 * Rregistration of Auth Routes
 */
const authRoutes: FastifyPluginAsync = async (app) => {
    /**
     * Route for user sign in.
     *
     * @route POST /auth/signin
     * @group Authentication - Operations for user authentication
     * @param {object} request.body.required - The request body containing user email and password
     * @param {string} request.body.email.required - The email of the user
     * @param {string} request.body.password.required - The password of the user
     * @returns {object} 200 - An object containing user data and JWT token
     * @returns {object} 401 - Unauthorized error
     * @returns {object} 500 - Internal server error
     */
    app.post(
        "/signin",
        {
            schema: signInInputSchema,
        },
        authControllers.signin,
    );

    /**
     * Route for user sign up.
     *
     * @route POST /auth/signup
     * @group Authentication - Operations for user authentication
     * @param {object} request.body.required - The request body containing user information
     * @param {string} request.body.email.required - The email of the user
     * @param {string} request.body.password.required - The password of the user
     * @param {string} request.body.repeatPassword.required - The password of the user
     * @param {string} request.body.firstName.optional - The first name of the user
     * @param {string} request.body.lastName.optional - The last name of the user
     * @returns {object} 201 - An object containing user data and JWT token
     * @returns {object} 400 - Bad request error
     * @returns {object} 500 - Internal server error
     */
    app.post(
        "/signup",
        {
            schema: userInputSchema,
        },
        authControllers.signup,
    );
};

export const routePathPrefix = "/auth";

export default authRoutes;
