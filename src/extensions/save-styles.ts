import debounce from "debounce";
import { checkInsideIframe } from "shared/utils/check-inside-iframe";
import { locals, logger } from "../config";
import { getRules } from "../styles";
import type { MiddlewareParams } from "./index";

const log = logger("ext:save-styles");

const debouncedSave = debounce(saveStyles, 125);

export default function (params: MiddlewareParams) {
  if (params.status === "stop") return params;
  if (checkInsideIframe()) return params;

  debouncedSave();
  return params;
}

function saveStyles() {
  const rules = getRules();
  log("save", rules);
  localStorage.setItem(locals.styles, rules);
}
