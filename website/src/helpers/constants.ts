export const PAGES = {
    home: "/",
    signin: "/signin",
    signup: "/signup",
    admin: {
        index: "/admin",
        users: "/admin/users",
        user: "/admin/users/:id",
    },
    profile: {
        index: "/profile",
        sessions: "/profile/sessions",
    },
    post: "/post/:id",
} as const;

export const API_INTERNAL_ENDPOINTS = {
    signin: "/api/auth/signin",
    verify: "/api/auth/verify",
    signup: "/api/auth/signup",
    profile: {
        index: "/api/users/:id",
        sessions: "/api/sessions",
        sessionsIds: "/api/sessions/:id",
    },
} as const;

export const API_ENDPOINTS = {
    signin: "auth/signin",
    verify: "auth/verify",
    signup: "auth/signup",
    profile: {
        index: "users/:id",
        sessions: "sessions",
        sessionsIds: "sessions/:id",
    },
} as const;

export const TOKEN_NAME = "fathom3_test_pll_token";

export const REQUEST_METHODS = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE",
} as const;
