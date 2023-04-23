import dotenv from "dotenv";

// Configuration
dotenv.config();

const config: typeof process.env = {
    ...process.env,
};

export default config;
