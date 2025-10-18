import { Request, Response } from "express";

import { createUser, getUserByEmail } from "../db/queries/users.js";
import { UserParameters } from "../config.js";
import { checkPasswordHash } from "../db/auth.js";
import { UserNotAuthenticatedError } from "./errors.js";
import { NewUserWithoutPassword } from "src/db/schema.js";

export const handleCreateUser = async (req: Request, res: Response) => {
  const user: UserParameters = {
    email: req.body.email,
    password: req.body.password,
  };

  const result = await createUser(user);

  res.status(201).send(result);
};

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
