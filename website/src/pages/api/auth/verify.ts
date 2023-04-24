import type User from "@/@types/model/user";
import type { NextApiRequest, NextApiResponse } from "next";
import { API_ENDPOINTS, REQUEST_METHODS } from "@/helpers/constants";
import { ErrorResponse } from "@/@types/api/error";
import { safeQuery } from "@/helpers/axios";
import statusCodes from "http-status-codes";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<User | ErrorResponse>,
) {
    if (req.method === REQUEST_METHODS.GET) {
        await safeQuery({
            endpoint: API_ENDPOINTS.verify,
            headers: req.headers,
            res,
        });
    } else {
        res.status(statusCodes.NOT_FOUND).end();
    }
}
