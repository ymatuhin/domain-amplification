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
  handleElement(element) {
    log("handle", element);
  },
} as Extension;
