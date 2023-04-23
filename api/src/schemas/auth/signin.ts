import type { FastifySchema } from "fastify";
import S from "fluent-json-schema";

/**
 * Sign In Input schema validation
 */
const signInInputSchema: FastifySchema = {
    body: S.object()
        .prop("email", S.string().format(S.FORMATS.EMAIL).required())
        .prop("password", S.ref("common#password").required()),
};

export default signInInputSchema;
