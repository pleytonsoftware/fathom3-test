import { FC, PropsWithChildren } from "react";
import Navbar from "./navbar";
import Footer, { footerHeight } from "./footer";
import { Box, Fab } from "@mui/material";
import useAppBarHeight from "@/hooks/useAppBarheight";
import { COLORS } from "@/helpers/theme";
import AddIcon from "@mui/icons-material/Add";
import { useAuthContext } from "../context";
import Head from "next/head";

interface LayoutProps extends PropsWithChildren {}

const Layout: FC<LayoutProps> = ({ children }) => {
    const appBarHeight = useAppBarHeight();
    const { auth } = useAuthContext();

    return (
        <>
            <Head>
                <title>Fathom3 Post API Pablo Leyton</title>
                <meta
                    name="description"
                    content="Fathom3 Post API made by Pablo Leyton"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Navbar />
            <Box
                component="main"
                sx={(theme) => ({
                    p: 2,
                    px: {
                        xs: 2,
                        md: 4,
                        lg: 8,
                    },
                    height: "100%",
                    minHeight: `calc(100vh - ${appBarHeight}px - ${footerHeight}px)`,
                    background: COLORS.QUATERNARY,
                    position: "relative",
                })}
            >
                {auth.user && (
                    <Fab
                        aria-label="Add"
                        color="primary"
                        sx={{ position: "absolute", bottom: 16, right: 16 }}
                        // TODO action open modal to create post
                    >
                        <AddIcon />
                    </Fab>
                )}
                {children}
            </Box>
            <Footer />
        </>
    );
};

export default Layout;
