import { Box, Grid, Typography } from "@mui/material";
import type { FC } from "react";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LinkIcon from "@mui/icons-material/Link";

export const footerHeight = 100;

const links = [
    {
        href: "https://www.linkedin.com/in/pablo-jose-leyton-lozano-a638b158/",
        Icon: LinkedInIcon,
        text: "linkedin",
    },
    {
        href: "https://www.pleytonsoftware.com/",
        Icon: LinkIcon,
        text: "website",
    },
];

const Footer: FC = () => {
    return (
        <Box
            sx={{
                px: 6,
                py: 2,
                minHeight: footerHeight,
                bgcolor: (theme) => theme.palette.primary.light,
                display: "flex",
                "*": {
                    color: (theme) => theme.palette.primary.contrastText,
                },
                flexDirection: {
                    xs: "column",
                    md: "row",
                },
            }}
        >
            <Box display="flex">
                <Grid container>
                    {links.map((link, index) => (
                        <Grid item xs={12} key={index}>
                            <Typography
                                component="a"
                                href={link.href}
                                target="_blank"
                                sx={{
                                    textDecoration: "none",
                                }}
                            >
                                <link.Icon sx={{ verticalAlign: "middle" }} />{" "}
                                {link.text}
                            </Typography>
                        </Grid>
                    ))}
                </Grid>
            </Box>
            <Box
                sx={{
                    flexGrow: {
                        xs: 0,
                        md: 1,
                    },
                }}
            />
            <Box
                display="flex"
                textAlign={{
                    xs: "left",
                    md: "right",
                }}
            >
                Copyright © {new Date().getFullYear()} Pablo Leyton
                (pleytonsoftware).
                <br /> All rights reserved.
            </Box>
        </Box>
    );
};

export default Footer;
