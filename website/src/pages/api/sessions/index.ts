import { API_ENDPOINTS, REQUEST_METHODS } from "@/helpers/constants";
import type { NextApiRequest, NextApiResponse } from "next";
import { safeQuery } from "@/helpers/axios";

const getAll = async (req: NextApiRequest, res: NextApiResponse) => {
    await safeQuery({
        endpoint: API_ENDPOINTS.profile.sessions,
        type: REQUEST_METHODS.GET,
        res,
        headers: req.headers,
    });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === REQUEST_METHODS.GET) {
        return getAll(req, res);
    }
}
