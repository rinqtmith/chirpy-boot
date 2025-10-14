import { Request, Response } from "express";

import { ValidateChirpResponse } from "../config.js";

export const handleValidateChirp = async (req: Request, res: Response) => {
  const parsedBody: ValidateChirpResponse = req.body;
  if (parsedBody.body.length > 140) {
    throw new Error("Chirp is too long");
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
