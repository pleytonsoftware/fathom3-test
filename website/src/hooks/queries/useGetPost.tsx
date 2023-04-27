import { API_INTERNAL_ENDPOINTS, QUERY_KEYS } from "@/helpers/constants";
import useCustomQuery from ".";
import type { ErrorResponse } from "@/@types/api/error";
import type { PostDetailed } from "@/@types/model/post";

const useGetPost = (id: string) =>
    useCustomQuery<PostDetailed, ErrorResponse>({
        queryKey: [QUERY_KEYS.post],
        endpoint: API_INTERNAL_ENDPOINTS.post.index.replace(":id", id),
    });

export default useGetPost;
