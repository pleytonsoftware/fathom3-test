import { Prisma } from "@prisma/client";
import type { FastifySchema } from "fastify";
import S from "fluent-json-schema";

/**
 * Pagination schema validation
 */
const paginationSchema: FastifySchema = {
    querystring: S.object()
        .additionalProperties(false)
        .prop("size", S.number().minimum(1))
        .prop("offset", S.number().minimum(0))
        .prop("filterby_key", S.string())
        .prop("filterby_value", S.string())
        .prop("sortby_field", S.string())
        .prop(
            "sortby_direction",
            S.enum([Prisma.SortOrder.asc, Prisma.SortOrder.desc]),
        ),
};

export default paginationSchema;
