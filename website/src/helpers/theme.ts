import { ThemeOptions, createTheme } from "@mui/material";

export const COLORS = {
    PRIMARY: "#FF6969",
    SECONDARY: "#A6D0DD",
    TERTIARY: "#FFD3B0",
    QUATERNARY: "#FFF9DE",
} as const;

const theme: ThemeOptions = {
    palette: {
        primary: {
            main: COLORS.PRIMARY,
        },
        secondary: {
            main: COLORS.SECONDARY,
        },
    },
};

const defaultTheme = createTheme(theme);

export default defaultTheme;
