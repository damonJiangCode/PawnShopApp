import path from "node:path";

const channelsPath = path.resolve(process.cwd(), "src/shared/ipc/channels.cjs");
const { CHANNELS } = require(channelsPath) as {
  CHANNELS: Record<string, string>;
};

export { CHANNELS };
