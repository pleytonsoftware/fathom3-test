import Cookies from "js-cookie";
import { PAGES, TOKEN_NAME } from "./constants";
import type { SignInDataReturn } from "@/@types/auth/signin";
import { Dispatch } from "react";
import { NextRouter } from "next/router";
import { Action } from "@/components/context";
import type { GetServerSidePropsContext } from "next";
import NextCookies from "next-cookies";

export const formatToken = (token: string | null | undefined) =>
    token ? `Bearer ${token}` : undefined;

export const onSuccessAuth = (
    data: SignInDataReturn,
    setError: Dispatch<any>,
    dispatch: (value: Action) => void,
    router: NextRouter,
) => {
    setError(null);
    Cookies.set(TOKEN_NAME, data.token, {
        expires: new Date(data.expiryDate),
    });
    dispatch({
        type: "LOGIN",
        user: data.user,
    });
    router.push(PAGES.home);
};

export const redirectIfUserIsAuthSSR = (context: GetServerSidePropsContext) => {
    const token = NextCookies(context)[TOKEN_NAME];

    if (token) {
        return {
            redirect: {
                destination: PAGES.home,
                permanent: false,
            },
        };
    }

    return {
        props: {},
    };
};

export const checkUserIsAuthSSR = (context: GetServerSidePropsContext) => {
    const token = NextCookies(context)[TOKEN_NAME];

    if (!token) {
        return {
            redirect: {
                destination: PAGES.signin,
                permanent: false,
            },
        };
    }

    return {
        props: {},
    };
};
