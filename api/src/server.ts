import "reflect-metadata";
import Fastify from "fastify";
import pino from "pino";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import formbody from "@fastify/formbody";
import allRoutes from "./routes";
import { commonSchema } from "./helpers/validators";
import config from "./config";

// Constants
const PORT = config.PORT || 3000;

// Create Fastify App
const fastifyApp = Fastify({ logger: pino({ level: "info" }) });

// Starting up
const startServer = async () => {
    try {
        // register security and body parser
        await fastifyApp.register(formbody);
        await fastifyApp.register(cors);
        await fastifyApp.register(helmet, { contentSecurityPolicy: false });

        // Adding common schemas
        fastifyApp.addSchema(commonSchema);

        // Adding error loggs
        fastifyApp.setErrorHandler((error, request, reply) => {
            fastifyApp.log.error(error);
            reply.send(error);
        });

        // Adding routes
        await fastifyApp.register(allRoutes);

        await fastifyApp.listen({
            port: PORT,
        });
        fastifyApp.log.info(`Server started on http://localhost:3000`);
    } catch (err) {
        fastifyApp.log.error(err);
        process.exit(1);
    }
};

export default startServer;
