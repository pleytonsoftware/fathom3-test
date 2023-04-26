import { FC, PropsWithChildren, useState } from "react";
import Navbar from "./navbar";
import Footer, { footerHeight } from "./footer";
import { Box, Fab, lighten } from "@mui/material";
import useAppBarHeight from "@/hooks/useAppBarheight";
import { COLORS } from "@/helpers/theme";
import AddIcon from "@mui/icons-material/Add";
import { useAuthContext } from "../context/auth";
import Head from "next/head";
import dynamic from "next/dynamic";

const CreatePostDialog = dynamic(() => import("../posts/create"));

interface LayoutProps extends PropsWithChildren {}

const Layout: FC<LayoutProps> = ({ children }) => {
    const [createPostDialogIsOpen, setCreatePostDialogOpen] =
        useState<boolean>(false);
    const appBarHeight = useAppBarHeight();
    const { auth } = useAuthContext();

    const closeCreatePostDialog = () => setCreatePostDialogOpen(false);
    const openCreatePostDialog = () => setCreatePostDialogOpen(true);

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
                    marginTop: `${appBarHeight}px`,
                    minHeight: `calc(100vh - ${appBarHeight}px - ${footerHeight}px)`,
                    background: lighten(COLORS.QUATERNARY, 0.25),
                    position: "relative",
                })}
            >
                {auth.user && (
                    <>
                        <Fab
                            aria-label="Add"
                            color="primary"
                            sx={{
                                position: "fixed",
                                bottom: 42,
                                right: 42,
                                color: (theme) => theme.palette.common.white,
                            }}
                            onClick={openCreatePostDialog}
                        >
                            <AddIcon />
                        </Fab>
                        <CreatePostDialog
                            open={createPostDialogIsOpen}
                            onClose={closeCreatePostDialog}
                            onSuccess={closeCreatePostDialog}
                        />
                    </>
                )}
                {children}
            </Box>
            <Footer />
        </>
    );
};

export default Layout;
