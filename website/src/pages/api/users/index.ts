import { API_ENDPOINTS, REQUEST_METHODS } from "@/helpers/constants";
import type { NextApiRequest, NextApiResponse } from "next";
import { safeQuery } from "@/helpers/axios";
import { AdminAddUser } from "../../../@types/user/add";

const getAll = async (req: NextApiRequest, res: NextApiResponse) => {
    await safeQuery({
        endpoint: API_ENDPOINTS.users,
        type: REQUEST_METHODS.GET,
        res,
        headers: req.headers,
        query: req.query,
    });
};

const addUserAdmin = async (req: NextApiRequest, res: NextApiResponse) => {
    const addUser = req.body as AdminAddUser;
    await safeQuery({
        endpoint: API_ENDPOINTS.users,
        type: REQUEST_METHODS.POST,
        data: addUser,
        res,
        headers: req.headers,
    });
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method === REQUEST_METHODS.GET) {
        return getAll(req, res);
    } else if (req.method === REQUEST_METHODS.POST) {
        return addUserAdmin(req, res);
    }
}
