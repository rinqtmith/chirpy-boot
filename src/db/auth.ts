import { hash, verify } from "argon2";
import jwt, { JwtPayload } from "jsonwebtoken";

import { Payload } from "../config.js";
import { UserNotAuthenticatedError } from "../api/errors.js";

export const hashPassword = async (password: string) => {
  const hashedPassword = await hash(password);

  return hashedPassword;
};

export const checkPasswordHash = async (password: string, hash: string) => {
  const isValid = await verify(hash, password);

  return isValid;
};

export const makeJWT = (userID: string, expiresIn: number, secret: string) => {
  const payload: Payload = {
    iss: "chirpy",
    sub: userID,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + expiresIn,
  };
  const token = jwt.sign(payload, secret, { algorithm: "HS256" });

  return token;
};

export function validateJWT(tokenString: string, secret: string) {
  let decoded: Payload;
  try {
    decoded = jwt.verify(tokenString, secret) as JwtPayload;
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
}
