import assert from "node:assert/strict";
import test from "node:test";
import type { PoolClient } from "pg";

test("ID and phone searches use parameterized exact matches and return client IDs", async () => {
  for (const key of ["DB_USER", "DB_HOST", "DB_NAME", "DB_PASSWORD"]) {
    process.env[key] ??= "lookup_test";
  }
  const calls: { sql: string; values: unknown[] }[] = [];
  const identifications = [{ id_type: "DRIVER", id_value: "ab-001" }];
  const client = {
    query: async (sql: string, values: unknown[]) => {
      calls.push({ sql, values });
      return {
        rows: [
          {
            client_number: 12,
            first_name: "Test",
            last_name: "Client",
            identifications,
          },
        ],
      };
    },
  } as unknown as PoolClient;
  const { clientRepo } = await import("./client.repo.ts");
  const results = await clientRepo.searchByLookup(
    { kind: "id", value: "AB001" },
    client,
  );
  assert.equal(results[0].client_number, 12);
  assert.deepEqual(results[0].identifications, identifications);
  assert.match(calls[0].sql, /EXISTS \(SELECT 1 FROM client_id/);
  assert.match(calls[0].sql, /UPPER\(REGEXP_REPLACE\(ids.id_value/);
  assert.match(calls[0].sql, /= \$1/);
  assert.doesNotMatch(calls[0].sql, /AB001/);
  assert.deepEqual(calls[0].values, ["AB001"]);
  await clientRepo.searchByLookup(
    { kind: "phone", value: "3065550123" },
    client,
  );
  assert.match(
    calls[1].sql,
    /REGEXP_REPLACE\(c.phone, '\[\^0-9\]', '', 'g'\) = \$1/,
  );
  assert.deepEqual(calls[1].values, ["3065550123"]);
  assert.match(calls[1].sql, /LIMIT 200/);
});
