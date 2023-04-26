import type { ErrorResponse } from "@/@types/api/error";
import type { SignInData, SignInDataReturn } from "@/@types/auth/signin";
import { API_INTERNAL_ENDPOINTS } from "@/helpers/constants";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import type { Dispatch, SetStateAction } from "react";

const useSignIn = (
    onSuccess: (data: SignInDataReturn) => void,
    setError: Dispatch<SetStateAction<ErrorResponse | null>>,
) =>
    useMutation<SignInDataReturn, AxiosError<ErrorResponse>, SignInData>(
        async ({ email, password }) => {
            const response = await axios.post(API_INTERNAL_ENDPOINTS.signin, {
                email,
                password,
            });
            return response.data;
        },
        {
            onSuccess,
            onError: (error) => {
                setError(error.response!.data);
            },
        },
    );

export default useSignIn;
