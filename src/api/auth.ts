import { Request, Response } from "express";

import { getUserByEmail } from "../db/queries/users.js";
import { config, UserParameters } from "../config.js";
import {
  checkPasswordHash,
  getBearerToken,
  makeJWT,
  makeRefreshToken,
} from "../db/auth.js";
import { UserNotAuthenticatedError } from "./errors.js";
import { NewUserWithoutPassword } from "../db/schema.js";
import {
  revokeRefreshToken,
  saveRefreshToken,
  userForRefreshToken,
} from "../db/queries/refresh.js";

export const handleLoginUser = async (req: Request, res: Response) => {
  const user: UserParameters = {
    email: req.body.email,
    password: req.body.password,
  };

  let expires: number = 60 * 60 * 1000;

  const loginUser = await getUserByEmail(user.email);
  const isValid = await checkPasswordHash(
    user.password,
    loginUser.hashed_password,
  );

  if (!loginUser || !isValid) {
    throw new UserNotAuthenticatedError("Invalid email or password");
  }

  const token = makeJWT(loginUser.id, expires);
  const refreshToken = makeRefreshToken();

  const saved = await saveRefreshToken(loginUser.id, refreshToken);
  if (!saved) {
    throw new UserNotAuthenticatedError("could not save refresh token");
  }

  const loginUserData: NewUserWithoutPassword = loginUser;
  const userWithToken = {
    ...loginUserData,
    token: token,
    refreshToken: refreshToken,
  };

  res.status(200).send(userWithToken);
};

export const handlerRefresh = async (req: Request, res: Response) => {
  let refreshToken = getBearerToken(req);

  const result = await userForRefreshToken(refreshToken);
  if (!result) {
    throw new UserNotAuthenticatedError("invalid refresh token");
  }

  const user = result.user;
  const accessToken = makeJWT(user.id, 60 * 60 * 1000);

  res.status(200).send({
    token: accessToken,
  });
};

export const handlerRevoke = async (req: Request, res: Response) => {
  const refreshToken = getBearerToken(req);
  await revokeRefreshToken(refreshToken);
  res.status(204).send();
};
