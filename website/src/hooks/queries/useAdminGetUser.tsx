import { API_INTERNAL_ENDPOINTS } from "@/helpers/constants";
import useCustomQuery from ".";
import type User from "@/@types/model/user";
import type { ErrorResponse } from "@/@types/api/error";

const useAdminGetUser = (id: string) => useCustomQuery<User, ErrorResponse>({
    queryKey: ['users'], // TODO move to constants
    endpoint: API_INTERNAL_ENDPOINTS.profile.index.replace(':id', id),
    includeToken: true
});

export default useAdminGetUser;