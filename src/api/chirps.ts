import { Request, Response } from "express";

import { ChirpParameters } from "../config.js";
import { BadRequestError } from "./errors.js";
import {
  createChirp,
  getAllChirps,
  getChirpById,
} from "../db/queries/chirps.js";
import { getBearerToken, validateJWT } from "../db/auth.js";

export const handleChirpsCreate = async (req: Request, res: Response) => {
  const token = getBearerToken(req);
  const userId = validateJWT(token);
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
    userId: userId,
  });

  res.status(201).send(chirp);
};

export const handleChirpsGet = async (_: Request, res: Response) => {
  const chirps = await getAllChirps();

  res.status(200).send(chirps);
};

export const handleChirpGetById = async (req: Request, res: Response) => {
  const { chirpID } = req.params;
  const chirp = await getChirpById(chirpID);

  if (!chirp) {
    throw new BadRequestError(`Chirp with id ${chirpID} not found`);
  }

  res.status(200).send(chirp);
};
