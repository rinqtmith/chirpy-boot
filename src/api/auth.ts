import { Request, Response } from "express";

import { getUserByEmail } from "../db/queries/users.js";
import { UserParameters } from "../config.js";
import { checkPasswordHash, makeJWT } from "../db/auth.js";
import { UserNotAuthenticatedError } from "./errors.js";
import { NewUserWithoutPassword } from "src/db/schema.js";

export const handleLoginUser = async (req: Request, res: Response) => {
  const user: UserParameters = {
    email: req.body.email,
    password: req.body.password,
  };

  let expires: number = 60 * 60 * 1000;
  if (req.body.expiresInSeconds) {
    if (
      req.body.expiresInSeconds < 60 * 60 * 1000 &&
      req.body.expiresInSeconds > 0
    ) {
      expires = req.body.expiresInSeconds;
    }
  }

  const loginUser = await getUserByEmail(user.email);
  const isValid = await checkPasswordHash(
    user.password,
    loginUser.hashed_password,
  );

  if (!loginUser || !isValid) {
    throw new UserNotAuthenticatedError("Invalid email or password");
  }

  const token = makeJWT(loginUser.id, expires);

  const loginUserData: NewUserWithoutPassword = loginUser;
  const userWithToken = {
    ...loginUserData,
    token: token,
  };

  res.status(200).send(userWithToken);
};
