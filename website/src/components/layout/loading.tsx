import { FC, PropsWithChildren } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

interface LayoutProps extends PropsWithChildren {}

const LoadingLayout: FC<LayoutProps> = ({ children }) => {
    return (
        <>
            <Box
                component="main"
                sx={(theme) => ({
                    p: 2,
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    background: theme.palette.secondary.light,
                })}
            >
                <Box
                    sx={{
                        alignSelf: "center",
                        mt: "-25%",
                    }}
                >
                    <Box textAlign="center">
                        <CircularProgress />
                    </Box>
                    <br />
                    <Typography
                        maxWidth={800}
                        textAlign="center"
                        margin="auto"
                        variant="h6"
                        component="h6"
                        sx={{
                            color: (theme) =>
                                theme.palette.secondary.contrastText,
                        }}
                    >{`Looks like you've hit an authentication roadblock. Our team will help you navigate through it. In the meantime, enjoy some entertaining videos or memes while we get you authenticated.`}</Typography>
                </Box>
            </Box>
        </>
    );
};

export default LoadingLayout;
