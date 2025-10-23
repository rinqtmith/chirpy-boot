import { Request, Response } from "express";

import { upgradeUserToChirpyRed } from "../db/queries/users.js";
import { config, UserUpgradeParameters } from "../config.js";
import { NotFoundError, UserNotAuthenticatedError } from "./errors.js";
import { getAPIKey } from "../db/auth.js";

export const handleUpgradeUserToChirpyRed = async (
  req: Request,
  res: Response,
) => {
  const apiKey = getAPIKey(req);

  if (apiKey !== config.api.polka) {
    throw new UserNotAuthenticatedError("Invalid API key");
  }

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
