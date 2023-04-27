import {
    API_INTERNAL_ENDPOINTS,
    QUERY_KEYS,
    TOKEN_NAME,
} from "@/helpers/constants";
import useCustomQuery from ".";
import type { Dispatch } from "react";
import type { Action } from "@/components/context/auth";
import type { AxiosError } from "axios";
import type User from "@/@types/model/user";
import type { ErrorResponse } from "@/@types/api/error";

const useVerifyToken = (dispatch: Dispatch<Action>, signOut: () => void) =>
    useCustomQuery<User, AxiosError<ErrorResponse>>({
        queryKey: [QUERY_KEYS.authUser],
        endpoint: API_INTERNAL_ENDPOINTS.verify,
        includeToken: true,
        onSuccess: (data) => {
            dispatch({
                type: "LOGIN",
                user: data,
            });
        },
        onError: () => {
            signOut();
        },
    });

export default useVerifyToken;
