import { logger } from "../config";
import type { Extension } from "./index";

const log = logger("logger extension");

export default {
  init() {
    log("init");
  },
  handle(element) {
    log("handle", element);
  },
  stop() {
    log("stop");
  },
} as Extension;
