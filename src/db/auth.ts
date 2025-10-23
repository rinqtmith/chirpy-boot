import { Request } from "express";
import { hash, verify } from "argon2";
import jwt, { JwtPayload } from "jsonwebtoken";
import { randomBytes } from "crypto";

import { config, Payload } from "../config.js";
import { UserNotAuthenticatedError } from "../api/errors.js";

export const hashPassword = async (password: string) => {
  const hashedPassword = await hash(password);

  return hashedPassword;
};

export const checkPasswordHash = async (password: string, hash: string) => {
  const isValid = await verify(hash, password);

  return isValid;
};

export const makeJWT = (userID: string, expiresIn: number) => {
  const payload: Payload = {
    iss: "chirpy",
    sub: userID,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + expiresIn,
  };
  const token = jwt.sign(payload, config.jwt.secretKey, { algorithm: "HS256" });

  return token;
};

export const validateJWT = (tokenString: string) => {
  let decoded: Payload;
  try {
    decoded = jwt.verify(tokenString, config.jwt.secretKey) as JwtPayload;
  } catch (e) {
    throw new UserNotAuthenticatedError("Invalid token");
  }

  if (decoded.iss !== "chirpy") {
    throw new UserNotAuthenticatedError("Invalid issuer");
  }

  if (!decoded.sub) {
    throw new UserNotAuthenticatedError("No user ID in token");
  }

  return decoded.sub;
};

export const getBearerToken = (req: Request): string => {
  const authHeader = req.get("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7);
  } else {
    throw new UserNotAuthenticatedError(
      "Authorization header missing or invalid",
    );
  }
};

export const makeRefreshToken = () => {
  const data = randomBytes(32).toString("hex");
  return data;
};

export const getAPIKey = (req: Request): string => {
  const authHeader = req.get("Authorization");
  if (authHeader && authHeader.startsWith("ApiKey ")) {
    return authHeader.slice(7);
  } else {
    throw new UserNotAuthenticatedError(
      "Authorization header missing or invalid",
    );
  }
};
