import { useState, type FC, useEffect, MutableRefObject } from "react";
import {
    Alert,
    Box,
    FormControl,
    IconButton,
    InputLabel,
    LinearProgress,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    TextField,
    Toolbar,
    Tooltip,
    Typography,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import User from "@/@types/model/user";
import axios, { AxiosError } from "axios";
import { ErrorResponse } from "@/@types/api/error";
import { API_INTERNAL_ENDPOINTS, PAGES } from "@/helpers/constants";
import { QueryObserverBaseResult, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Pagination, PaginationResult } from "@/@types/api/pagination";
import ms from "ms";
import { getHeadersWithToken } from "@/components/context/auth";
import useAdminGetUsers from "@/hooks/queries/useAdminGetUsers";

const TIMEOUT_MS_FILTER = ms("1s");

const columnsDefinition = [
    {
        id: "id",
        label: "ID",
        maxWidth: 80,
    },
    {
        id: "email",
        label: "Email",
        minWidth: 240,
    },
    {
        id: "firstName",
        label: "First Name",
        minWidth: 120,
    },
    {
        id: "lastName",
        label: "Last Name",
        minWidth: 120,
    },
    {
        id: "createdAt",
        label: "Creation Date",
        minWidth: 160,
    },
    {
        id: "updatedAt",
        label: "Last Update on",
        minWidth: 160,
    },
    {
        id: "role",
        label: "Role",
    },
    {
        id: "deleted",
        label: "Deleted",
    },
];

let timeout: NodeJS.Timeout;

export interface UserListProps {
    refetchRef: MutableRefObject<(() => void) | undefined>;
}

const UserList: FC<UserListProps> = ({ refetchRef }) => {
    const [showFiltering, setShowFiltering] = useState<boolean>(false);
    const [pagination, setPagination] = useState<Pagination>({
        offset: 0,
        size: 10,
        filterby_key: columnsDefinition[0].id,
    });
    const [filterValue, setFilterValue] = useState<string>(
        pagination.filterby_value ?? "",
    );
    const [rows, setRows] = useState<Array<User>>([]);
    const [total, setTotal] = useState<number>(0);
    const router = useRouter();

    const { isFetching, refetch } = useAdminGetUsers({
        pagination,
        onSuccess: (data) => {
            if (data) {
                setRows(
                    data.data.map((user) => ({
                        ...user,
                        createdAt: new Date(user.createdAt).toLocaleString(),
                        updatedAt: new Date(user.updatedAt).toLocaleString(),
                    })),
                );
                setTotal(data.total);
            }
        },
    });

    useEffect(() => {
        refetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination]);

    useEffect(() => {
        refetchRef.current = refetch;

        return () => timeout && clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const currentPage = pagination.offset / pagination.size;
    const tableDisabler = isFetching && (
        <Box
            sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0,0,0,0)",
                zIndex: 3,
                display: "flex",
            }}
        ></Box>
    );
    const loader = (
        <LinearProgress
            sx={{ visibility: isFetching ? "visible" : "hidden" }}
        />
    );

    return (
        <Box
            width="100%"
            sx={{
                position: "relative",
            }}
        >
            {loader}
            {tableDisabler}
            <Toolbar
                sx={{
                    pl: { sm: 2 },
                    pr: { xs: 1, sm: 1 },
                }}
            >
                <Typography
                    sx={{ flex: "1 1 100%" }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    Users
                </Typography>
                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        gap: {
                            xs: 1,
                            sm: 2,
                            md: 4,
                        },
                        pr: 1,
                        transition: "opacity 0.3s",
                        opacity: showFiltering ? "1" : "0",
                        pointerEvents: showFiltering ? "auto" : "none",
                    }}
                >
                    <FormControl fullWidth required>
                        <InputLabel id="field-key">Field Name</InputLabel>
                        <Select
                            labelId="field-key"
                            value={pagination.filterby_key ?? ""}
                            label="Field Name"
                            onChange={(evt) => {
                                setPagination((prevPagination) => ({
                                    ...prevPagination,
                                    filterby_key:
                                        evt.target.value ??
                                        columnsDefinition[0].id,
                                }));
                            }}
                            variant="standard"
                            sx={{
                                minWidth: "100px",
                            }}
                        >
                            {columnsDefinition.map((column) => (
                                <MenuItem value={column.id} key={column.id}>
                                    {column.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        label="Field search"
                        value={filterValue ?? ""}
                        fullWidth
                        variant="standard"
                        onChange={(evt) => {
                            const value = evt.target.value ?? "";

                            setFilterValue(value);
                            timeout && clearTimeout(timeout);
                            timeout = setTimeout(
                                () =>
                                    setPagination((prevPagination) => ({
                                        ...prevPagination,
                                        filterby_value: value,
                                    })),
                                TIMEOUT_MS_FILTER,
                            );
                        }}
                    />
                </Box>
                <Tooltip title="Filter list">
                    <IconButton
                        onClick={() => setShowFiltering((prev) => !prev)}
                    >
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
                {pagination.filterby_value && (
                    <Tooltip title="Filter list">
                        <IconButton
                            onClick={() => {
                                setPagination(
                                    ({
                                        filterby_key,
                                        filterby_value,
                                        ...prevPagination
                                    }) => ({
                                        ...prevPagination,
                                        filterby_key: columnsDefinition[0].id,
                                    }),
                                );
                            }}
                        >
                            <ClearIcon color="error" />
                        </IconButton>
                    </Tooltip>
                )}
            </Toolbar>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columnsDefinition.map((column) => {
                                const activeCell =
                                    pagination.sortby_field === column.id;
                                const cellDirection =
                                    pagination.sortby_direction;

                                return (
                                    <TableCell
                                        key={column.id}
                                        style={{
                                            minWidth: column.minWidth,
                                            maxWidth: column.maxWidth,
                                        }}
                                        sortDirection={
                                            activeCell ? cellDirection : false
                                        }
                                    >
                                        <TableSortLabel
                                            active={activeCell}
                                            direction={
                                                activeCell
                                                    ? cellDirection
                                                    : "asc"
                                            }
                                            onClick={(evt) => {
                                                setPagination(
                                                    (prevPagination) => ({
                                                        ...prevPagination,
                                                        sortby_field: column.id,
                                                        sortby_direction:
                                                            prevPagination.sortby_direction ===
                                                            "asc"
                                                                ? "desc"
                                                                : "asc",
                                                    }),
                                                );
                                            }}
                                        >
                                            {column.label}
                                        </TableSortLabel>
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => {
                            return (
                                <TableRow
                                    hover
                                    tabIndex={-1}
                                    key={row.id}
                                    onClick={(evt) => {
                                        router.push(
                                            PAGES.users,
                                            PAGES.users.replace(
                                                ":id",
                                                row.id.toString(),
                                            ),
                                        );
                                    }}
                                    sx={{
                                        "&:hover": {
                                            cursor: "pointer",
                                        },
                                    }}
                                >
                                    {columnsDefinition.map((column) => {
                                        const value =
                                            row[column.id as keyof User];
                                        return (
                                            <TableCell key={column.id}>
                                                {value?.toString()}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            {total === 0 && (
                <Alert
                    severity="info"
                    sx={{
                        "& .MuiAlert-icon": {
                            flexGrow: 0,
                        },
                        "& .MuiAlert-message": {
                            width: "100%",
                        },
                        textAlign: "center",
                    }}
                >
                    No users were found
                </Alert>
            )}
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={total}
                rowsPerPage={pagination.size}
                page={currentPage}
                onPageChange={(evt, page) => {
                    setPagination((prevPagination) => ({
                        ...prevPagination,
                        offset: page * prevPagination.size,
                    }));
                }}
                onRowsPerPageChange={(evt) => {
                    setPagination((prevPagination) => ({
                        ...prevPagination,
                        size: Number(evt.target.value),
                        offset: 0,
                    }));
                }}
            />
        </Box>
    );
};

export default UserList;
