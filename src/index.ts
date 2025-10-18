import express from "express";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";

import { config } from "./config.js";
import {
  middlewareErrorHandler,
  middlewareLogResponses,
  middlewareMetricsInc,
} from "./api/middleware.js";
import { handleMetrics } from "./api/metrics.js";
import { handleHealthCheck } from "./api/readiness.js";
import { handleReset } from "./api/reset.js";
import { handleCreateUser, handleLoginUser } from "./api/users.js";
import {
  handleChirpGetById,
  handleChirpsCreate,
  handleChirpsGet,
} from "./api/chirps.js";

const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();

app.use(express.json());
app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/api/healthz", (req, res, next) => {
  Promise.resolve(handleHealthCheck(req, res)).catch(next);
});
app.post("/api/chirps", (req, res, next) => {
  Promise.resolve(handleChirpsCreate(req, res)).catch(next);
});
app.get("/api/chirps", (req, res, next) => {
  Promise.resolve(handleChirpsGet(req, res)).catch(next);
});
app.get("/api/chirps/:chirpID", (req, res, next) => {
  Promise.resolve(handleChirpGetById(req, res)).catch(next);
});
app.post("/api/users", (req, res, next) => {
  Promise.resolve(handleCreateUser(req, res)).catch(next);
});
app.post("/api/login", (req, res, next) => {
  Promise.resolve(handleLoginUser(req, res)).catch(next);
});

app.post("/admin/reset", (req, res, next) => {
  Promise.resolve(handleReset(req, res)).catch(next);
});
app.get("/admin/metrics", (req, res, next) => {
  Promise.resolve(handleMetrics(req, res)).catch(next);
});

app.use(middlewareErrorHandler);

app.listen(config.api.port, () => {
  console.log(`Server is running at http://localhost:${config.api.port}`);
});
