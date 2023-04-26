import type { FC } from "react";
import { checkUserIsAuthSSR } from "@/helpers/auth";
import { useRouter } from "next/router";
import withAdminRole from "@/components/HOC/withAdminRole";
import { Alert, Box, CircularProgress, Paper } from "@mui/material";
import useAdminGetUser from "@/hooks/queries/useAdminGetUser";
import type { GetServerSidePropsContext } from "next";
import AdminUser from "@/components/admin/users";

const AdminUserPage: FC = () => {
    const router = useRouter();

    const userId = router.query.id as string;
    const { data, isFetching, error } = useAdminGetUser(userId);

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
            {data && <AdminUser user={data} />}
            {error && <Alert severity="error">{error?.message}</Alert>}
        </Paper>
    );
};

export const getServerSideProps = async (
    context: GetServerSidePropsContext,
) => {
    const result = checkUserIsAuthSSR(context);

    if (result.redirect) {
        return result;
    }

    if (typeof context.query.id !== "string") {
        return {
            notFound: true,
        };
    }

    return {
        props: {},
    };
};

export default withAdminRole(AdminUserPage);
