import { Request, Response } from "express";

import { createUser } from "../db/queries/users.js";
import { UserParameters } from "../config.js";
import { BadRequestError } from "./errors.js";

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
