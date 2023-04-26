import type { ErrorResponse } from "@/@types/api/error";
import { useSnackbar } from "@/components/context/snackbar";
import useCreatePost from "@/hooks/mutations/useCreatePost";
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField,
} from "@mui/material";
import { useState, type FC } from "react";

export interface CreatePostDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const CreatePostDialog: FC<CreatePostDialogProps> = ({
    open,
    onClose,
    onSuccess,
}) => {
    const [error, setError] = useState<ErrorResponse | null>(null);
    const { setShowing } = useSnackbar();
    const onAddUser = () => {
        setShowing("Post Added");
        onClose();
        onSuccess();
    };
    const createPostMutation = useCreatePost(onAddUser, setError);
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        const data = new FormData(event.currentTarget);
        const title = data.get("title")!.toString();
        const content = data.get("content")!.toString();
        const publishedDate =
            data.get("publishedDate")?.toString() || undefined;

        if (title && content) {
            createPostMutation.mutate({
                title,
                content,
                publishedDate:
                    (publishedDate && new Date(publishedDate)) || undefined,
            });
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <Box component="form" noValidate onSubmit={handleSubmit}>
                <DialogTitle>Create new post</DialogTitle>
                <DialogContent>
                    <Grid container rowGap={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                margin="normal"
                                fullWidth
                                name="title"
                                label="Title"
                                type="text"
                                id="title"
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin="normal"
                                fullWidth
                                name="content"
                                label="Content"
                                type="text"
                                id="content"
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                margin="normal"
                                fullWidth
                                name="published"
                                label="published"
                                type="date"
                                id="published"
                                required
                            />
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

export default CreatePostDialog;
