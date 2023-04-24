export const resolveAPI = (path: string) => {
    // Remove the first slash from the path if it exists
    if (path.startsWith("/")) {
        path = path.substring(1);
    }

    return `${process.env.ENDPOINT}/${path}`;
};
