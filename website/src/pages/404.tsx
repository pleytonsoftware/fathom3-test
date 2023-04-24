import { MESSAGE_404_BODY, MESSAGE_404_TITLE } from "@/helpers/messages";
import { Box, Divider, Typography } from "@mui/material";
import type { NextPage } from "next";
import Image from "next/image";

const Custom404: NextPage = (props) => {
    return (
        <Box
            gap={4}
            px={10}
            pt={10}
            display="flex"
            flexDirection="column"
            alignItems="center"
        >
            <Image alt="404" src="/images/404.webp" width={360} height={135} />
            <Typography component="h2" variant="h2">
                {MESSAGE_404_TITLE}
            </Typography>
            <Typography component="h4" variant="h4">
                {MESSAGE_404_BODY}
            </Typography>
        </Box>
    );
};

export default Custom404;
