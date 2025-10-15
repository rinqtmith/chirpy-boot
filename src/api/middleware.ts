import { config, ErrorMiddleware, Middleware } from "../config.js";
import {
  BadRequestError,
  UserNotAuthenticatedError,
  UserForbiddenError,
  NotFoundError,
} from "./errors.js";

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
  res.header("Content-Type", "application/json");

  let statusCode = 500;
  let message = "Something went wrong on our end";

  if (err instanceof BadRequestError) {
    statusCode = 400;
    message = err.message;
  } else if (err instanceof UserNotAuthenticatedError) {
    statusCode = 401;
    message = err.message;
  } else if (err instanceof UserForbiddenError) {
    statusCode = 403;
    message = err.message;
  } else if (err instanceof NotFoundError) {
    statusCode = 404;
    message = err.message;
  }

  if (statusCode >= 500) {
    console.log(err.message);
  }
  res.status(statusCode).json({
    error: message,
  });
};
