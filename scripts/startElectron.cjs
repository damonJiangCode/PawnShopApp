const { spawnSync } = require("node:child_process");
const path = require("node:path");
const electron = require("electron");

const env = { ...process.env };
delete env.ELECTRON_RUN_AS_NODE;

const result = spawnSync(
  electron,
  [path.resolve(__dirname, "../.electron-build"), ...process.argv.slice(2)],
  { stdio: "inherit", env },
);

if (result.error) {
  console.error("Unable to start Electron:", result.error);
}

process.exit(result.status ?? 1);
