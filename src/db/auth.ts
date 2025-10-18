import { hash, verify } from "argon2";
import jwt from "jsonwebtoken";

import { Payload } from "../config";

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
  const jwtString = jwt.sign(payload, secret);

  return jwtString;
};

export const validateJWT = (tokenString: string, secret: string) => {
  const jwtString = jwt.verify(tokenString, secret);
  if (!jwtString || !jwtString.sub) {
    throw new Error("Invalid token");
  }

  return jwtString.sub;
};
