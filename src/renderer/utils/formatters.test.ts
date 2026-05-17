import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatIsoDate, formatShortDate } from "./formatters.ts";

describe("renderer date formatters", () => {
  it("treats date-only strings as local dates", () => {
    assert.equal(formatIsoDate("2026-05-15"), "2026-05-15");
    assert.equal(formatShortDate("2026-05-15"), "May 15, 2026");
  });
});
