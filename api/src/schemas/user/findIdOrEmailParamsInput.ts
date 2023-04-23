import type { FastifySchema } from "fastify";
import S from "fluent-json-schema";

/**
 * Find by params schema validation
 */
const findParamsSchema: FastifySchema = {
    // TODO add validation messages
    params: S.object().prop("idOrEmail", S.string().minLength(1).required()),
};

export default findParamsSchema;
