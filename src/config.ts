import { NextFunction, Response, Request } from "express";

export type Middleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => void;

export type ValidateChirpResponse = {
  body: string;
};

type APIConfig = {
  fileserverHits: number;
};

export const config: APIConfig = {
  fileserverHits: 0,
};
