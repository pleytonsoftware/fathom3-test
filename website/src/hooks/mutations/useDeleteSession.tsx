import type { ErrorResponse } from "@/@types/api/error";
import type User from "@/@types/model/user";
import { SessionData } from "@/@types/session/delete";
import type { EditData } from "@/@types/user/edit";
import { getHeadersWithToken } from "@/components/context/auth";
import { API_INTERNAL_ENDPOINTS } from "@/helpers/constants";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import type { Dispatch, SetStateAction } from "react";

const useRemoveSessionsMutation = (
    setSuccess: Dispatch<SetStateAction<boolean>>,
    setError: Dispatch<SetStateAction<ErrorResponse | null>>,
    refetch: () => void,
) =>
    useMutation<boolean, AxiosError<ErrorResponse>, SessionData>(
        async ({ ids }) => {
            const response = await axios.delete(
                API_INTERNAL_ENDPOINTS.profile.sessionIds.replace(
                    ":id",
                    ids.join(","),
                ),
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
                if (data) {
                    setSuccess(true);
                    refetch();
                }
            },
            onError: (error) => {
                setError(error.response!.data);
            },
        },
    );

export default useRemoveSessionsMutation;
