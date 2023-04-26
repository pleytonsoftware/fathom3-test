import type { ErrorResponse } from "@/@types/api/error";
import type User from "@/@types/model/user";
import type { AdminEditData } from "@/@types/user/edit";
import { getHeadersWithToken } from "@/components/context/auth";
import { API_INTERNAL_ENDPOINTS } from "@/helpers/constants";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import type { Dispatch, SetStateAction } from "react";

const useAdminEditUser = (
    userId: string | number,
    setSuccess: Dispatch<SetStateAction<boolean>>,
    setError: Dispatch<SetStateAction<ErrorResponse | null>>,
) =>
    useMutation<User, AxiosError<ErrorResponse>, AdminEditData>(
        async ({ firstName, lastName, role }) => {
            const response = await axios.put(
                API_INTERNAL_ENDPOINTS.profile.index.replace(
                    ":id",
                    userId.toString(),
                ),
                {
                    firstName,
                    lastName,
                    role,
                },
                {
                    headers: getHeadersWithToken(),
                },
            );
            return response.data;
        },
        {
            onMutate: (data) => {
                setSuccess(false);
                setError(null);
            },
            onSuccess: (data) => {
                setSuccess(true);
            },
            onError: (error) => {
                setError(error.response!.data);
            },
        },
    );

export default useAdminEditUser;
