import type { ErrorResponse } from "@/@types/api/error";
import type User from "@/@types/model/user";
import { getHeadersWithToken } from "@/components/context/auth";
import { API_INTERNAL_ENDPOINTS } from "@/helpers/constants";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import type { Dispatch, SetStateAction } from "react";

const useAdminDeleteUser = (
    userId: string | number,
    onSuccess: () => void,
    setError: Dispatch<SetStateAction<ErrorResponse | null>>,
) =>
    useMutation<User, AxiosError<ErrorResponse>>(
        async () => {
            const response = await axios.delete(
                API_INTERNAL_ENDPOINTS.profile.index.replace(
                    ":id",
                    userId.toString(),
                ),
                {
                    headers: getHeadersWithToken(),
                },
            );
            return response.data;
        },
        {
            onMutate: (data) => {
                setError(null);
            },
            onSuccess: (data) => {
                onSuccess();
            },
            onError: (error) => {
                setError(error.response!.data);
            },
        },
    );

export default useAdminDeleteUser;
