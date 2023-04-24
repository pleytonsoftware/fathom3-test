import { SignInDataReturn } from "@/@types/auth/signin";
import { API_ENDPOINTS, REQUEST_METHODS } from "@/helpers/constants";
import type { NextApiRequest, NextApiResponse } from "next";
import { ErrorResponse } from "@/@types/api/error";
import { safeQuery } from "@/helpers/axios";
import { SignUpData } from "@/@types/auth/signup";
import statusCodes from "http-status-codes";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<SignInDataReturn | ErrorResponse>,
) {
    if (req.method === REQUEST_METHODS.POST) {
        const signUpData = req.body as SignUpData;
        await safeQuery({
            endpoint: API_ENDPOINTS.signup,
            type: REQUEST_METHODS.POST,
            data: signUpData,
            res,
        });
    } else {
        res.status(statusCodes.NOT_FOUND).end();
    }
}
