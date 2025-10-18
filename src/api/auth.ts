import { Request, Response } from "express";

import { getUserByEmail } from "../db/queries/users.js";
import { UserParameters } from "../config.js";
import { checkPasswordHash } from "../db/auth.js";
import { UserNotAuthenticatedError } from "./errors.js";
import { NewUserWithoutPassword } from "src/db/schema.js";

export const handleLoginUser = async (req: Request, res: Response) => {
  const user: UserParameters = {
    email: req.body.email,
    password: req.body.password,
  };

  const loginUser = await getUserByEmail(user.email);
  const isValid = await checkPasswordHash(
    user.password,
    loginUser.hashed_password,
  );

  if (!loginUser || !isValid) {
    throw new UserNotAuthenticatedError("Invalid email or password");
  }

  const loginUserData: NewUserWithoutPassword = loginUser;

  res.status(200).send(loginUserData);
};
