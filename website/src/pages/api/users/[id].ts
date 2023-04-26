import { API_ENDPOINTS, REQUEST_METHODS } from "@/helpers/constants";
import type { NextApiRequest, NextApiResponse } from "next";
import { safeQuery } from "@/helpers/axios";
import statusCodes from "http-status-codes";
import { EditData } from "@/@types/user/edit";

const get = async (req: NextApiRequest, res: NextApiResponse, id: string) => {
    await safeQuery({
        endpoint: API_ENDPOINTS.profile.index.replace(":id", id),
        type: REQUEST_METHODS.GET,
        res,
        headers: req.headers,
    });
};

const edit = async (req: NextApiRequest, res: NextApiResponse, id: string) => {
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
    res: NextApiResponse,
    id: string,
) => {
    await safeQuery({
        endpoint: API_ENDPOINTS.profile.index.replace(":id", id),
        type: REQUEST_METHODS.DELETE,
        res,
        headers: req.headers,
    });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (typeof req.query.id !== "string") {
        return res.status(statusCodes.BAD_REQUEST).send({
            statusCode: statusCodes.BAD_REQUEST,
            message: "Invalid parameter",
            error: "Invalid parameter",
        });
    }

    switch (req.method) {
        case REQUEST_METHODS.GET:
            return get(req, res, req.query.id);
        case REQUEST_METHODS.PUT:
            return edit(req, res, req.query.id);
        case REQUEST_METHODS.DELETE:
            return remove(req, res, req.query.id);
        default:
            return res.status(statusCodes.NOT_FOUND).end();
    }
}
