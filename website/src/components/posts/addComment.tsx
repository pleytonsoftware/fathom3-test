import { Alert, Box, IconButton, TextField } from "@mui/material";
import { useState, type FC } from "react";
import SendIcon from "@mui/icons-material/Send";
import useAddComment from "@/hooks/mutations/useAddComment";
import { useRouter } from "next/router";
import type { ErrorResponse } from "@/@types/api/error";
import { PostComment } from "@/@types/model/post";

export interface AddCommentProps {
    onAddedComment: (newComment: PostComment) => void;
}

const AddComment: FC<AddCommentProps> = ({ onAddedComment }) => {
    const [error, setError] = useState<ErrorResponse | null>(null);
    const [content, setContent] = useState<string>("");
    const router = useRouter();
    const postId = router.query.id;

    const clearContent = () => setContent("");
    const addCommentMutation = useAddComment(
        typeof postId === "string"
            ? postId
            : Array.isArray(postId)
            ? postId[0]
            : "",
        (data) => {
            clearContent();
            onAddedComment(data);
        },
        setError,
    );

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        if (content) {
            addCommentMutation.mutate({
                content,
            });
        }
    };

    return (
        <>
            <Box
                component="form"
                noValidate
                display="flex"
                onSubmit={handleSubmit}
            >
                <TextField
                    value={content}
                    onChange={(evt) => setContent(evt.target.value)}
                    margin="normal"
                    fullWidth
                    name="content"
                    label="Content"
                    type="text"
                    id="content"
                    required
                />
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignSelf: "center",
                    }}
                >
                    <IconButton type="submit" sx={{ ml: 1 }}>
                        <SendIcon color="primary" />
                    </IconButton>
                </Box>
            </Box>
            {error && <Alert severity="error">{error?.message}</Alert>}
        </>
    );
};

export default AddComment;
