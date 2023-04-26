import type { FastifyReply } from "fastify/types/reply";
import S from "fluent-json-schema";
import { StatusCodes } from "http-status-codes";

export const commonSchema = S.object()
    .id("common")
    .definition("name", S.string().id("#name").minLength(3).maxLength(50))
    .definition("id", S.number().id("#id").minimum(1))
    .definition(
        "password",
        S.string().id("#password").minLength(6).maxLength(32),
    )
    .definition("title", S.string().id("#title").minLength(6).maxLength(80))
    .definition(
        "content",
        S.string().id("#content").minLength(20).maxLength(500),
    );

export const validatePassword = (
    password1: string,
    password2: string,
    reply: FastifyReply,
) => {
    if (password1 !== password2) {
        reply.code(StatusCodes.UNPROCESSABLE_ENTITY).send({
            message: "Password doesn't match",
            data: {
                password1,
                password2,
            },
        });
        return true;
    }
    return false;
};