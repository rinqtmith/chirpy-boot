import { describe, it, expect, beforeAll } from "vitest";
import { checkPasswordHash, hashPassword, makeJWT, validateJWT } from "./auth";

describe("Password Hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  const userid = "user123";
  const secret = "my_little_secret";
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it("should return true for the correct password", async () => {
    const result = await checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });

  it("should return false for the wrong password", async () => {
    const isInvalid = await checkPasswordHash(password2, hash1);
    expect(isInvalid).toBe(false);
  });

  it("creates a valid JWT and validates it", () => {
    const expiresIn = 60 * 60; // 1 hour
    const token = makeJWT(userid, expiresIn, secret);
    const sub = validateJWT(token, secret);
    expect(sub).toBe(userid);
  });

  it("throws error for invalid JWT", () => {
    const invalidToken = makeJWT(userid, 1, secret);
    expect(() => validateJWT(invalidToken + "tampered", secret)).toThrow();
  });

  it("throws error for expired JWT", () => {
    const token = makeJWT(userid, -10, secret); // expired
    expect(() => validateJWT(token, secret)).toThrow();
  });
});
