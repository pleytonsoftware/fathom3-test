import PostItem from "@/components/posts";
import useGetPost from "@/hooks/queries/useGetPost";
import { Alert, Box, CircularProgress, Paper } from "@mui/material";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { FC } from "react";

const PostPage: FC = () => {
    const router = useRouter();

    const postId = router.query.id as string;
    const { data, isFetching, error } = useGetPost(postId);

    return (
        <Paper
            sx={{
                p: 2,
                minHeight: "75vh",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {isFetching && (
                <Box height="100" margin="auto" display="flex">
                    <CircularProgress />
                </Box>
            )}
            {data && <PostItem post={data} />}
            {error && <Alert severity="error">{error?.message}</Alert>}
        </Paper>
    );
};

export const getServerSideProps = async (
    context: GetServerSidePropsContext,
) => {
    if (typeof context.query.id !== "string") {
        return {
            notFound: true,
        };
    }

    return {
        props: {},
    };
};

export default PostPage;
