const fs = require("node:fs");
const path = require("node:path");

const sourceArgument = process.argv[2];
const force = process.argv.includes("--force");

if (!sourceArgument || sourceArgument === "--force") {
  console.error("Usage: node configure-app.cjs <source-env-file> [--force]");
  process.exit(1);
}

const appData = process.env.APPDATA;
if (!appData) {
  console.error("APPDATA is not available for the current Windows user.");
  process.exit(1);
}

const source = path.resolve(sourceArgument);
const destinationDirectory = path.join(appData, "PawnSystem");
const destination = path.join(destinationDirectory, "app.env");

if (!fs.existsSync(source)) {
  console.error(`Configuration source not found: ${source}`);
  process.exit(1);
}

const content = fs.readFileSync(source, "utf8");
const requiredKeys = [
  "DB_HOST",
  "DB_PORT",
  "DB_NAME",
  "DB_USER",
  "DB_PASSWORD",
  "IMAGE_ROOT",
];

for (const key of requiredKeys) {
  if (!new RegExp(`^${key}=.+$`, "m").test(content)) {
    console.error(`Configuration source is missing ${key}.`);
    process.exit(1);
  }
}

if (fs.existsSync(destination) && !force) {
  console.error(`Configuration already exists: ${destination}`);
  console.error("Use --force only when intentionally replacing it.");
  process.exit(1);
}

fs.mkdirSync(destinationDirectory, { recursive: true });
fs.writeFileSync(destination, content, { encoding: "utf8", mode: 0o600 });
console.log(`PawnSystem configuration installed at: ${destination}`);
