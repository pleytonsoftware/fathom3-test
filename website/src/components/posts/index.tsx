/* eslint-disable @next/next/no-img-element */
import type { PostDetailed } from "@/@types/model/post";
import { Alert, Box, Button, Divider, Grid, Typography } from "@mui/material";
import { useState, type FC } from "react";
import Comments from "./comments";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useRouter } from "next/router";
import { PAGES, ROLES } from "@/helpers/constants";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuthContext } from "../context/auth";
import useDeletePost from "@/hooks/mutations/useDeletePost";
import type { ErrorResponse } from "@/@types/api/error";

export interface PostItemProps {
    post: PostDetailed;
}

const PostItem: FC<PostItemProps> = ({ post }) => {
    const [error, setError] = useState<ErrorResponse | null>(null);
    const router = useRouter();
    const { auth } = useAuthContext();
    const deletePostMutation = useDeletePost(
        post.id,
        () => router.replace(PAGES.home),
        setError,
    );

    const backBtn = (
        <Grid item>
            <Button
                onClick={() => router.push(PAGES.home)}
                variant="outlined"
                startIcon={<KeyboardBackspaceIcon />}
                color="secondary"
            >
                Back
            </Button>
        </Grid>
    );
    const deleteBtn = (auth.user?.id === post.author.id ||
        auth.user?.role === ROLES.admin) && (
        <Grid item>
            <Button
                disabled={deletePostMutation.isLoading}
                onClick={() => deletePostMutation.mutate()}
                variant="outlined"
                startIcon={<DeleteIcon />}
                color="error"
            >
                Delete
            </Button>
        </Grid>
    );

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
            }}
        >
            <Grid container justifyContent="space-between" mb={2}>
                {backBtn}
                {deleteBtn}
            </Grid>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error?.message}
                </Alert>
            )}
            <img
                src={post.image}
                alt={post.title}
                loading="lazy"
                style={{
                    minHeight: "400px",
                    alignSelf: "center",
                }}
            />
            <Box
                alignSelf="center"
                display="flex"
                flexDirection="column"
                gap={2}
                mt={3}
                width="100%"
            >
                <Typography variant="h2" component="h2" textAlign="center">
                    {post.title}
                </Typography>
                <Grid container justifyContent="space-between">
                    <Grid item>
                        <Typography variant="subtitle2" component="span">
                            <PersonIcon
                                fontSize="small"
                                color="secondary"
                                sx={{ verticalAlign: "sub", mr: 1 }}
                            />
                            by:{" "}
                            {[post.author.firstName, post.author.lastName].join(
                                " ",
                            ) || post.author.email}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="subtitle2" component="span">
                            Published on{" "}
                            {new Date(
                                post.publishedAt ?? post.createdAt,
                            ).toLocaleString()}
                            <CalendarMonthIcon
                                fontSize="small"
                                color="primary"
                                sx={{ verticalAlign: "sub", ml: 1 }}
                            />
                        </Typography>
                    </Grid>
                </Grid>
                <Divider />
                <Typography variant="body1" component="p">
                    {post.content}
                </Typography>
                <Comments comments={post.comments} />
            </Box>
        </Box>
    );
};

export default PostItem;
