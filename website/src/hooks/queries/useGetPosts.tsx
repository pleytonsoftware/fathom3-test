import { API_INTERNAL_ENDPOINTS, QUERY_KEYS } from "@/helpers/constants";
import useCustomQuery from ".";
import type { ErrorResponse } from "@/@types/api/error";
import type PostItem from "@/@types/model/post";

const useGetPosts = () =>
    useCustomQuery<Array<PostItem>, ErrorResponse>({
        queryKey: [QUERY_KEYS.posts],
        endpoint: API_INTERNAL_ENDPOINTS.posts,
    });

export default useGetPosts;
