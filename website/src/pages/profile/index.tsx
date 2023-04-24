import { ErrorResponse } from "@/@types/api/error";
import { SignInDataReturn } from "@/@types/auth/signin";
import { getHeadersWithToken, useAuthContext } from "@/components/context";
import { API_INTERNAL_ENDPOINTS, PAGES, TOKEN_NAME } from "@/helpers/constants";
import {
    Link as MuiLink,
    Box,
    Button,
    Grid,
    TextField,
    Typography,
    Alert,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { FC, useState } from "react";
import { EditData } from "@/@types/user/edit";
import { checkUserIsAuthSSR } from "@/helpers/auth";
import { MESSAGE_SUCCESS } from "@/helpers/messages";

const SingUpPage: FC = () => {
    const [error, setError] = useState<ErrorResponse | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const { auth } = useAuthContext();

    const editProfileMutation = useMutation<
        SignInDataReturn,
        AxiosError<ErrorResponse>,
        EditData
    >(
        async ({ firstName, lastName }) => {
            const response = await axios.put(
                API_INTERNAL_ENDPOINTS.profile.index.replace(
                    ":id",
                    auth.user!.id.toString(),
                ),
                {
                    firstName,
                    lastName,
                },
                {
                    headers: getHeadersWithToken(),
                },
            );
            return response.data;
        },
        {
            onMutate: (data) => {
                setSuccess(false);
                setError(null);
            },
            onSuccess: (data) => {
                setSuccess(true);
            },
            onError: (error) => {
                setError(error.response!.data);
            },
        },
    );

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const firstName = data.get("firstName")?.toString();
        const lastName = data.get("lastName")?.toString();

        editProfileMutation.mutate({
            firstName,
            lastName,
        });
    };

    const dataToDisplay = [
        {
            title: "Email",
            value: auth.user!.email,
        },
        {
            title: "Role",
            value: auth.user!.role,
        },
        {
            title: "Created Date",
            value: new Date(auth.user!.createdAt).toLocaleString(),
        },
    ];

    return (
        <Grid container margin="auto" maxWidth={600}>
            <Box sx={{ width: "100%" }}>
                <Typography component="h1" variant="h5" textAlign="center">
                    Your data
                </Typography>
                <Box
                    sx={{
                        mx: 4,
                        mt: 1,
                        display: "flex",
                        gap: 2,
                        flexDirection: "column",
                    }}
                >
                    {dataToDisplay.map((data, index) => (
                        <Box key={index}>
                            <Typography
                                component="h6"
                                variant="h6"
                                color="primary"
                            >
                                {data.title}
                            </Typography>
                            <Typography component="p" variant="body1">
                                {data.value}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Box>
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
                    Edit profile
                </Typography>
                <Box
                    component="form"
                    noValidate
                    onSubmit={handleSubmit}
                    sx={{ mt: 1 }}
                >
                    <TextField
                        margin="normal"
                        fullWidth
                        name="firstName"
                        label="First Name"
                        type="text"
                        id="firstName"
                        defaultValue={auth.user!.firstName}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        name="lastName"
                        label="Last Name"
                        type="text"
                        id="lastName"
                        defaultValue={auth.user!.lastName}
                    />
                    {error?.message && (
                        <Alert severity="error">error.message</Alert>
                    )}
                    {success && (
                        <Alert severity="success">{MESSAGE_SUCCESS}</Alert>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Save changes
                    </Button>
                </Box>
            </Box>
        </Grid>
    );
};

export const getServerSideProps = checkUserIsAuthSSR;

export default SingUpPage;
