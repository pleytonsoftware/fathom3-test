import type { AppProps } from "next/app";
import Layout from "@/components/layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserProvider, { UserContext } from "@/components/context/auth";
import LoadingLayout from "@/components/layout/loading";
import { ThemeProvider } from "@mui/material";
import defaultTheme from "@/helpers/theme";
import SnackBarProvider from "@/components/context/snackbar";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider theme={defaultTheme}>
            <QueryClientProvider client={queryClient}>
                <UserProvider>
                    <SnackBarProvider>
                        <UserContext.Consumer>
                            {(authContext) =>
                                !authContext.isFetched ||
                                authContext.auth.isLoading ? (
                                    <LoadingLayout />
                                ) : (
                                    <Layout>
                                        <Component {...pageProps} />
                                    </Layout>
                                )
                            }
                        </UserContext.Consumer>
                    </SnackBarProvider>
                </UserProvider>
            </QueryClientProvider>
        </ThemeProvider>
    );
}
