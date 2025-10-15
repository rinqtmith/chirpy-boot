import { Request, Response } from "express";

import { ChirpParameters } from "../config.js";
import { BadRequestError } from "./errors.js";
import { createChirp } from "../db/queries/chirps.js";

export const handlerChirpsCreate = async (req: Request, res: Response) => {
  const parsedBody: ChirpParameters = req.body;

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

  const chirp = await createChirp({
    body: cleanBody.join(" "),
    userId: parsedBody.userId,
  });

  res.status(201).send(chirp);
};
