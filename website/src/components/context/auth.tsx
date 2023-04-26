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
import { TOKEN_NAME } from "@/helpers/constants";
import { formatToken } from "@/helpers/auth";
import Cookies from "js-cookie";
import type User from "@/@types/model/user";
import type { ErrorResponse } from "@/@types/api/error";
import NextCookies from "next-cookies";
import type { GetServerSidePropsContext } from "next";
import useVerifyToken from "@/hooks/queries/useVerifyToken";
import useSignOut from "@/hooks/mutations/useSignOut";

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
    signOut: () => Promise<void>;
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
    signOut: async () => {},
});

export const useAuthContext = () => useContext(UserContext);

export const getHeadersWithToken = (context?: GetServerSidePropsContext) => {
    let token;

    if (typeof window === "undefined" && context) {
        token = NextCookies(context)[TOKEN_NAME];
    } else {
        token = Cookies.get(TOKEN_NAME);
    }

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

    const signOutMutation = useSignOut();
    const dispatchSignOut = () => {
        Cookies.remove(TOKEN_NAME);
        dispatch({
            type: "LOGOUT",
        });
    };
    const signOut = async () => {
        await signOutMutation.mutateAsync();
        dispatchSignOut();
    };
    const { isFetching, isRefetching, refetch, isFetched } = useVerifyToken(
        dispatch,
        dispatchSignOut,
    );

    useEffect(() => {
        if (isFetching && !isRefetching) {
            dispatch({
                type: "LOADING",
            });
        }
    }, [isFetching, isRefetching]);

    return (
        <UserContext.Provider
            value={{
                auth: state,
                dispatch,
                signOut,
                refetchAuth: refetch,
                isFetched,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
