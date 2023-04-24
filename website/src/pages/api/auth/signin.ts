import { SignInData, SignInDataReturn } from "@/@types/auth/signin";
import { API_ENDPOINTS, REQUEST_METHODS } from "@/helpers/constants";
import type { NextApiRequest, NextApiResponse } from "next";
import { ErrorResponse } from "@/@types/api/error";
import { safeQuery } from "@/helpers/axios";
import statusCodes from "http-status-codes";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<SignInDataReturn | ErrorResponse>,
) {
    if (req.method === REQUEST_METHODS.POST) {
        const signInData = req.body as SignInData;
        await safeQuery({
            endpoint: API_ENDPOINTS.signin,
            type: REQUEST_METHODS.POST,
            data: signInData,
            res,
        });
    } else {
        res.status(statusCodes.NOT_FOUND).end();
    }
}
