import { Request, Response } from "express";

import { config } from "../config.js";
import { deleteUsers } from "../db/queries/users.js";

export const handleReset = async (_: Request, res: Response) => {
  if (config.api.platform === "dev") {
    config.api.fileServerHits = 0;
    const result = await deleteUsers();
    res.write("Hits reset to 0\n");
    res.write("Users deleted");
    res.end();
    return result;
  }

  res.status(403).send("Reset is only allowed in dev environment");
};
