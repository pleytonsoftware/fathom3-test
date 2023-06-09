import type { RouteHandlerMethod } from "fastify";
import type {
    IUserRequest,
    SignInInput as SignInInputType,
} from "../@types/routes/auth";
import type UserInput from "../@types/models/user/input";
import AuthService from "../services/auth.service";
import Container from "typedi";
import { validatePassword } from "../helpers/validators";
import UserService from "../services/user.service";
import statusCodes from "http-status-codes";
import SessionService from "../services/session.service";

const authService = Container.get(AuthService);

/**
 * Handles user sign in requests.
 * @function
 * @async
 * @param {import('fastify').FastifyRequest} req - The HTTP request object.
 * @param {import('fastify').FastifyReply} reply - The HTTP response object.
 * @returns {Promise<void>}
 */
export const signin: RouteHandlerMethod = async (req, reply) => {
    const { email, password } = req.body as SignInInputType;

    const signInOutput = await authService.signIn(email, password);

    if (!signInOutput) {
        return reply.code(statusCodes.UNAUTHORIZED).send({
            message: "Email or password are not valid",
        });
    }

    reply.send(signInOutput);
};

/**
 * Handles user verification requests.
 * @function
 * @async
 * @param {import('../types').IUserRequest} req - The HTTP request object, which must contain an authenticated user.
 * @param {import('fastify').FastifyReply} reply - The HTTP response object.
 * @returns {Promise<void>}
 */
export const verify: RouteHandlerMethod = async (req, reply) => {
    const user = (req as IUserRequest).authUser;
    reply.send(user);
};

/**
 * Handles user sign up requests.
 * @function
 * @async
 * @param {import('fastify').FastifyRequest} req - The HTTP request object.
 * @param {import('fastify').FastifyReply} reply - The HTTP response object.
 * @returns {Promise<void>}
 */
export const signup: RouteHandlerMethod = async (req, reply) => {
    const userService = Container.get(UserService);
    const { email, password, repeatPassword, firstName, lastName } =
        req.body as UserInput;

    if (validatePassword(password, repeatPassword, reply)) {
        return;
    }

    try {
        const userExists = await userService.findByEmail(email, {
            excludeDeleted: false,
        });

        if (userExists) {
            return reply
                .code(statusCodes.NOT_FOUND)
                .send({ message: "User already exists", data: email });
        }

        const signInOutput = await authService.signUp({
            email,
            password,
            firstName,
            lastName,
        });

        reply.code(statusCodes.CREATED).send(signInOutput);
    } catch (error) {
        reply
            .code(statusCodes.INTERNAL_SERVER_ERROR)
            .send({ message: "Error creating user", error });
    }
};

/**
 * Handles user sign out requests.
 * @function
 * @async
 * @param {import('fastify').FastifyRequest} req - The HTTP request object.
 * @param {import('fastify').FastifyReply} reply - The HTTP response object.
 * @returns {Promise<void>}
 */
export const signout: RouteHandlerMethod = async (req, reply) => {
    let token = req.headers.authorization;

    if (token) {
        const sessionService = Container.get(SessionService);
        token = token.replace("Bearer ", "");
        await sessionService.deleteSession(token);
    }

    reply.send();
};
