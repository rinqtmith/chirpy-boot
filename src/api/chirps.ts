import { Request, Response } from "express";

import { ChirpParameters } from "../config.js";
import {
  BadRequestError,
  NotFoundError,
  UserForbiddenError,
} from "./errors.js";
import {
  createChirp,
  deleteChirpById,
  getAllChirps,
  getChirpById,
  getChirpsByAuthorId,
} from "../db/queries/chirps.js";
import { getBearerToken, validateJWT } from "../db/auth.js";
import { NewChirp } from "../db/schema.js";

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

export const handleChirpsGet = async (req: Request, res: Response) => {
  let authorId = "";
  let authorIdQuery = req.query.authorId;
  if (typeof authorIdQuery === "string") {
    authorId = authorIdQuery;
  }
  let sort = "";
  let sortQuery = req.query.sort;
  if (typeof sortQuery === "string") {
    sort = sortQuery;
  }

  let chirps: NewChirp[];

  if (authorId === "") {
    chirps = await getAllChirps(sort);
  } else {
    chirps = await getChirpsByAuthorId(authorId, sort);
  }

  res.status(200).send(chirps);
};

export const handleChirpGetById = async (req: Request, res: Response) => {
  const { chirpID } = req.params;
  const chirp = await getChirpById(chirpID);

  if (!chirp) {
    throw new NotFoundError(`Chirp with id ${chirpID} not found`);
  }

  res.status(200).send(chirp);
};

export const handleChirpDeleteById = async (req: Request, res: Response) => {
  const token = getBearerToken(req);
  const userId = validateJWT(token);
  const { chirpID } = req.params;

  const chirp = await getChirpById(chirpID);
  if (!chirp) {
    throw new NotFoundError(`Chirp with id ${chirpID} not found`);
  }
  if (chirp.userId !== userId) {
    throw new UserForbiddenError(`User not authorized to delete this chirp`);
  }

  const deleted = await deleteChirpById(chirpID);
  if (!deleted) {
    throw new Error(`Failed to delete chirp with chirpId: ${chirpID}`);
  }

  res.status(204).send();
};
