import assert from "node:assert/strict";
import test from "node:test";
import { normalizeClientLookup, type ClientLookup } from "./clientLookup.ts";

test("ID lookup preserves leading zeros and accepts numeric or mixed IDs", () => {
  assert.equal(
    normalizeClientLookup({ kind: "id", value: "001234" }).value,
    "001234",
  );
  assert.equal(
    normalizeClientLookup({ kind: "id", value: " ab-001 23 " }).value,
    "AB00123",
  );
});

test("phone lookup ignores formatting and retains country codes", () => {
  assert.equal(
    normalizeClientLookup({ kind: "phone", value: "+1 (306) 555-0123" }).value,
    "13065550123",
  );
  assert.equal(
    normalizeClientLookup({ kind: "phone", value: "3065550123" }).value,
    "3065550123",
  );
});

test("empty searches stay empty and invalid search types are rejected", () => {
  assert.equal(normalizeClientLookup({ kind: "id", value: " -- " }).value, "");
  assert.equal(
    normalizeClientLookup({ kind: "phone", value: "() -" }).value,
    "",
  );
  assert.throws(() =>
    normalizeClientLookup({
      kind: "unknown",
      value: "123",
    } as unknown as ClientLookup),
  );
});
