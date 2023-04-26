import type { ErrorResponse } from "@/@types/api/error";
import type { AxiosError } from "axios";
import type Session from "@/@types/model/session";
import useCustomQuery from ".";
import { API_INTERNAL_ENDPOINTS } from "@/helpers/constants";

const useGetSessions = (
    onSuccess: (data: Array<Session>) => void,
    userId?: string,
) =>
    useCustomQuery<Array<Session>, AxiosError<ErrorResponse>>({
        queryKey: ["sessions", userId ?? "0"], // TODO move to constants
        endpoint: API_INTERNAL_ENDPOINTS.profile.sessions,
        includeToken: true,
        enabled: Boolean(userId),
        onSuccess,
    });

export default useGetSessions;
