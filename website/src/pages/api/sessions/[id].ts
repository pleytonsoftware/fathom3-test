import { API_ENDPOINTS, REQUEST_METHODS } from "@/helpers/constants";
import type { NextApiRequest, NextApiResponse } from "next";

import { safeQuery } from "@/helpers/axios";
import statusCodes from "http-status-codes";
import { ErrorResponse } from "@/@types/api/error";

const removeMany = async (
    req: NextApiRequest,
    res: NextApiResponse<boolean | ErrorResponse>,
) => {
    if (typeof req.query.id !== "string") {
        return res.status(statusCodes.BAD_REQUEST).send({
            statusCode: statusCodes.BAD_REQUEST,
            message: "Invalid parameter",
            error: "Invalid parameter",
        });
    }

    await safeQuery({
        endpoint: API_ENDPOINTS.profile.sessionIds.replace(":id", req.query.id),
        type: REQUEST_METHODS.DELETE,
        res,
        headers: req.headers,
    });
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<boolean | ErrorResponse>,
) {
    if (req.method === REQUEST_METHODS.DELETE) {
        return removeMany(req, res);
    } else {
        return res.status(statusCodes.NOT_FOUND).end();
    }
}
