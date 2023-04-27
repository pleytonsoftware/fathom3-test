import { API_INTERNAL_ENDPOINTS, QUERY_KEYS } from "@/helpers/constants";
import useCustomQuery from ".";
import type User from "@/@types/model/user";
import type { ErrorResponse } from "@/@types/api/error";

const useAdminGetUser = (id: string) =>
    useCustomQuery<User, ErrorResponse>({
        queryKey: [QUERY_KEYS.users],
        endpoint: API_INTERNAL_ENDPOINTS.profile.index.replace(":id", id),
        includeToken: true,
    });

export default useAdminGetUser;
