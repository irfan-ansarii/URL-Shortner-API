import express from "express";
import cors from "cors";

import { routes } from "./routes";

import { logger } from "./core/Logger";
import { errorHandler } from "./middlewares/error-handler";
import { handler as notFoundHandler } from "./middlewares/404-handler";
import { asyncHandler } from "./middlewares/async-handler";

import { createClickController } from "./controllers/clicks";

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(cors({ origin: "*" }));

/** server */
const server = app.listen(PORT);

server.on("listening", () => {
  logger.info(`Server is running at port: ${PORT}`);
});

server.on("error", (error) => {
  logger.error("Error starting server", error);
});

/** logger */
app.use((req, res, next) => {
  logger.warn(`Log: ${req.method} - ${req.url}`);
  next();
});

/** health api */
app.get("/", (req, res) => {
  res.status(200).json({ success: true });
});

/** check short id availability */
app.get("/:shortId", asyncHandler(createClickController));

/** main app routes */
app.use("/api/v1/", routes);

/** 404 handler */
app.use(notFoundHandler);

/** global error handler */
app.use(errorHandler);

/** uncaught exceptions */
process.on("uncaughtException", () => {
  process.exit(1);
});

/** unhandled recjections */
process.on("unhandledRejection", () => {
  server.close(() => {
    process.exit(1);
  });
});

export default app;
