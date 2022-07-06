import { logger, rootRule } from "../config";
import { Sheet } from "../utils";
import type { MiddlewareParams } from "./index";

const log = logger("middleware:root");

const sheet = new Sheet("root");
const rule = sheet.makeRule(rootRule);

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
