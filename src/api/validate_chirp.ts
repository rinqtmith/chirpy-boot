import { Request, Response } from "express";

import { ValidateChirpResponse } from "../config.js";

export const handleValidateChirp = async (req: Request, res: Response) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  let parsedBody: ValidateChirpResponse;
  req.on("end", () => {
    res.header("Content-Type", "application/json");
    try {
      parsedBody = JSON.parse(body);
    } catch (error) {
      res.status(400).send({
        error: "Something went wrong",
      });
      return;
    }
    if (parsedBody.body.length > 140) {
      res.status(400).send({
        error: "Chirp is too long",
      });
      return;
    }
    res.status(200).send({
      valid: true,
    });
  });
};
