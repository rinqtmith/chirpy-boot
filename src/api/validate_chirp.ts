import { Request, Response } from "express";

import { ValidateChirpResponse } from "../config.js";
import { BadRequestError } from "./errors.js";

export const handleValidateChirp = async (req: Request, res: Response) => {
  const parsedBody: ValidateChirpResponse = req.body;

  const maxChirpLength = 140;
  if (parsedBody.body.length > maxChirpLength) {
    throw new BadRequestError(
      `Chirp is too long. Max length is ${maxChirpLength}`,
    );
  }

  const profane = ["kerfuffle", "sharbert", "fornax"];

  const bodyToCheck = parsedBody.body.split(" ");
  const cleanBody = bodyToCheck.map((word) => {
    if (profane.includes(word.toLowerCase())) {
      return "****";
    } else {
      return word;
    }
  });

  res.status(200).send({
    cleanedBody: cleanBody.join(" "),
  });
};
