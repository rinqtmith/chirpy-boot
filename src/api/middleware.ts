import { config, ErrorMiddleware, Middleware } from "../config.js";

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

export const middlewareErrorHandler: ErrorMiddleware = (
  err,
  _req,
  res,
  _next,
) => {
  console.error(err.message);
  res.header("Content-Type", "application/json");
  res.status(500).json({
    error: "Something went wrong on our end",
  });
};
