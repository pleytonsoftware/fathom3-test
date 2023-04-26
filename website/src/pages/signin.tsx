import { useState, type FC } from "react";
import {
    Avatar,
    Box,
    Button,
    Grid,
    Link as MuiLink,
    TextField,
    Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Link from "next/link";
import { API_INTERNAL_ENDPOINTS, PAGES, TOKEN_NAME } from "@/helpers/constants";
import axios, { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { useAuthContext } from "@/components/context/auth";
import { useRouter } from "next/router";
import { redirectIfUserIsAuthSSR, onSuccessAuth } from "@/helpers/auth";
import statusCodes from "http-status-codes";
import type { SignInData, SignInDataReturn } from "@/@types/auth/signin";
import type { ErrorResponse } from "@/@types/api/error";
import useSignIn from "@/hooks/mutations/useSignIn";

const SignInPage: FC = () => {
    const [error, setError] = useState<ErrorResponse | null>(null);
    const { dispatch } = useAuthContext();
    const router = useRouter();
    const signInMutation = useSignIn((data) => {
        if (data) onSuccessAuth(data, setError, dispatch, router);
        else
            setError({
                error: "Something went wrong",
                message: `Something went wrong, data: ${data}`,
                statusCode: statusCodes.BAD_REQUEST,
            });
    }, setError);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get("email")?.toString();
        const password = data.get("password")?.toString();

        if (email && password) {
            signInMutation.mutate({ email, password });
        } else {
            setError({
                error: "Please, fill all the fields",
                message: "Please, fill all the fields",
                statusCode: statusCodes.UNPROCESSABLE_ENTITY,
            });
        }
    };

    return (
        <Grid container margin="auto" maxWidth={400}>
            <Box
                sx={{
                    my: 8,
                    mx: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyItems: "center",
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box
                    component="form"
                    noValidate
                    onSubmit={handleSubmit}
                    sx={{ mt: 1 }}
                >
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    {error?.message}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign In
                    </Button>
                    <Grid container>
                        <Grid item>
                            <MuiLink
                                href={PAGES.signup}
                                variant="body2"
                                component={Link}
                            >
                                {"Don't have an account? Sign Up"}
                            </MuiLink>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Grid>
    );
};

export const getServerSideProps = redirectIfUserIsAuthSSR;

export default SignInPage;
