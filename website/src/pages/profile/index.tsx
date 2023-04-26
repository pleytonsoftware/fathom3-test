import { useAuthContext } from "@/components/context/auth";
import { FC, useMemo, useState } from "react";
import { checkUserIsAuthSSR } from "@/helpers/auth";
import type { ErrorResponse } from "@/@types/api/error";
import EditableComponent, { EditableComponentProps } from "@/components/edit";
import useEditUser from "@/hooks/mutations/useEditUser";
import { Paper } from "@mui/material";

const SingUpPage: FC = () => {
    const [error, setError] = useState<ErrorResponse | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const { auth } = useAuthContext();

    const editProfileMutation = useEditUser(
        auth.user!.id,
        setSuccess,
        setError,
    );

    const dataToDisplay = useMemo(
        () => [
            {
                title: "Email",
                value: auth.user!.email,
            },
            {
                title: "Role",
                value: auth.user!.role,
            },
            {
                title: "Created Date",
                value: new Date(auth.user!.createdAt).toLocaleString(),
            },
        ],
        [auth],
    );

    const editableFields: EditableComponentProps["editableFields"] = useMemo(
        () => [
            {
                id: "firstName",
                label: "First Name",
                type: "text",
                defaultValue: auth.user!.firstName,
            },
            {
                id: "lastName",
                label: "Last Name",
                type: "text",
                defaultValue: auth.user!.lastName,
            },
        ],
        [auth],
    );

    const mutate: EditableComponentProps["mutate"] = (data) => {
        const firstName = data.get("firstName")?.toString();
        const lastName = data.get("lastName")?.toString();

        editProfileMutation.mutate({
            firstName,
            lastName,
        });
    };

    return (
        <Paper sx={{ p: 2 }}>
            <EditableComponent
                dataToDisplay={dataToDisplay}
                mutate={mutate}
                error={error}
                success={success}
                title="Your data"
                subtitle="Edit profile"
                editableFields={editableFields}
            />
        </Paper>
    );
};

export const getServerSideProps = checkUserIsAuthSSR;

export default SingUpPage;
