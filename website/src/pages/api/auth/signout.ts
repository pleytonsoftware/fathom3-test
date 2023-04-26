import { API_ENDPOINTS, REQUEST_METHODS } from "@/helpers/constants";
import type { NextApiRequest, NextApiResponse } from "next";
import { safeQuery } from "@/helpers/axios";
import statusCodes from "http-status-codes";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>,
) {
    if (req.method === REQUEST_METHODS.POST) {
        return await safeQuery({
            endpoint: API_ENDPOINTS.signout,
            type: REQUEST_METHODS.POST,
            headers: req.headers,
            res,
        });
    } else {
        return res.status(statusCodes.NOT_FOUND).end();
    }
}
