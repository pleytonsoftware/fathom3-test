import type { NextApiRequest, NextApiResponse } from "next";
import { API_ENDPOINTS, REQUEST_METHODS } from "@/helpers/constants";
import { safeQuery } from "@/helpers/axios";
import statusCodes from "http-status-codes";
import { ErrorResponse } from "@/@types/api/error";
import User from "@/@types/model/user";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<User | ErrorResponse>,
) {
    if (req.method === REQUEST_METHODS.GET) {
        return await safeQuery({
            endpoint: API_ENDPOINTS.verify,
            headers: req.headers,
            res,
        });
    } else {
        return res.status(statusCodes.NOT_FOUND).end();
    }
}
