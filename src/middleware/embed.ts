import {
  invertedPropName,
  logger,
  mediaFilter,
  rulesPropName,
} from "../config";
import { checkInsideInverted } from "../dom/check-inside-inverted";
import { getSelector } from "../dom/get-selector";
import { Sheet } from "../utils";
import type { HTMLElementExtended, MiddlewareParams } from "./index";

const log = logger("middleware:embed");
const sheet = new Sheet("embed");

export default function (params: MiddlewareParams) {
  const { status, element, isEmbedded, isInverted } = params;

  switch (status) {
    case "update":
      if (isInverted || !isEmbedded) break;
      if (element.isConnected) {
        if (checkInsideInverted(element)) break;
        handleElement(element);
        return { ...params, isInverted: true };
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

function handleElement(element: HTMLElementExtended) {
  const selector = getSelector(element);
  const rule = sheet.makeRule(`${selector} { ${mediaFilter} }`);
  log("add rule", { selector });
  sheet.addRule(rule);
  element[invertedPropName] = true;
  element[rulesPropName]?.push(rule);
}
