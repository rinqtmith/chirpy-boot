import { config, Middleware } from "../config.js";

export const middlewareLogResponses: Middleware = (req, res, next) => {
  res.on("finish", () => {
    const status = res.statusCode;
    if (status > 300) {
      console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${status}`);
    }
  });
  next();
};

export const middlewareMetricsInc: Middleware = (_, res, next) => {
  res.on("finish", () => {
    config.fileserverHits++;
  });
  next();
};
