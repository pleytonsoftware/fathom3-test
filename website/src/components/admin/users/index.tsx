import { ErrorResponse } from "@/@types/api/error";
import User from "@/@types/model/user";
import EditableComponent, { EditableComponentProps } from "@/components/edit";
import { PAGES, ROLES } from "@/helpers/constants";
import useAdminEditUser from "@/hooks/mutations/useAdminEditUser";
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { FC, useEffect, useMemo, useState } from "react";
import { useAuthContext } from "@/components/context/auth";
import { useRouter } from "next/router";
import useAdminDeleteUser from "@/hooks/mutations/useAdminDeleteUser";
import { useSnackbar } from "@/components/context/snackbar";
import { MESSAGE_SUCCESS } from "@/helpers/messages";

export interface AdminUserProps {
    user: User;
}

const AdminUser: FC<AdminUserProps> = ({ user }) => {
    const [error, setError] = useState<ErrorResponse | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [deleteDialogIsOpen, setOpenDeleteDialog] = useState<boolean>(false);
    const { auth } = useAuthContext();
    const router = useRouter();
    const editProfileMutation = useAdminEditUser(user.id, setSuccess, setError);
    const { setShowing } = useSnackbar();

    const onSuccessDeleted = () => {
        setShowing(MESSAGE_SUCCESS);
        router.push(PAGES.admin);
    };

    const deleteProfileMutation = useAdminDeleteUser(
        user.id,
        onSuccessDeleted,
        setError,
    );

    const dataToDisplay: EditableComponentProps["dataToDisplay"] = useMemo(
        () => [
            {
                title: "Email",
                value: user.email,
            },
            {
                title: "Created Date",
                value: new Date(user.createdAt).toLocaleString(),
            },
            {
                title: "Deleted",
                value: user.deleted ? "Yes" : "No",
            },
        ],
        [user],
    );

    const editableFields: EditableComponentProps["editableFields"] = useMemo(
        () => [
            {
                id: "firstName",
                label: "First Name",
                type: "text",
                defaultValue: user.firstName,
                disabled: user.deleted,
            },
            {
                id: "lastName",
                label: "Last Name",
                type: "text",
                defaultValue: user.lastName,
                disabled: user.deleted,
            },
            {
                id: "role",
                label: "Role",
                type: "select",
                defaultValue: user.role,
                options: ROLES,
                disabled: user.deleted,
            },
        ],
        [user],
    );

    const mutate: EditableComponentProps["mutate"] = (data) => {
        const firstName = data.get("firstName")?.toString();
        const lastName = data.get("lastName")?.toString();
        const role = data.get("role")?.toString();

        editProfileMutation.mutate({
            firstName,
            lastName,
            role,
        });
    };

    const closeDeleteDialog = () => setOpenDeleteDialog(false);
    const openDeleteDialog = () => setOpenDeleteDialog(true);
    const deleteUser = () => {
        closeDeleteDialog();
        deleteProfileMutation.mutate();
    };

    const backBtn = (
        <Box alignSelf="flex-start" mb={2}>
            <Button
                onClick={() => router.push(PAGES.admin)}
                variant="outlined"
                startIcon={<KeyboardBackspaceIcon />}
                color="secondary"
            >
                Back
            </Button>
        </Box>
    );
    const deleteUserBtn = !user.deleted && auth.user?.id !== user.id && (
        <Box alignSelf="flex-end">
            <Button
                onClick={openDeleteDialog}
                disabled={deleteProfileMutation.isLoading}
                variant="outlined"
                startIcon={
                    deleteProfileMutation.isLoading ? (
                        <CircularProgress
                            size="16px"
                            sx={{
                                color: (theme) => theme.palette.grey[300],
                            }}
                        />
                    ) : (
                        <DeleteIcon />
                    )
                }
                color="error"
            >
                Delete user
            </Button>
        </Box>
    );

    return (
        <>
            {backBtn}
            <EditableComponent
                dataToDisplay={dataToDisplay}
                mutate={mutate}
                error={error}
                success={success}
                title={`${user.id} - ${user.email}`}
                subtitle="Edit profile"
                editableFields={editableFields}
            />
            {deleteUserBtn}
            <Dialog open={deleteDialogIsOpen} onClose={closeDeleteDialog}>
                <DialogTitle>Delete user: {user.email}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this user?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDeleteDialog} color="secondary">
                        Disagree
                    </Button>
                    <Button onClick={deleteUser} autoFocus color="primary">
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AdminUser;
