import { logger } from "../config";
import type { Extension } from "./index";

const log = logger("logger extension");

export default {
  start() {
    log("start");
  },
  stop() {
    log("stop");
  },
  handle(element) {
    log("handle", element);
  },
} as Extension;
