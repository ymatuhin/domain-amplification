import { logger } from "../config";
import { addRule, makeRule } from "../styles";
import type { MiddlewareParams } from "./index";

const log = logger("ext:fullscreen");
const rule = makeRule(`:fullscreen { filter: initial !important; }`);

export default function (params: MiddlewareParams) {
  const { status } = params;

  if (status === "start") {
    log("start");
    addRule(rule);
  }

  return params;
}
