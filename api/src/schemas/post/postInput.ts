import type { FastifySchema } from "fastify";
import S from "fluent-json-schema";

/**
 * Post input schema validation
 */
const postInputSchema: FastifySchema = {
    body: S.object()
        .prop("title", S.ref("common#title").required())
        .prop("content", S.ref("common#content").required())
        .prop("publishedAt", S.string().format(S.FORMATS.DATE_TIME)),
};

export default postInputSchema;
