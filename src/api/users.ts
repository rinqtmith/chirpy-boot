import { Request, Response } from "express";

import { createUser } from "../db/queries/users.js";
import { NewUser } from "../db/schema";

export const handleCreateUser = async (req: Request, res: Response) => {
  const user: NewUser = { email: req.body.email };

  const result = await createUser(user);

  res.status(201).send(result);
};
