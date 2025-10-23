import { Request, Response } from "express";

import { upgradeUserToChirpyRed } from "../db/queries/users.js";
import { UserUpgradeParameters } from "../config.js";
import { NotFoundError } from "./errors.js";

export const handleUpgradeUserToChirpyRed = async (
  req: Request,
  res: Response,
) => {
  const params: UserUpgradeParameters = {
    event: req.body.event,
    data: {
      userId: req.body.data.userId,
    },
  };

  if (params.event !== "user.upgraded") {
    res.status(204).send();
    return;
  }

  const result = await upgradeUserToChirpyRed(params.data.userId);
  if (!result) {
    throw new NotFoundError("User not found");
  }

  res.status(204).send();
};
