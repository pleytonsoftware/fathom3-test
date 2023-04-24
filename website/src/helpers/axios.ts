import type { NextApiRequest, NextApiResponse } from "next";
import type { ErrorResponse } from "@/@types/api/error";
import axios, { AxiosError, AxiosResponse } from "axios";
import { resolveAPI } from "./urlResolver";
import statusCodes from "http-status-codes";
import { REQUEST_METHODS } from "./constants";

interface QueryParam<D> {
    type?: keyof typeof REQUEST_METHODS;
    endpoint: string;
    data?: D;
    headers?: NextApiRequest["headers"];
}

export const query = async <T = any, R = AxiosResponse<T>, D = any>({
    endpoint,
    type = REQUEST_METHODS.GET,
    data,
    headers,
}: QueryParam<D>) => {
    const headersAuth = headers
        ? {
              Authorization: headers["authorization"],
          }
        : {};

    switch (type) {
        case REQUEST_METHODS.PUT:
            return axios.put<T, R, D>(resolveAPI(endpoint), data, {
                headers: headersAuth,
            });
        case REQUEST_METHODS.DELETE:
            return axios.delete<T, R, D>(resolveAPI(endpoint), {
                headers: headersAuth,
            });
        case REQUEST_METHODS.POST:
            return axios.post<T, R, D>(resolveAPI(endpoint), data, {
                headers: headersAuth,
            });
        case REQUEST_METHODS.GET:
        default:
            return axios.get<T, R, D>(resolveAPI(endpoint), {
                headers: headersAuth,
            });
    }
};

export const safeQuery = async <T = any, R = AxiosResponse<T>, D = any>({
    endpoint,
    type = REQUEST_METHODS.GET,
    data,
    headers,
    res,
}: QueryParam<D> & {
    res: NextApiResponse<T | ErrorResponse>;
}) => {
    try {
        const returnData = await query({
            endpoint,
            type,
            data,
            headers,
        });
        res.send(returnData.data);
    } catch (e) {
        const error = e as AxiosError<ErrorResponse>;
        const errorResponse = error.response!;
        res.status(errorResponse.status ?? statusCodes.INTERNAL_SERVER_ERROR);
        res.send(errorResponse.data);
    }
};
