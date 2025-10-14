import { Request, Response } from "express";

import { ValidateChirpResponse } from "../config.js";

export const handleValidateChirp = async (req: Request, res: Response) => {
  const parsedBody: ValidateChirpResponse = req.body;
  if (parsedBody.body.length > 140) {
    res.status(400).send({
      error: "Chirp is too long",
    });
    return;
  }
  res.status(200).send({
    valid: true,
  });
};
