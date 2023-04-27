import prisma from "../prisma";
import { Service } from "typedi";
import type { Session, User } from "@prisma/client";

@Service()
class SessionService {
    /**
     * Create a new session for the specified user with the specified token.
     *
     * @param {User} user - The user to create the session for.
     * @param {string} token - The token to use for the session.
     * @returns {Promise<Session>} - The newly created session.
     * @throws {Error} - If no token was provided.
     */
    public async createSession(
        user: User,
        token: string,
        expiresAt: Date,
    ): Promise<Session> {
        if (!token) {
            throw new Error(
                "No token was provided, aborting session generation",
            );
        }

        const session = await prisma.session.create({
            data: {
                user: {
                    connect: {
                        id: user.id,
                    },
                },
                token,
                expiresAt,
            },
        });

        return session;
    }

    /**
     * Checks whether the session is alive or not for a user.
     * @param {number} userId - The ID of the user.
     * @param {string} token - The session token.
     * @returns {Promise<boolean>} Returns true if the session is alive for the user, otherwise returns false.
     */
    public async checkSessionIsAlive(
        userId: number,
        token: string,
    ): Promise<boolean> {
        if (!userId || !token) {
            return false;
        }

        const session = await prisma.session.findUnique({
            where: {
                token,
            },
        });

        if (!session) {
            return false;
        }

        return session.userId === userId;
    }

    /**
     * Finds all sessions for a given user.
     * @param {number} userId - The ID of the user.
     * @returns {Promise<Array<Session>>} An array of Session objects.
     */
    public async findAllSessionsForUser(
        userId: number,
    ): Promise<Array<Session>> {
        if (!userId) {
            return [];
        }

        const sessions = await prisma.session.findMany({
            where: {
                userId,
            },
        });

        return sessions;
    }

    /**
     * Deletes multiple sessions for a given user.
     * @param {number} userId - The ID of the user.
     * @param {Array<number>} sessionIds - An array of session IDs to be deleted.
     * @returns {Promise<boolean>} Returns true if at least one session was deleted, otherwise returns false.
     */
    public async deleteManySessions(
        userId: number,
        sessionIds: Array<number>,
    ): Promise<boolean> {
        if (!userId || !(sessionIds?.length > 0)) {
            return false;
        }

        const result = await prisma.session.deleteMany({
            where: {
                userId,
                id: {
                    in: sessionIds,
                },
            },
        });

        return result.count > 0;
    }

    /**
     * Deletes a session with a given token.
     * @param {string} token - The session token.
     * @returns {Promise<boolean>} Returns true if the session was deleted, otherwise returns false.
     */
    public async deleteSession(token: string): Promise<boolean> {
        if (!token) {
            return false;
        }

        const result = await prisma.session.delete({
            where: {
                token,
            },
        });

        return true;
    }
}

export default SessionService;
