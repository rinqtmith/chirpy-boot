import { asc, eq } from "drizzle-orm";

import { db } from "../index.js";
import { chirps, NewChirp } from "../schema.js";

export const createChirp = async (chirp: NewChirp) => {
  const [rows] = await db.insert(chirps).values(chirp).returning();
  return rows;
};

export const getAllChirps = async () => {
  const result = await db.select().from(chirps).orderBy(asc(chirps.createdAt));
  return result;
};

export const getChirpsByAuthorId = async (authorId: string) => {
  const result = await db
    .select()
    .from(chirps)
    .where(eq(chirps.userId, authorId))
    .orderBy(asc(chirps.createdAt));
  return result;
};

export const getChirpById = async (id: string) => {
  const [chirp] = await db.select().from(chirps).where(eq(chirps.id, id));
  return chirp;
};

export const deleteChirpById = async (id: string) => {
  const [result] = await db.delete(chirps).where(eq(chirps.id, id)).returning();
  return result;
};
