import { Alert, Snackbar } from "@mui/material";
import ms from "ms";
import {
    FC,
    PropsWithChildren,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

export interface SnackBarContextType {
    setShowing: (message: string) => void;
}

export const useSnackbar = () => useContext(SnackBarContext);

export const SnackBarContext = createContext<SnackBarContextType>({
    setShowing: () => null,
});

const autoHideDuration = ms("6s");
const SnackBarProvider: FC<PropsWithChildren> = ({ children }) => {
    const [showing, setShowing] = useState<boolean>();
    const [message, setMessage] = useState<string>("");

    return (
        <SnackBarContext.Provider
            value={{
                setShowing: (message) => {
                    setMessage(message);
                    setShowing(true);
                },
            }}
        >
            <Snackbar
                open={showing}
                autoHideDuration={autoHideDuration}
                onClose={() => setShowing(false)}
            >
                <Alert severity="info">{message}</Alert>
            </Snackbar>
            {children}
        </SnackBarContext.Provider>
    );
};

export default SnackBarProvider;
