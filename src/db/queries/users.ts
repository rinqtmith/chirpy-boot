import { eq } from "drizzle-orm";

import { UserParameters } from "../../config.js";
import { hashPassword } from "../auth.js";
import { db } from "../index.js";
import { NewUser, NewUserWithoutPassword, users } from "../schema.js";

export const createUser = async (user: UserParameters) => {
  const hashedPassword = await hashPassword(user.password);
  const newUser: NewUser = {
    email: user.email,
    hashed_password: hashedPassword,
  };

  const [finalUser] = await db
    .insert(users)
    .values(newUser)
    .onConflictDoNothing()
    .returning();

  const result: NewUserWithoutPassword = finalUser;

  return result;
};

export const deleteUsers = async () => {
  const [result] = await db.delete(users).returning();

  return result;
};

export const getUserByEmail = async (email: string) => {
  const [user] = await db.select().from(users).where(eq(users.email, email));

  return user;
};

export const updateUser = async (
  userId: string,
  userUpdate: UserParameters,
) => {
  const hashedPassword = await hashPassword(userUpdate.password);
  const [finalUser] = await db
    .update(users)
    .set({
      email: userUpdate.email,
      hashed_password: hashedPassword,
    })
    .where(eq(users.id, userId))
    .returning();

  const result: NewUserWithoutPassword = finalUser;

  return result;
};
