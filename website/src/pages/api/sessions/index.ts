import { SignInDataReturn } from "@/@types/auth/signin";
import { API_ENDPOINTS, REQUEST_METHODS } from "@/helpers/constants";
import type { NextApiRequest, NextApiResponse } from "next";
import { ErrorResponse } from "@/@types/api/error";
import { safeQuery } from "@/helpers/axios";
import statusCodes from "http-status-codes";

const getAll = async (req: NextApiRequest, res: NextApiResponse<any>) => {
    await safeQuery({
        endpoint: API_ENDPOINTS.profile.sessions,
        type: REQUEST_METHODS.GET,
        res,
        headers: req.headers,
    });
};

const removeMany = async (
    req: NextApiRequest,
    res: NextApiResponse<SignInDataReturn | ErrorResponse>,
) => {
    // if (typeof req.query.ids)
    console.log({ params: req.query });
    res.status(404).end();

    // await safeQuery({
    //     endpoint: API_ENDPOINTS.profile.sessions,
    //     type: REQUEST_METHODS.DELETE,
    //     res,
    //     headers: req.headers,
    // });
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<SignInDataReturn | ErrorResponse>,
) {
    switch (req.method) {
        case REQUEST_METHODS.GET:
            getAll(req, res);
            break;
        case REQUEST_METHODS.DELETE:
            removeMany(req, res);
            break;
        default:
            res.status(statusCodes.NOT_FOUND).end();
            break;
    }
}
