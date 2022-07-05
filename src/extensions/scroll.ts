import { logger } from "../config";
import { addRule, makeRule } from "../styles";
import type { MiddlewareParams } from "./index";

const log = logger("ext:scroll");

const rootRule = makeRule(`:root { color-scheme: dark; }`);
const elementsRule = makeRule(
  `body, input, button, textarea, select { color-scheme: light; }`,
);

export default function (params: MiddlewareParams) {
  const { status } = params;

  if (status === "start") {
    log("start");
    addRule(rootRule);
    addRule(elementsRule);
  }

  return params;
}

// if (element instanceof HTMLHtmlElement) return;
// if (element instanceof HTMLBodyElement) return;
// if (!checkIsScrollable(element)) return;
// if (!element.inverted && !checkInsideInverted(element)) return;
// const selector = getSelector(element);
// const rule = makeRule(`${selector} { color-scheme: dark; }`);
// addRule(rule);
