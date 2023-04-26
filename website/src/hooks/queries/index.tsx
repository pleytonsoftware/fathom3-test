import { getHeadersWithToken } from "@/components/context/auth";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface UseCustomQueryParams<T, E> {
    queryKey: Array<string>;
    endpoint: string;
    includeToken?: boolean;
    onSuccess?: (data: T) => void;
    onError?: (error: E) => void;
    enabled?: boolean;
    queryFnParams?: () => any;
}

const useCustomQuery = <T, E>({
    queryKey,
    endpoint,
    includeToken,
    onSuccess,
    onError,
    enabled,
    queryFnParams,
}: UseCustomQueryParams<T, E>) =>
    useQuery<T, E>({
        queryKey: queryKey, // TODO move to constants
        queryFn: async () => {
            const params = queryFnParams && queryFnParams();
            const verifyResult = await axios.get(endpoint, {
                ...(params ? { params } : {}),
                ...(includeToken
                    ? {
                          headers: getHeadersWithToken(),
                      }
                    : undefined),
            });
            return verifyResult.data;
        },
        onSuccess: (data) => {
            onSuccess && onSuccess(data);
        },
        onError: (err) => {
            onError && onError(err);
        },
        retryOnMount: false,
        retry: false,
        refetchOnWindowFocus: false,
        enabled,
    });

export default useCustomQuery;
