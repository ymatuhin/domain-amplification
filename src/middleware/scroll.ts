import { logger, rulesPropName } from "../config";
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
  const { status, element, isInverted, isEmbedded } = params;

  switch (status) {
    case "start":
      log("start");
      sheet.addRule(rootRule);
      sheet.addRule(elementsRule);
      break;
    case "update":
      if (!isInverted || isEmbedded) break;
      if (!checkIsScrollable(element)) break;

      if (element.isConnected) {
        const selector = getSelector(element);
        const rule = sheet.makeRule(`${selector} { color-scheme: dark; }`);
        sheet.addRule(rule);
        element[rulesPropName]?.push(rule);
      } else {
        element[rulesPropName]?.forEach((rule) => sheet.removeRule(rule));
      }
      break;
    case "stop":
      sheet.clear();
      break;
  }

  return params;
}
