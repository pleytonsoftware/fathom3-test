import useCustomQuery from ".";
import { API_INTERNAL_ENDPOINTS, QUERY_KEYS } from "@/helpers/constants";
import type { Pagination, PaginationResult } from "@/@types/api/pagination";
import type User from "@/@types/model/user";
import type { AxiosError } from "axios";
import type { ErrorResponse } from "@/@types/api/error";

const useAdminGetUsers = ({
    pagination,
    onSuccess,
}: {
    pagination: Pagination;
    onSuccess: (data: PaginationResult<User>) => void;
}) =>
    useCustomQuery<PaginationResult<User>, AxiosError<ErrorResponse>>({
        queryKey: [QUERY_KEYS.users],
        endpoint: API_INTERNAL_ENDPOINTS.users,
        queryFnParams: () =>
            ({
                size: pagination.size,
                offset: pagination.offset,
                ...(pagination.sortby_field && pagination.sortby_direction
                    ? {
                          sortby_field: pagination.sortby_field,
                          sortby_direction: pagination.sortby_direction,
                      }
                    : {}),
                ...(pagination.filterby_key && pagination.filterby_value
                    ? {
                          filterby_key: pagination.filterby_key,
                          filterby_value: pagination.filterby_value,
                      }
                    : {}),
            } satisfies Pagination),
        includeToken: true,
        onSuccess,
    });

export default useAdminGetUsers;
