import type User from "../../@types/model/user";
import type { ErrorResponse } from "@/@types/api/error";
import type { AxiosError } from "axios";
import { QueryObserverBaseResult, useQuery } from "@tanstack/react-query";
import {
    FC,
    PropsWithChildren,
    createContext,
    useContext,
    useEffect,
    useReducer,
} from "react";
import axios from "axios";
import { API_INTERNAL_ENDPOINTS, TOKEN_NAME } from "@/helpers/constants";
import { formatToken } from "@/helpers/auth";
import Cookies from "js-cookie";

export type Action =
    | { type: "LOGIN"; user: User }
    | { type: "LOGOUT" }
    | { type: "LOADING" };

type Auth = {
    user: User | null;
    isLoading: boolean;
};

type UserContextType = {
    auth: Auth;
    dispatch: React.Dispatch<Action>;
    refetchAuth: QueryObserverBaseResult<
        User,
        AxiosError<ErrorResponse>
    >["refetch"];
    isFetched: boolean;
};

const initialState: Auth = {
    user: null,
    isLoading: false,
};

const userReducer = (state: Auth, action: Action): Auth => {
    switch (action.type) {
        case "LOGIN":
            return { ...state, user: action.user, isLoading: false };
        case "LOGOUT":
            return { ...state, user: null, isLoading: false };
        case "LOADING":
            return { ...state, isLoading: true };
        default:
            return state;
    }
};

export const UserContext = createContext<UserContextType>({
    auth: initialState,
    dispatch: () => null,
    refetchAuth: async () => null as any,
    isFetched: false,
});

export const useAuthContext = () => useContext(UserContext);

export const getHeadersWithToken = () => {
    const token = Cookies.get(TOKEN_NAME);

    return {
        ...(token
            ? {
                  Authorization: formatToken(Cookies.get(TOKEN_NAME)),
              }
            : {}),
    };
};

const UserProvider: FC<PropsWithChildren> = ({ children }) => {
    const [state, dispatch] = useReducer(userReducer, initialState);
    const token = Cookies.get(TOKEN_NAME);

    const { isFetching, isRefetching, refetch, isFetched } = useQuery<
        User,
        AxiosError<ErrorResponse>
    >({
        queryKey: ["authUser"], // TODO move to constants
        queryFn: async () => {
            const verifyResult = await axios.get(
                API_INTERNAL_ENDPOINTS.verify,
                {
                    headers: getHeadersWithToken(),
                },
            );
            return verifyResult.data;
        },
        onSuccess: (data) => {
            dispatch({
                type: "LOGIN",
                user: data,
            });
        },
        onError: () => {
            dispatch({
                type: "LOGOUT",
            });
        },
        retryOnMount: false,
        retry: false,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (isFetching && !isRefetching) {
            dispatch({
                type: "LOADING",
            });
        }
    }, [isFetching, isRefetching]);

    return (
        <UserContext.Provider
            value={{ auth: state, dispatch, refetchAuth: refetch, isFetched }}
        >
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
