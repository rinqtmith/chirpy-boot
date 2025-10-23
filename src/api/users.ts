import { Request, Response } from "express";

import { createUser, updateUser } from "../db/queries/users.js";
import { UserParameters } from "../config.js";
import { BadRequestError } from "./errors.js";
import { getBearerToken, validateJWT } from "../db/auth.js";

export const handleCreateUser = async (req: Request, res: Response) => {
  const user: UserParameters = {
    email: req.body.email,
    password: req.body.password,
  };
  if (!user.password || !user.email) {
    throw new BadRequestError("Missing required fields");
  }

  const result = await createUser(user);

  if (!result) {
    throw new Error("Could not create user");
  }

  res.status(201).send(result);
};

export const handleUpdateUser = async (req: Request, res: Response) => {
  const token = getBearerToken(req);
  const userId = validateJWT(token);
  const userUpdate: UserParameters = {
    email: req.body.email,
    password: req.body.password,
  };

  if (!userUpdate.password || !userUpdate.email) {
    throw new BadRequestError("Missing required fields");
  }

  const result = await updateUser(userId, userUpdate);

  if (!result) {
    throw new Error("Could not update user");
  }

  res.status(200).send(result);
};
