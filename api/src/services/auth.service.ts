import prisma from "../prisma";
import Container, { Service } from "typedi";
import UserService from "./user.service";
import { Crypter } from "../helpers/crypter";
import UserInput from "../@types/models/user/input";
import JWTSigner from "../helpers/jwt";
import config from "../config";
import ms from "ms";
import type { User } from "@prisma/client";
import SessionService from "./session.service";
import { SignInOutput } from "../@types/routes/auth";
import { excludePassword } from "../helpers/user";
import statusCodes from "http-status-codes";

const JWT_EXPIRES_IN_MS = ms("1d");

@Service()
class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly sessionService: SessionService,
    ) {
        this.userService = Container.get(UserService);
        this.sessionService = Container.get(SessionService);
    }

    private async generateToken(user: User) {
        return await JWTSigner.sign(
            {
                _id: user.id,
                email: user.email,
                role: user.role,
            },
            config.JWT_SECRET,
            {
                expiresIn: JWT_EXPIRES_IN_MS,
            },
        );
    }

    /**
     * Sign in a user with the specified email and password.
     *
     * @param {string} email - The email address of the user to sign in.
     * @param {string} password - The password of the user to sign in.
     * @returns {Promise<SignInOutput|null>} - The user and session token if sign-in is successful, or null if sign-in fails.
     */
    public async signIn(
        email: string,
        password: string,
    ): Promise<SignInOutput | null> {
        const user = await prisma.user.findFirst({
            where: {
                email,
                deleted: false,
            },
        });

        if (!user) {
            return null;
        }

        const passwordMatches = await Crypter.passwordMatches(
            password,
            user.password,
        );

        if (!passwordMatches) {
            return null;
        }

        const expiryDate = new Date(Date.now() + JWT_EXPIRES_IN_MS);
        const token = await this.generateToken(user);

        const session = await this.sessionService.createSession(
            user,
            token,
            expiryDate,
        );

        if (!session) {
            return null;
        }

        return {
            user: excludePassword(user)!,
            token,
            expiryDate,
        };
    }

    /**
     * Creates a new user account and signs them in with the provided credentials.
     *
     * @param {UserInput} userCreateInput - The user input object containing the user's information.
     * @returns {Promise<SignInOutput|null>} - The user and session token if sign-in is successful, or null if sign-in fails.
     */
    public async signUp(
        userCreateInput: Omit<UserInput, "repeatPassword">,
    ): Promise<SignInOutput | null> {
        const user = await this.userService.create(userCreateInput);

        if (!user) {
            return null;
        }

        const userSignedIn = await this.signIn(
            user.email,
            userCreateInput.password,
        );

        if (!userSignedIn) {
            return null;
        }

        return userSignedIn;
    }
}

export default AuthService;
