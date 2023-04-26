import { useAuthContext } from "../context/auth";
import { ROLES } from "@/helpers/constants";
import { MESSAGE_UNAUTHORIZED } from "@/helpers/messages";
import { Box, Typography } from "@mui/material";
import type { ComponentType, FC } from "react";

function withAdminRole(Component: ComponentType<any>) {
    return function WrappedComponent(props: FC) {
        const { auth } = useAuthContext();
        if (auth.user?.role === ROLES.admin) {
            return <Component {...props} />;
        } else {
            return (
                <Box
                    display="flex"
                    flexDirection="column"
                    gap={2}
                    justifyContent="center"
                    sx={{
                        top: "33%",
                        transform: "translateY(-50%)",
                        position: "absolute",
                        width: "100%",
                    }}
                >
                    <Typography component="h1" textAlign="center" variant="h1">
                        402
                    </Typography>
                    <Typography component="h3" textAlign="center" variant="h3">
                        Unauthorized request
                    </Typography>
                    <Typography component="h6" textAlign="center" variant="h6">
                        {MESSAGE_UNAUTHORIZED}
                    </Typography>
                </Box>
            );
        }
    };
}

export default withAdminRole;
