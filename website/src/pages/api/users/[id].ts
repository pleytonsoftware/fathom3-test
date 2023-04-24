import { SignInData, SignInDataReturn } from "@/@types/auth/signin";
import { API_ENDPOINTS, REQUEST_METHODS } from "@/helpers/constants";
import type { NextApiRequest, NextApiResponse } from "next";
import { ErrorResponse } from "@/@types/api/error";
import { safeQuery } from "@/helpers/axios";
import { EditData } from "@/@types/user/edit";
import statusCodes from "http-status-codes";

const get = async (
    req: NextApiRequest,
    res: NextApiResponse<SignInDataReturn | ErrorResponse>,
    id: string,
) => {
    await safeQuery({
        endpoint: API_ENDPOINTS.profile.index.replace(":id", id),
        type: REQUEST_METHODS.GET,
        res,
        headers: req.headers,
    });
};

const edit = async (
    req: NextApiRequest,
    res: NextApiResponse<SignInDataReturn | ErrorResponse>,
    id: string,
) => {
    const editData = req.body as EditData;
    await safeQuery({
        endpoint: API_ENDPOINTS.profile.index.replace(":id", id),
        type: REQUEST_METHODS.PUT,
        data: editData,
        res,
        headers: req.headers,
    });
};

const remove = async (
    req: NextApiRequest,
    res: NextApiResponse<SignInDataReturn | ErrorResponse>,
    id: string,
) => {
    await safeQuery({
        endpoint: API_ENDPOINTS.profile.index.replace(":id", id),
        type: REQUEST_METHODS.DELETE,
        res,
        headers: req.headers,
    });
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<SignInDataReturn | ErrorResponse>,
) {
    if (typeof req.query.id !== "string") {
        return res.status(statusCodes.BAD_REQUEST).send({
            statusCode: statusCodes.BAD_REQUEST,
            message: "Invalid parameter",
            error: "Invalid parameter",
        });
    }

    switch (req.method) {
        case REQUEST_METHODS.GET:
            get(req, res, req.query.id);
            break;
        case REQUEST_METHODS.PUT:
            edit(req, res, req.query.id);
            break;
        case REQUEST_METHODS.DELETE:
            remove(req, res, req.query.id);
            break;
        default:
            res.status(statusCodes.NOT_FOUND).end();
            break;
    }
}
