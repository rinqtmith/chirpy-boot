process.loadEnvFile();

import { MigrationConfig } from "drizzle-orm/migrator";
import { NextFunction, Response, Request } from "express";

export type Middleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => void;

export type ErrorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => void;

export type ChirpParameters = {
  body: string;
  userId: string;
};

type Config = {
  api: APIConfig;
  db: DBConfig;
};

type APIConfig = {
  fileServerHits: number;
  port: number;
  platform: string;
};

type DBConfig = {
  url: string;
  migrationConfig: MigrationConfig;
};

function envOrThrow(key: string) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};

export const config: Config = {
  api: {
    fileServerHits: 0,
    port: Number(envOrThrow("PORT")),
    platform: envOrThrow("PLATFORM"),
  },
  db: {
    url: envOrThrow("DB_URL"),
    migrationConfig: migrationConfig,
  },
};
