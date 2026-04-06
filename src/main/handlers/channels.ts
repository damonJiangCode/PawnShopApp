import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { CHANNELS } = require("../../shared/ipc/channels.cjs") as typeof import("../../shared/ipc/channels.cjs");

export { CHANNELS };
