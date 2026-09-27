import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";

const HASH_PREFIX = "scrypt";
const KEY_LENGTH = 64;

const deriveKey = (password: string, salt: Buffer) =>
  new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, KEY_LENGTH, (error, key) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(key);
    });
  });

export const isPasswordHash = (value: string) =>
  value.startsWith(`${HASH_PREFIX}$`);

export const hashPassword = async (password: string) => {
  const salt = randomBytes(16);
  const key = await deriveKey(password, salt);
  return `${HASH_PREFIX}$${salt.toString("base64")}$${key.toString("base64")}`;
};

export const getPasswordLookup = (password: string) =>
  createHash("sha256").update(password).digest("hex");

export const verifyPassword = async (password: string, storedValue: string) => {
  if (!isPasswordHash(storedValue)) {
    const supplied = Buffer.from(password);
    const stored = Buffer.from(storedValue);
    return (
      supplied.length === stored.length && timingSafeEqual(supplied, stored)
    );
  }

  const [, saltValue, hashValue] = storedValue.split("$");

  if (!saltValue || !hashValue) {
    return false;
  }

  const storedHash = Buffer.from(hashValue, "base64");
  const suppliedHash = await deriveKey(
    password,
    Buffer.from(saltValue, "base64"),
  );
  return (
    suppliedHash.length === storedHash.length &&
    timingSafeEqual(suppliedHash, storedHash)
  );
};
