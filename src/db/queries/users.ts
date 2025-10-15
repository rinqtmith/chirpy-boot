import { db } from "../index.js";
import { NewUser, users } from "../schema.js";

export const createUser = async (user: NewUser) => {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
  return result;
};

export const deleteUsers = async () => {
  const [result] = await db.delete(users).returning();

  return result;
};
