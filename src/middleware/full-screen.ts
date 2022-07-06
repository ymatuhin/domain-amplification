import { logger } from "../config";
import { Sheet } from "../utils";
import type { MiddlewareParams } from "./index";

const log = logger("middleware:fullscreen");
const sheet = new Sheet("fullscreen");
const rule = sheet.makeRule(`:fullscreen { filter: initial !important; }`);

export default function (params: MiddlewareParams) {
  switch (params.status) {
    case "start":
      log("start");
      sheet.addRule(rule);
      break;
    case "stop":
      log("stop");
      sheet.clear();
      break;
  }
  return params;
}
