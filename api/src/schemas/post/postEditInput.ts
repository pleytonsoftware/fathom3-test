import type { FastifySchema } from "fastify";
import S from "fluent-json-schema";
import { idParamInput } from "../common";

/**
 * Post Edit Input body and params schema validation
 */
const postEditInputSchema: FastifySchema = {
    body: S.object()
        .prop("title", S.ref("common#title").required())
        .prop("content", S.ref("common#content").required()),
    ...idParamInput,
};

export default postEditInputSchema;
