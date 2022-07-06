import { logger } from "../config";
import { checkInsideInverted } from "../dom/check-inside-inverted";
import { checkIsScrollable } from "../dom/check-is-scrollable";
import { getSelector } from "../dom/get-selector";
import { addRule, makeRule } from "../styles";
import type { MiddlewareParams } from "./index";

const log = logger("middleware:scroll");

const rootRule = makeRule(`:root { color-scheme: dark; }`);
const elementsRule = makeRule(
  `body, input, button, textarea, select { color-scheme: light; }`,
);

export default function (params: MiddlewareParams) {
  const { status, element, isDocument, isIgnored, isInverted } = params;

  if (status === "start") {
    log("start");
    addRule(rootRule);
    addRule(elementsRule);
    return params;
  }

  if (!element || !element.isConnected || isDocument || isIgnored)
    return params;

  if (
    (isInverted || checkInsideInverted(element)) &&
    checkIsScrollable(element)
  ) {
    const selector = getSelector(element);
    const rule = makeRule(`${selector} { color-scheme: dark; }`);
    addRule(rule);
    log("invert scroll", { element, rule });
  }

  return params;
}
