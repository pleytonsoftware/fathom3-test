import type { FastifySchema } from "fastify";
import S from "fluent-json-schema";

/**
 * User input schema validation
 */
const userInputSchema: FastifySchema = {
    body: S.object()
        .prop("email", S.string().format("email").required())
        .prop("password", S.ref("common#password").required())
        .prop("repeatPassword", S.ref("common#password").required())
        .prop("firstName", S.ref("common#name"))
        .prop("lastName", S.ref("common#name")),
};

export default userInputSchema;
