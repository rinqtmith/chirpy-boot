import { hash, verify } from "argon2";

export const hashPassword = async (password: string) => {
  const hashedPassword = await hash(password);

  return hashedPassword;
};

export const checkPasswordHash = async (password: string, hash: string) => {
  const isValid = await verify(hash, password);

  return isValid;
};
