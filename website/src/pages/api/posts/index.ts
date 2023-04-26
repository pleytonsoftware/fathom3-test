import { API_ENDPOINTS, REQUEST_METHODS } from "@/helpers/constants";
import type { NextApiRequest, NextApiResponse } from "next";
import { safeQuery } from "@/helpers/axios";
import { AddPost } from "@/@types/post/add";

const getAll = async (req: NextApiRequest, res: NextApiResponse) => {
    await safeQuery({
        endpoint: API_ENDPOINTS.posts,
        type: REQUEST_METHODS.GET,
        res,
    });
};

const createPost = async (req: NextApiRequest, res: NextApiResponse) => {
    const addPost = req.body as AddPost;
    await safeQuery({
        endpoint: API_ENDPOINTS.posts,
        type: REQUEST_METHODS.POST,
        data: addPost,
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
        return createPost(req, res);
    }
}
