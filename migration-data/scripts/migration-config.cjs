const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "../..");
const envPath = path.join(projectRoot, ".env");

if (fs.existsSync(envPath)) {
  for (const rawLine of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}

const requireSetting = (name) => {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required migration setting: ${name}`);
  return value;
};

const port = Number(process.env.DB_PORT || 5432);
if (!Number.isInteger(port) || port <= 0) {
  throw new Error("DB_PORT must be a valid positive integer.");
}

module.exports = {
  user: requireSetting("DB_USER"),
  host: process.env.DB_HOST?.trim() || "localhost",
  database:
    process.env.MIGRATION_DB_NAME?.trim() ||
    process.env.DB_NAME?.trim() ||
    "pawnsystemdb_migration",
  password: requireSetting("DB_PASSWORD"),
  port,
};
