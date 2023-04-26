import type { ErrorResponse } from "@/@types/api/error";
import { useSnackbar } from "@/components/context/snackbar";
import { ROLES } from "@/helpers/constants";
import useAdminAddUser from "@/hooks/mutations/useAdminAddUser";
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import { useState, type FC } from "react";

export interface CreateUserDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const CreateUserDialog: FC<CreateUserDialogProps> = ({
    open,
    onClose,
    onSuccess,
}) => {
    const [error, setError] = useState<ErrorResponse | null>(null);
    const { setShowing } = useSnackbar();
    const onAddUser = () => {
        setShowing("User Added");
        onClose();
        onSuccess();
    };
    const addUserMutation = useAdminAddUser(onAddUser, setError);
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        const data = new FormData(event.currentTarget);
        const email = data.get("email")!.toString();
        const password = data.get("password")!.toString();
        const repeatPassword = data.get("repeatPassword")!.toString();
        const firstName = data.get("firstName")?.toString() || undefined;
        const lastName = data.get("lastName")?.toString() || undefined;
        const role = data.get("role")!.toString();

        if (email && password && repeatPassword && role) {
            addUserMutation.mutate({
                email,
                password,
                repeatPassword,
                firstName,
                lastName,
                role,
            });
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <Box component="form" noValidate onSubmit={handleSubmit}>
                <DialogTitle>Create new user</DialogTitle>
                <DialogContent>
                    <Grid container rowGap={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                margin="normal"
                                fullWidth
                                name="email"
                                label="Email"
                                type="email"
                                id="email"
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin="normal"
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin="normal"
                                fullWidth
                                name="repeatPassword"
                                label="Repeat Password"
                                type="password"
                                id="repeatPassword"
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin="normal"
                                fullWidth
                                name="firstName"
                                label="First Name"
                                type="text"
                                id="firstName"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin="normal"
                                fullWidth
                                name="lastName"
                                label="Last Name"
                                type="text"
                                id="lastName"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth required>
                                <InputLabel id="user-role">Role</InputLabel>
                                <Select
                                    name="role"
                                    id="role"
                                    defaultValue={ROLES.user}
                                    label="Role"
                                    labelId="user-role"
                                >
                                    {Object.entries(ROLES).map(
                                        ([key, label]) => (
                                            <MenuItem value={key} key={key}>
                                                {label}
                                            </MenuItem>
                                        ),
                                    )}
                                </Select>
                            </FormControl>
                        </Grid>
                        {error?.message && (
                            <Grid item xs={12}>
                                <Alert severity={"error"}>
                                    {error.message}
                                </Alert>
                            </Grid>
                        )}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="secondary">
                        Cancel
                    </Button>
                    <Button type="submit" autoFocus color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default CreateUserDialog;
