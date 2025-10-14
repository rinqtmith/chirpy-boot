import express from "express";

import { handleMetrics } from "./api/metrics.js";
import {
  middlewareErrorHandler,
  middlewareLogResponses,
  middlewareMetricsInc,
} from "./api/middleware.js";
import { handleHealthCheck } from "./api/readiness.js";
import { handleReset } from "./api/reset.js";
import { handleValidateChirp } from "./api/validate_chirp.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/api/healthz", (req, res, next) => {
  Promise.resolve(handleHealthCheck(req, res)).catch(next);
});
app.post("/api/validate_chirp", (req, res, next) => {
  Promise.resolve(handleValidateChirp(req, res)).catch(next);
});

app.post("/admin/reset", (req, res, next) => {
  Promise.resolve(handleReset(req, res)).catch(next);
});
app.get("/admin/metrics", (req, res, next) => {
  Promise.resolve(handleMetrics(req, res)).catch(next);
});

app.use(middlewareErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
