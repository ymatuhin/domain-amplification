import { logger } from "../config";
import type { MiddlewareParams } from "./index";

const log = logger("middleware:whitelist");

export default function (params: MiddlewareParams) {
  const { status, element } = params;
  if (status !== "update" || !element.isConnected) return params;

  switch (location.hostname) {
    case "stackoverflow.com":
      if (element.matches("span.-img._glyph")) {
        log("stackoverflow logo");
        return false;
      }
      break;
  }

  return params;
}
