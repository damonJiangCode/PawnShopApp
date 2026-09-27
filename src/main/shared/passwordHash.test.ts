import assert from "node:assert/strict";
import test from "node:test";
import {
  getPasswordLookup,
  hashPassword,
  isPasswordHash,
  verifyPassword,
} from "./passwordHash.ts";

test("hashes and verifies employee passwords", async () => {
  const password = "employee-secret";
  const hash = await hashPassword(password);

  assert.equal(isPasswordHash(hash), true);
  assert.equal(await verifyPassword(password, hash), true);
  assert.equal(await verifyPassword("wrong-password", hash), false);
  assert.notEqual(hash, password);
});

test("creates a stable lookup without exposing the password", () => {
  const first = getPasswordLookup("employee-secret");
  const second = getPasswordLookup("employee-secret");

  assert.equal(first, second);
  assert.equal(first.length, 64);
  assert.notEqual(first, "employee-secret");
});

test("verifies legacy plaintext values during migration", async () => {
  assert.equal(await verifyPassword("legacy", "legacy"), true);
  assert.equal(await verifyPassword("different", "legacy"), false);
});
