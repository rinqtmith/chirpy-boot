import { NextFunction, Response, Request } from "express";

export type Middleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => void;

type APIConfig = {
  fileserverHits: number;
};

export const config: APIConfig = {
  fileserverHits: 0,
};
