export const PAGES = {
    home: "/",
    signin: "/signin",
    signup: "/signup",
    admin: "/admin/users",
    profile: {
        index: "/profile",
        sessions: "/profile/sessions",
    },
    post: "/posts/:id",
    users: "/admin/users/:id",
    not_found: "/404",
} as const;

export const API_INTERNAL_ENDPOINTS = {
    signin: "/api/auth/signin",
    signout: "/api/auth/signout",
    verify: "/api/auth/verify",
    signup: "/api/auth/signup",
    profile: {
        index: "/api/users/:id",
        sessions: "/api/sessions",
        sessionIds: "/api/sessions/:id",
    },
    users: "/api/users",
    posts: "/api/posts",
    post: {
        index: "/api/posts/:id",
    },
} as const;

export const API_ENDPOINTS = {
    signin: "auth/signin",
    signout: "auth/signout",
    verify: "auth/verify",
    signup: "auth/signup",
    profile: {
        index: "users/:id",
        sessions: "sessions",
        sessionIds: "sessions/:id",
    },
    users: "users",
    posts: "posts",
    post: {
        index: "posts/:id",
    },
} as const;

export const TOKEN_NAME = "fathom3_test_pll_token";

export const REQUEST_METHODS = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE",
} as const;

export const ROLES = {
    admin: "admin",
    user: "user",
};

export const QUERY_KEYS = {
    users: "users",
    post: "post",
    posts: "posts",
    sessions: "sessions",
    authUser: "authUser",
};