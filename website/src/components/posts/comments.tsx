import type { PostComment } from "@/@types/model/post";
import { Alert, Box, Divider, Grid, Typography } from "@mui/material";
import { useState, type FC } from "react";
import Comment from "./comment";
import MessageIcon from "@mui/icons-material/Message";
import AddComment from "./addComment";

export interface CommentsProps {
    comments: Array<PostComment>;
}

const Comments: FC<CommentsProps> = ({ comments }) => {
    const [internalComments, setInternalComments] =
        useState<Array<PostComment>>(comments);

    return (
        <Box>
            <Typography variant="h6" component="h6" mb={2}>
                Comments <MessageIcon fontSize="small" />
            </Typography>
            {internalComments?.length ? (
                <Grid container rowGap={2}>
                    {internalComments?.map((comment, key) => (
                        <Comment comment={comment} key={key} />
                    ))}
                </Grid>
            ) : (
                <Alert severity="info">No comments yet</Alert>
            )}
            <AddComment
                onAddedComment={(newComment) =>
                    setInternalComments((prev) => [...prev, newComment])
                }
            />
        </Box>
    );
};

export default Comments;
