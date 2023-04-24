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
}

export default SessionService;
