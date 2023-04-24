import { useState, type FC } from "react";
import {
    Alert,
    Box,
    IconButton,
    Paper,
    TableHead,
    Toolbar,
    Tooltip,
    Typography,
} from "@mui/material";
import {
    DataGrid,
    GridColDef,
    GridRowParams,
    GridValueGetterParams,
} from "@mui/x-data-grid";
import Session from "@/@types/model/session";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ErrorResponse } from "@/@types/api/error";
import { API_INTERNAL_ENDPOINTS, TOKEN_NAME } from "@/helpers/constants";
import { getHeadersWithToken, useAuthContext } from "@/components/context";
import Cookies from "js-cookie";
import { checkUserIsAuthSSR } from "@/helpers/auth";
import DeleteIcon from "@mui/icons-material/Delete";
import { MESSAGE_SUCCESS } from "@/helpers/messages";
import { SessionData } from "@/@types/session/delete";

interface SessionRow extends Session {
    isCurrentSession: boolean;
}

const columnsDefinition: Array<GridColDef> = [
    {
        field: "id",
        headerName: "ID",
        width: 70,
    },
    {
        field: "token",
        headerName: "Token",
        minWidth: 550,
    },
    {
        field: "expiresAt",
        headerName: "Expires Date",
        width: 160,
    },
    {
        field: "createdAt",
        headerName: "Creation Date",
        width: 160,
    },
    {
        field: "isCurrentSession",
        headerName: "Current Session",
        width: 120,
    },
];

const Sessions: FC = () => {
    const { auth } = useAuthContext();
    const [rows, setRows] = useState<Array<SessionRow>>([]);
    const [selectedRowsIds, setSelectedRowsIds] = useState<Array<number>>([]);
    const [error, setError] = useState<ErrorResponse | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const token = Cookies.get(TOKEN_NAME);

    const { isFetching, isRefetching, refetch, isFetched } = useQuery<
        Array<Session>,
        AxiosError<ErrorResponse>
    >({
        queryKey: ["sessions", auth.user!.id], // TODO move to constants
        queryFn: async () => {
            const verifyResult = await axios.get(
                API_INTERNAL_ENDPOINTS.profile.sessions,
                {
                    headers: getHeadersWithToken(),
                },
            );
            return verifyResult.data;
        },
        onSuccess: (data) => {
            if (data)
                setRows(
                    data.map((session) => ({
                        ...session,
                        isCurrentSession: session.token === token,
                        expiresAt: new Date(session.expiresAt).toLocaleString(),
                        createdAt: new Date(session.createdAt).toLocaleString(),
                    })),
                );
        },
        retryOnMount: false,
        retry: false,
        refetchOnWindowFocus: false,
    });
    const removeSessionsMutation = useMutation<
        boolean,
        AxiosError<ErrorResponse>,
        SessionData
    >(
        async ({ ids }) => {
            console.log({
                api: API_INTERNAL_ENDPOINTS.profile.sessionsIds.replace(
                    ":id",
                    ids.join(","),
                ),
            });
            const response = await axios.delete(
                API_INTERNAL_ENDPOINTS.profile.sessionsIds.replace(
                    ":id",
                    ids.join(","),
                ),
                {
                    headers: getHeadersWithToken(),
                },
            );
            return response.data;
        },
        {
            onMutate: (data) => {
                setSuccess(false);
                setError(null);
            },
            onSuccess: (data) => {
                setSuccess(true);
            },
            onError: (error) => {
                setError(error.response!.data);
            },
        },
    );

    const numSelected = selectedRowsIds.length;

    return (
        <Paper sx={{ width: "100%", minHeight: 350, p: 2 }}>
            <Toolbar
                sx={(theme) => ({
                    ...(numSelected > 0 && {
                        backgroundColor: theme.palette.error.main,
                        color: theme.palette.error.contrastText,
                    }),
                })}
            >
                {numSelected > 0 ? (
                    <Typography
                        sx={{ flex: "1 1 100%" }}
                        color="inherit"
                        variant="subtitle1"
                        component="div"
                    >
                        {numSelected} selected
                    </Typography>
                ) : (
                    <Typography
                        sx={{ flex: "1 1 100%" }}
                        variant="h6"
                        id="tableTitle"
                        component="div"
                    >
                        My sessions
                    </Typography>
                )}
                {numSelected > 0 && (
                    <Tooltip title="Delete">
                        <IconButton
                            sx={{
                                color: (theme) =>
                                    theme.palette.error.contrastText,
                            }}
                            onClick={() => {
                                removeSessionsMutation.mutate({
                                    ids: selectedRowsIds,
                                });
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </Toolbar>
            <DataGrid
                isRowSelectable={({ row }: GridRowParams<SessionRow>) =>
                    !row.isCurrentSession
                }
                onRowSelectionModelChange={(rowSelectionModel, details) => {
                    const ids = rowSelectionModel.filter(
                        Number,
                    ) as Array<number>;
                    setSelectedRowsIds(ids);
                }}
                density="compact"
                loading={isFetching}
                rows={rows}
                columns={columnsDefinition}
                pageSizeOptions={[5, 10, 20]}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 5,
                        },
                    },
                }}
                checkboxSelection
            />
            <Box>
                {success ||
                    (error && (
                        <Alert severity={success ? "success" : "error"}>
                            {success ? MESSAGE_SUCCESS : error?.message}
                        </Alert>
                    ))}
            </Box>
        </Paper>
    );
};

export const getServerSideProps = checkUserIsAuthSSR;

export default Sessions;
