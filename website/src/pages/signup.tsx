import { ErrorResponse } from "@/@types/api/error";
import { SignInDataReturn } from "@/@types/auth/signin";
import { SignUpData } from "@/@types/auth/signup";
import { useAuthContext } from "@/components/context/auth";
import { redirectIfUserIsAuthSSR, onSuccessAuth } from "@/helpers/auth";
import { API_INTERNAL_ENDPOINTS, PAGES, TOKEN_NAME } from "@/helpers/constants";
import {
    Link as MuiLink,
    Box,
    Button,
    Grid,
    TextField,
    Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import statusCodes from "http-status-codes";
import Link from "next/link";
import useSignUp from "@/hooks/mutations/useSignUp";

const SingUpPage: FC = () => {
    const [error, setError] = useState<ErrorResponse | null>(null);
    const { dispatch } = useAuthContext();
    const router = useRouter();

    const signUpMutation = useSignUp(
        (data) => onSuccessAuth(data, setError, dispatch, router),
        setError,
    );

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get("email")?.toString();
        const password = data.get("password")?.toString();
        const repeatPassword = data.get("repeatPassword")?.toString();
        const firstName = data.get("firstName")?.toString();
        const lastName = data.get("lastName")?.toString();

        if (email && password && repeatPassword) {
            signUpMutation.mutate({
                email,
                password,
                repeatPassword,
                firstName,
                lastName,
            });
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
                <Typography component="h1" variant="h5">
                    Sign up
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
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="repeatPassword"
                        label="Repeat Password"
                        type="password"
                        id="repeatPassword"
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        name="firstName"
                        label="First Name"
                        type="text"
                        id="firstName"
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        name="lastName"
                        label="Last Name"
                        type="text"
                        id="lastName"
                    />
                    {error?.message}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign Up
                    </Button>
                    <Grid container>
                        <Grid item>
                            <MuiLink
                                href={PAGES.signin}
                                variant="body2"
                                component={Link}
                            >
                                {"Already have an account? Sign In"}
                            </MuiLink>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Grid>
    );
};

export const getServerSideProps = redirectIfUserIsAuthSSR;

export default SingUpPage;
