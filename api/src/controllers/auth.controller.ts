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

const authService = Container.get(AuthService);

export const signin: RouteHandlerMethod = async (req, reply) => {
    const { email, password } = req.body as SignInInputType;

    const signInOutput = await authService.signIn(email, password);

    reply.send(signInOutput);
};

export const verify: RouteHandlerMethod = async (req, reply) => {
    const user = (req as IUserRequest).authUser;
    reply.send(user);
};

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
