/* eslint-disable @next/next/no-img-element */
import { PAGES } from "@/helpers/constants";
import useGetPosts from "@/hooks/queries/useGetPosts";
import {
    Alert,
    Box,
    CircularProgress,
    ImageList,
    ImageListItem,
    ImageListItemBar,
    Paper,
} from "@mui/material";
import { useRouter } from "next/router";
import type { FC } from "react";

const PostList: FC = () => {
    const { data, isFetching, error } = useGetPosts();
    const router = useRouter();

    const posts = data?.map((item) => (
        <Paper
            onClick={() =>
                router.push(
                    PAGES.post,
                    PAGES.post.replace(":id", item.id.toString()),
                    {
                        shallow: true,
                    },
                )
            }
            key={item.id}
            sx={{
                p: 2,
                mb: 1.5,
                transition: "transform 0.33s",
                "&:hover": {
                    transform: "scale(1.025)",
                    cursor: "pointer",
                },
            }}
        >
            <ImageListItem sx={{ marginBottom: "0 !important" }}>
                <img
                    src={item.image}
                    srcSet={item.image}
                    alt={item.title}
                    loading="lazy"
                />
                <ImageListItemBar
                    title={item.title}
                    subtitle={
                        <>
                            <span>
                                by:{" "}
                                {[
                                    item.author.firstName,
                                    item.author.lastName,
                                ].join(" ") || item.author.email}
                            </span>
                            <p>
                                Published on:{" "}
                                {new Date(
                                    item.publishedAt ?? item.createdAt,
                                ).toLocaleDateString()}
                            </p>
                            {item._count.comments >= 0 && (
                                <p>Comments: {item._count.comments}</p>
                            )}
                        </>
                    }
                    position="below"
                />
            </ImageListItem>
        </Paper>
    ));

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                maxWidth: "66vw",
                margin: "auto",
            }}
        >
            {error && <Alert severity="error">{error?.message}</Alert>}
            {isFetching ? (
                <Box alignSelf="center">
                    <CircularProgress />
                </Box>
            ) : posts ? (
                <ImageList
                    gap={24}
                    sx={{
                        p: 2,
                        width: "100%",
                        height: "100%",
                    }}
                >
                    {posts}
                </ImageList>
            ) : null}
        </Box>
    );
};

export default PostList;
