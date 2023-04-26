import { API_ENDPOINTS, REQUEST_METHODS } from "@/helpers/constants";
import type { NextApiRequest, NextApiResponse } from "next";
import { safeQuery } from "@/helpers/axios";
import statusCodes from "http-status-codes";
import type { SignInDataReturn } from "@/@types/auth/signin";
import type { ErrorResponse } from "@/@types/api/error";
import type { SignUpData } from "@/@types/auth/signup";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<SignInDataReturn | ErrorResponse>,
) {
    if (req.method === REQUEST_METHODS.POST) {
        const signUpData = req.body as SignUpData;
        return await safeQuery({
            endpoint: API_ENDPOINTS.signup,
            type: REQUEST_METHODS.POST,
            data: signUpData,
            res,
        });
    } else {
        return res.status(statusCodes.NOT_FOUND).end();
    }
}
