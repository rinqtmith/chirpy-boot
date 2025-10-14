import express from "express";

import { handleMetrics } from "./api/metrics.js";
import {
  middlewareLogResponses,
  middlewareMetricsInc,
} from "./api/middleware.js";
import { handleHealthCheck } from "./api/readiness.js";
import { handleReset } from "./api/reset.js";

const app = express();
const PORT = 8080;

app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/api/healthz", handleHealthCheck);

app.get("/admin/reset", handleReset);
app.get("/admin/metrics", handleMetrics);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
