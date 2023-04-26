import { useState, type FC, useRef } from "react";
import withAdminRole from "@/components/HOC/withAdminRole";
import { checkUserIsAuthSSR } from "@/helpers/auth";
import {
    Box,
    Button,
    Divider,
    LinearProgress,
    Paper,
    Typography,
} from "@mui/material";
import dynamic from "next/dynamic";
import AddIcon from "@mui/icons-material/Add";
import CreateUserDialog from "@/components/admin/users/create";
import { useRouter } from "next/router";
import { UserListProps } from "@/components/admin/users/list";
import { QueryObserverBaseResult } from "@tanstack/react-query";

const UserList = dynamic(() => import("@/components/admin/users/list"), {
    loading: () => (
        <Box textAlign="center" width="100%">
            <LinearProgress />
        </Box>
    ),
});

const Admin: FC = () => {
    const [addUserDialogIsOpen, setOpenAddUserDialog] =
        useState<boolean>(false);
    const refetchRef = useRef<() => void>();

    const openAddUserDialog = () => setOpenAddUserDialog(true);
    const closeAddUserDialog = () => setOpenAddUserDialog(false);

    return (
        <Paper sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
            <Box p={2}>
                <Typography component="h1" variant="h5">
                    Administration page
                </Typography>
            </Box>
            <Divider flexItem sx={{ mb: 1 }} />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    height: "100%",
                    p: 2,
                }}
            >
                <UserList refetchRef={refetchRef} />
            </Box>
            <Box alignSelf="flex-end" p={2} pt={0}>
                <Button
                    onClick={openAddUserDialog}
                    variant="outlined"
                    startIcon={<AddIcon />}
                    color="primary"
                >
                    Add user
                </Button>
            </Box>
            <CreateUserDialog
                open={addUserDialogIsOpen}
                onClose={closeAddUserDialog}
                onSuccess={() => {
                    refetchRef.current && refetchRef.current();
                }}
            />
        </Paper>
    );
};

export const getServerSideProps = checkUserIsAuthSSR;

export default withAdminRole(Admin);
