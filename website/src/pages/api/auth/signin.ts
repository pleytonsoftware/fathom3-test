import { API_ENDPOINTS, REQUEST_METHODS } from "@/helpers/constants";
import type { NextApiRequest, NextApiResponse } from "next";
import { safeQuery } from "@/helpers/axios";
import statusCodes from "http-status-codes";
import type { SignInData, SignInDataReturn } from "@/@types/auth/signin";
import type { ErrorResponse } from "@/@types/api/error";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<SignInDataReturn | ErrorResponse>,
) {
    if (req.method === REQUEST_METHODS.POST) {
        const signInData = req.body as SignInData;
        return await safeQuery({
            endpoint: API_ENDPOINTS.signin,
            type: REQUEST_METHODS.POST,
            data: signInData,
            res,
        });
    } else {
        return res.status(statusCodes.NOT_FOUND).end();
    }
}
