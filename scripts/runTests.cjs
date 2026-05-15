const { spawnSync } = require("node:child_process");

const result = spawnSync(
  process.execPath,
  ["--loader", "ts-node/esm", "--test", "src/**/*.test.ts"],
  {
    stdio: "inherit",
    env: {
      ...process.env,
      TS_NODE_TRANSPILE_ONLY: "true",
    },
  },
);

process.exit(result.status ?? 1);
