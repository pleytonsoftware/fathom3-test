import { useState, type FC } from "react";
import {
    Alert,
    IconButton,
    LinearProgress,
    Paper,
    Toolbar,
    Tooltip,
    Typography,
} from "@mui/material";
import {
    DataGrid,
    GridColDef,
    GridRowClassNameParams,
    GridRowParams,
} from "@mui/x-data-grid";
import { TOKEN_NAME } from "@/helpers/constants";
import { useAuthContext } from "@/components/context/auth";
import Cookies from "js-cookie";
import { checkUserIsAuthSSR } from "@/helpers/auth";
import type Session from "@/@types/model/session";
import type { ErrorResponse } from "@/@types/api/error";
import { MESSAGE_SUCCESS } from "@/helpers/messages";
import DeleteIcon from "@mui/icons-material/Delete";
import useGetSessions from "@/hooks/queries/useGetSessions";
import useRemoveSessionsMutation from "@/hooks/mutations/useDeleteSession";

interface SessionRow extends Session {
    isCurrentSession: boolean;
}

const columnsDefinition: Array<GridColDef> = [
    // {
    //     field: "id",
    //     headerName: "ID",
    //     width: 70,
    // },
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

    const {
        isFetching,
        refetch,
        error: getSessionsError,
    } = useGetSessions((data) => {
        if (data)
            setRows(
                data.map((session) => ({
                    ...session,
                    isCurrentSession: session.token === token,
                    expiresAt: new Date(session.expiresAt).toLocaleString(),
                    createdAt: new Date(session.createdAt).toLocaleString(),
                })),
            );
    }, auth.user?.id.toString());

    const removeSessionsMutation = useRemoveSessionsMutation(
        setSuccess,
        setError,
        refetch,
    );

    const numSelected = selectedRowsIds.length;
    let anyError = getSessionsError || error;

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
                            disabled={isFetching}
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
                sx={(theme) => ({
                    "& .active": {
                        background: theme.palette.success.light,
                        "&:hover": {
                            background: theme.palette.success.light,
                        },
                    },
                })}
                getRowClassName={({
                    row,
                }: GridRowClassNameParams<SessionRow>) =>
                    row.isCurrentSession ? "active" : ""
                }
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
            {isFetching && <LinearProgress />}
            {(success || anyError) && (
                <Alert
                    sx={{ mt: 1 }}
                    severity={success ? "success" : "error"}
                    variant="filled"
                >
                    {success ? MESSAGE_SUCCESS : anyError?.message}
                </Alert>
            )}
        </Paper>
    );
};

export const getServerSideProps = checkUserIsAuthSSR;

export default Sessions;
