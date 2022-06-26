import { Extension } from ".";
import { logger } from "../config";

const log = logger("logger extension");

export default {
  init() {
    log("init");
  },
  handle() {
    log("handleElement");
  },
  stop() {
    log("onStop");
  },
} as Extension;
