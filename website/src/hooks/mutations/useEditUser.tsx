import type { ErrorResponse } from "@/@types/api/error";
import type User from "@/@types/model/user";
import type { EditData } from "@/@types/user/edit";
import { getHeadersWithToken } from "@/components/context/auth";
import { API_INTERNAL_ENDPOINTS } from "@/helpers/constants";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import type { Dispatch, SetStateAction } from "react";

const useEditUser = (
    userId: string | number,
    setSuccess: Dispatch<SetStateAction<boolean>>,
    setError: Dispatch<SetStateAction<ErrorResponse | null>>,
) =>
    useMutation<User, AxiosError<ErrorResponse>, EditData>(
        async ({ firstName, lastName }) => {
            const response = await axios.put(
                API_INTERNAL_ENDPOINTS.profile.index.replace(
                    ":id",
                    userId.toString(),
                ),
                {
                    firstName,
                    lastName,
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

export default useEditUser;
