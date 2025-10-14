import express, { Request, Response } from "express";

import { config, Middleware } from "./config.js";

const handleHealthCheck = (_: Request, res: Response) => {
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.send("OK");
};

const handleMetrics = (_: Request, res: Response) => {
  const hits = config.fileserverHits;
  res.set("Content-Type", "text/html; charset=utf-8");
  res.send(`
<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${hits} times!</p>
  </body>
</html>
`);
};

const handleReset = (_: Request, res: Response) => {
  config.fileserverHits = 0;
  res.send("Reset successful");
};

const middlewareLogResponses: Middleware = (req, res, next) => {
  res.on("finish", () => {
    const status = res.statusCode;
    if (status !== 200) {
      console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${status}`);
    }
  });
  next();
};
const middlewareMetricsInc: Middleware = (_, res, next) => {
  res.on("finish", () => {
    config.fileserverHits += 1;
  });
  next();
};

const app = express();
const PORT = 8080;

app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc);

app.use("/app", express.static("./src/app"));

app.get("/api/healthz", handleHealthCheck);

app.get("/admin/reset", handleReset);
app.get("/admin/metrics", handleMetrics);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
