import { API_INTERNAL_ENDPOINTS } from "@/helpers/constants";
import useCustomQuery from ".";
import type { ErrorResponse } from "@/@types/api/error";
import type PostItem from "@/@types/model/post";

const useGetPosts = () =>
    useCustomQuery<Array<PostItem>, ErrorResponse>({
        queryKey: ["posts"], // TODO move to constants
        endpoint: API_INTERNAL_ENDPOINTS.posts,
    });

export default useGetPosts;
