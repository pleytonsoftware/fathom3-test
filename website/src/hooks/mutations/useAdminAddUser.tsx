import type { ErrorResponse } from "@/@types/api/error";
import type User from "@/@types/model/user";
import type { AdminAddUser } from "@/@types/user/add";
import { getHeadersWithToken } from "@/components/context/auth";
import { API_INTERNAL_ENDPOINTS } from "@/helpers/constants";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import type { Dispatch, SetStateAction } from "react";

const useAdminAddUser = (
    onSuccess: () => void,
    setError: Dispatch<SetStateAction<ErrorResponse | null>>,
) =>
    useMutation<User, AxiosError<ErrorResponse>, AdminAddUser>(
        async ({
            email,
            password,
            repeatPassword,
            firstName,
            lastName,
            role,
        }) => {
            const response = await axios.post(
                API_INTERNAL_ENDPOINTS.users,
                {
                    email,
                    password,
                    repeatPassword,
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

export default useAdminAddUser;
