import type { FastifySchema } from "fastify";
import S from "fluent-json-schema";
import { idParamInput } from "../common";
import ROLES from "../../@types/models/user/roles";

/**
 * User Edit Input body and params schema validation
 */
const userEditInputSchema: FastifySchema = {
    body: S.object()
        .prop("firstName", S.ref("common#name"))
        .prop("lastName", S.ref("common#name"))
        .prop("role", S.string().enum([ROLES.admin, ROLES.user])),
    ...idParamInput,
};

export default userEditInputSchema;
