import { API_ENDPOINTS, REQUEST_METHODS } from "@/helpers/constants";
import type { NextApiRequest, NextApiResponse } from "next";

import { safeQuery } from "@/helpers/axios";
import statusCodes from "http-status-codes";
import { ErrorResponse } from "@/types/api/error";

const removeMany = async (
    req: NextApiRequest,
    res: NextApiResponse<boolean | ErrorResponse>,
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
    res: NextApiResponse<boolean | ErrorResponse>,
) {
    if (req.method === REQUEST_METHODS.DELETE) {
        removeMany(req, res);
    } else {
        res.status(statusCodes.NOT_FOUND).end();
    }
}
