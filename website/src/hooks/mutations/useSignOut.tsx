import type { ErrorResponse } from "@/@types/api/error";
import { getHeadersWithToken } from "@/components/context/auth";
import { API_INTERNAL_ENDPOINTS } from "@/helpers/constants";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

const useSignOut = () =>
    useMutation<boolean, AxiosError<ErrorResponse>, void>(async () => {
        const response = await axios.post(
            API_INTERNAL_ENDPOINTS.signout,
            {},
            {
                headers: getHeadersWithToken(),
            },
        );
        return response.data;
    });

export default useSignOut;
