import type { ErrorResponse } from "@/@types/api/error";
import type { SignInDataReturn } from "@/@types/auth/signin";
import type { SignUpData } from "@/@types/auth/signup";
import { API_INTERNAL_ENDPOINTS } from "@/helpers/constants";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import type { Dispatch, SetStateAction } from "react";

const useSignUp = (
    onSuccess: (data: SignInDataReturn) => void,
    setError: Dispatch<SetStateAction<ErrorResponse | null>>,
) =>
    useMutation<SignInDataReturn, AxiosError<ErrorResponse>, SignUpData>(
        async ({ email, password, repeatPassword, firstName, lastName }) => {
            const response = await axios.post(API_INTERNAL_ENDPOINTS.signup, {
                email,
                password,
                repeatPassword,
                ...(firstName ? { firstName } : {}),
                ...(lastName ? { lastName } : {}),
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

export default useSignUp;
