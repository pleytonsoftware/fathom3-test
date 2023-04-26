import { ErrorResponse } from "@/@types/api/error";
import { MESSAGE_SUCCESS } from "@/helpers/messages";
import {
    Alert,
    Box,
    Button,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import {
    FC,
    Fragment,
    InputHTMLAttributes,
    PropsWithChildren,
    useState,
} from "react";

export interface EditableField {
    id: string;
    label: string;
    defaultValue?: string | null;
    type: InputHTMLAttributes<any>["type"] | "select";
    options?: Record<string, string>;
    disabled?: boolean;
}

export interface EditableComponentProps {
    mutate: (data: FormData) => void;
    dataToDisplay: Array<Record<string, string>>;
    title: string;
    subtitle: string;
    error?: ErrorResponse | null;
    success?: boolean;
    editableFields: Array<EditableField>;
}

const EditableComponent: FC<EditableComponentProps> = ({
    mutate,
    dataToDisplay,
    title,
    subtitle,
    error,
    success,
    editableFields,
}) => {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        mutate(data);
    };

    return (
        <Grid container margin="auto" maxWidth={600}>
            <Box sx={{ width: "100%" }}>
                <Typography component="h1" variant="h5" textAlign="center">
                    {title}
                </Typography>
                {dataToDisplay?.length && (
                    <Grid
                        container
                        rowGap={2}
                        sx={{
                            mx: 4,
                            mt: 1,
                        }}
                    >
                        {dataToDisplay.map((data, index) => (
                            <Grid item xs={12} sm={6} key={index}>
                                <Typography
                                    component="h6"
                                    variant="h6"
                                    color="primary"
                                >
                                    {data.title}
                                </Typography>
                                <Typography component="p" variant="body1">
                                    {data.value}
                                </Typography>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
            <Box
                sx={{
                    my: 8,
                    mx: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyItems: "center",
                }}
            >
                <Typography component="h1" variant="h5">
                    {subtitle}
                </Typography>
                <Grid
                    container
                    rowGap={2}
                    component="form"
                    noValidate
                    onSubmit={handleSubmit}
                    sx={{ mt: 1 }}
                >
                    {editableFields.map((field) =>
                        field.type === "select" ? (
                            <Grid item xs={12} key={field.id}>
                                <FormControl fullWidth required>
                                    <InputLabel id="user-role">Role</InputLabel>
                                    <Select
                                        disabled={field.disabled}
                                        name={field.id}
                                        id={field.id}
                                        defaultValue={field.defaultValue}
                                        label={field.label}
                                        labelId="user-role"
                                    >
                                        {field.options &&
                                            Object.entries(field.options).map(
                                                ([key, label]) => (
                                                    <MenuItem
                                                        value={key}
                                                        key={key}
                                                    >
                                                        {label}
                                                    </MenuItem>
                                                ),
                                            )}
                                    </Select>
                                </FormControl>
                            </Grid>
                        ) : (
                            <Grid item xs={12} key={field.id}>
                                <TextField
                                    disabled={field.disabled}
                                    margin="normal"
                                    fullWidth
                                    name={field.id}
                                    label={field.label}
                                    type={field.type}
                                    id={field.id}
                                    defaultValue={field.defaultValue}
                                />
                            </Grid>
                        ),
                    )}
                    {(success || error?.message) && (
                        <Grid item xs={12}>
                            <Alert severity={success ? "success" : "error"}>
                                {success ? MESSAGE_SUCCESS : error?.message}
                            </Alert>
                        </Grid>
                    )}
                    <Button type="submit" fullWidth variant="contained">
                        Save changes
                    </Button>
                </Grid>
            </Box>
        </Grid>
    );
};

export default EditableComponent;
