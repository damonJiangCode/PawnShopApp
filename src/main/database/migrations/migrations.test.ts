import assert from "node:assert/strict";
import test from "node:test";
import type { DbClient } from "../connection.ts";
import { runDatabaseMigrations } from "./migrations.ts";
import { createClientIdLookupIndex } from "../schema/client/clientIdTable.ts";
import { createClientPhoneLookupIndex } from "../schema/client/clientTable.ts";

test("existing databases receive both lookup indexes once", async () => {
  const applied = new Set([
    "2026-09-26-pre-production-hardening",
    "2026-09-26-employee-password-hashes",
    "2026-09-26-xml-report-image-snapshots",
  ]);
  const statements: string[] = [];
  const client = {
    query: async (sql: string, values?: string[]) => {
      if (sql.startsWith("SELECT 1 FROM schema_migration")) {
        return { rowCount: applied.has(values![0]) ? 1 : 0 };
      }
      if (sql.startsWith("INSERT INTO schema_migration")) {
        applied.add(values![0]);
      }
      statements.push(sql);
      return { rowCount: 0 };
    },
  } as unknown as DbClient;
  await runDatabaseMigrations(client);
  await runDatabaseMigrations(client);
  assert.equal(
    statements.filter((sql) => sql === createClientIdLookupIndex).length,
    1,
  );
  assert.equal(
    statements.filter((sql) => sql === createClientPhoneLookupIndex).length,
    1,
  );
  assert.ok(applied.has("2026-10-05-client-id-phone-search-indexes"));
});
