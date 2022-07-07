import { invertedPropName, logger, rulesPropName } from "../config";
import { checkInsideInverted } from "../dom/check-inside-inverted";
import { checkIsScrollable } from "../dom/check-is-scrollable";
import { getSelector } from "../dom/get-selector";
import { Sheet } from "../utils";
import type { MiddlewareParams } from "./index";

const log = logger("middleware:scroll");
const sheet = new Sheet("scroll");

const rootRule = sheet.makeRule(`:root { color-scheme: dark; }`);
const elementsRule = sheet.makeRule(
  `body, input, button, textarea, select { color-scheme: light; }`,
);

export default function (params: MiddlewareParams) {
  const { status, element, isDocument, isEmbedded, isInverted } = params;

  switch (status) {
    case "start":
      log("start");
      sheet.addRule(rootRule);
      sheet.addRule(elementsRule);
      break;
    case "update":
      if (!element || isDocument || isEmbedded) break;
      if (element.isConnected) {
        if (
          (isInverted || checkInsideInverted(element)) &&
          checkIsScrollable(element)
        ) {
          const selector = getSelector(element);
          const rule = sheet.makeRule(`${selector} { color-scheme: dark; }`);
          log("invert scroll", { element, rule });
          sheet.addRule(rule);
        }
      } else {
        element[invertedPropName] = undefined;
        element[rulesPropName]?.forEach((rule) => sheet.removeRule(rule));
      }
      break;
    case "stop":
      sheet.clear();
      break;
  }

  return params;
}
