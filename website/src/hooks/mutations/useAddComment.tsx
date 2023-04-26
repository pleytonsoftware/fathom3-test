import type { ErrorResponse } from "@/@types/api/error";
import { PostComment } from "@/@types/model/post";
import type { AddComment } from "@/@types/post/add";
import { getHeadersWithToken } from "@/components/context/auth";
import { API_INTERNAL_ENDPOINTS } from "@/helpers/constants";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import type { Dispatch, SetStateAction } from "react";

const useAddComment = (
    postId: string,
    onSuccess: (data: PostComment) => void,
    setError: Dispatch<SetStateAction<ErrorResponse | null>>,
) =>
    useMutation<PostComment, AxiosError<ErrorResponse>, AddComment>(
        async ({ content }) => {
            const response = await axios.post(
                API_INTERNAL_ENDPOINTS.post.index.replace(":id", postId),
                {
                    content,
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
                onSuccess(data);
            },
            onError: (error) => {
                setError(error.response!.data);
            },
        },
    );

export default useAddComment;
