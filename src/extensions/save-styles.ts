import debounce from "debounce";
import { locals, logger } from "../config";
import { getRules } from "../styles";
import type { MiddlewareParams } from "./index";

const log = logger("ext:save-styles");

const debouncedSave = debounce(saveStyles, 125);

export default function (params: MiddlewareParams) {
  debouncedSave();
  return params;
}

function saveStyles() {
  const rules = getRules();
  log("save", { rules });
  localStorage.setItem(locals.styles, rules);
}
