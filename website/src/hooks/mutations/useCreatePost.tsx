import type { ErrorResponse } from "@/@types/api/error";
import type { PostDetailed } from "@/@types/model/post";
import type { AddPost } from "@/@types/post/add";
import { getHeadersWithToken } from "@/components/context/auth";
import { API_INTERNAL_ENDPOINTS } from "@/helpers/constants";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import type { Dispatch, SetStateAction } from "react";

const useCreatePost = (
    onSuccess: () => void,
    setError: Dispatch<SetStateAction<ErrorResponse | null>>,
) =>
    useMutation<PostDetailed, AxiosError<ErrorResponse>, AddPost>(
        async ({ title, content, publishedDate }) => {
            const response = await axios.post(
                API_INTERNAL_ENDPOINTS.posts,
                {
                    title,
                    content,
                    publishedDate: publishedDate?.toISOString() || undefined,
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

export default useCreatePost;
