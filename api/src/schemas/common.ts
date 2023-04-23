import type { FastifySchema } from "fastify";
import S from "fluent-json-schema";

/**
 * Common Id Param Input schema validation
 */
export const idParamInput: FastifySchema = {
    params: S.object().prop("id", S.ref("common#id")),
};
