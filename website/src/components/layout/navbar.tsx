import {
    AppBar,
    Avatar,
    Box,
    Button,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
} from "@mui/material";
import { useState, FC, MouseEventHandler } from "react";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useRouter } from "next/router";
import { PAGES, TOKEN_NAME } from "@/helpers/constants";
import { useAuthContext } from "../context/auth";
import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";

// TODO send to ts file
interface NavigationItem {
    text: string;
    href: string;
    showIfRole?: ShowIfRoleType;
}
type ShowIfRoleType = "admin" | "user" | "all";

const navigation: Array<NavigationItem> = [
    {
        text: "Home",
        href: PAGES.home,
    },
    {
        text: "My sessions",
        href: PAGES.profile.sessions,
        showIfRole: "all",
    },
    {
        text: "Admin",
        href: PAGES.admin,
        showIfRole: "admin",
    },
];

const Navbar: FC = () => {
    const router = useRouter();
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const { auth, signOut } = useAuthContext();

    const closeMenu = () => {
        setAnchorEl(null);
    };
    const openMenu: MouseEventHandler<HTMLElement> = (event) => {
        setAnchorEl(event.currentTarget);
    };

    return (
        <Box>
            <AppBar
                position="fixed"
                sx={{
                    background: (theme) => theme.palette.secondary.main,
                }}
            >
                <Toolbar sx={{}}>
                    <Link href={PAGES.home}>
                        <Image
                            src="/logo.svg"
                            alt="Fathom3 Post API"
                            width={32}
                            height={32}
                            style={{
                                verticalAlign: "middle",
                            }}
                        />
                    </Link>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{
                            display: {
                                xs: "none",
                                sm: "block",
                            },
                            color: (theme) =>
                                theme.palette.secondary.contrastText,
                            pl: 2,
                        }}
                    >
                        Fathom3 Post API
                    </Typography>
                    <Box
                        sx={{
                            pl: 2,
                            display: "flex",
                        }}
                    >
                        {navigation
                            .filter(
                                (page) =>
                                    !Boolean(page.showIfRole) ||
                                    page.showIfRole === auth.user?.role ||
                                    (page.showIfRole === "all" && auth.user),
                            )
                            .map((page, index) => (
                                <Button
                                    LinkComponent={Link}
                                    key={index}
                                    href={page.href}
                                    sx={{
                                        my: 2,
                                        color: (theme) =>
                                            theme.palette.primary.contrastText,
                                        display: "block",
                                    }}
                                >
                                    {page.text}
                                </Button>
                            ))}
                    </Box>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: "flex" }}>
                        <IconButton
                            onClick={(evt) =>
                                auth.user
                                    ? openMenu(evt)
                                    : router.push(PAGES.signin)
                            }
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-haspopup="true"
                            color="inherit"
                        >
                            {auth.user ? (
                                <Avatar
                                    sx={{
                                        background: (theme) =>
                                            theme.palette.primary.main,
                                        boxShadow: 1,
                                    }}
                                >
                                    {auth.user.firstName || auth.user.lastName
                                        ? [
                                              auth.user.firstName,
                                              auth.user.lastName,
                                          ]
                                              .filter(Boolean)
                                              .map((v) => v?.charAt(0))
                                              .join("")
                                        : auth.user.email?.charAt(0)}
                                </Avatar>
                            ) : (
                                <AccountCircle fontSize="large" />
                            )}
                        </IconButton>
                        <Menu
                            id="auth-menu"
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={closeMenu}
                        >
                            <MenuItem
                                onClick={() => {
                                    closeMenu();
                                    router.push(PAGES.profile.index);
                                }}
                            >
                                Profile
                            </MenuItem>
                            <MenuItem
                                onClick={async () => {
                                    closeMenu();
                                    await signOut();
                                    router.pathname !== PAGES.home
                                        ? router.push(PAGES.home)
                                        : router.reload();
                                }}
                            >
                                Logout
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default Navbar;
