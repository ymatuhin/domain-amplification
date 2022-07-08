import type { HTMLElementExtended, MiddlewareParams } from ".";
import {
  checkBackColorPresence,
  getLightnessStatusFromValue,
  getRgbLightness,
  rgbaToObject,
} from "../color";
import { checkBackImagePresence } from "../color/check-back-image-presence";
import {
  invertedPropName,
  logger,
  revertFilter,
  rgbaRx,
  rulesPropName,
} from "../config";
import { checkInsideInverted } from "../dom/check-inside-inverted";
import { getElementSize } from "../dom/get-element-size";
import { getSelector } from "../dom/get-selector";
import { Sheet } from "../utils";

const log = logger("middleware:back-color");
const sheet = new Sheet("back-color");

export default function (params: MiddlewareParams) {
  const { status, element, isDocument, isEmbedded } = params;

  switch (status) {
    case "update":
      if (!element || isDocument || isEmbedded) break;
      if (element.isConnected) {
        if (checkInsideInverted(element)) break;
        const inverted = handleElement(element);
        return { ...params, isInverted: inverted };
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
  const styles = getComputedStyle(element);
  const hasImage = checkBackImagePresence(styles);
  if (hasImage || element instanceof HTMLImageElement) return;
  const hasColor = checkBackColorPresence(styles);
  if (!hasColor) return false;

  const size = getElementSize(element);
  const colors = styles.background.match(rgbaRx) ?? [];
  const filterTransparent = (color: string) => rgbaToObject(color).a !== 0;
  const lightness = colors
    .filter(filterTransparent)
    .map(getRgbLightness) as number[];
  if (!lightness.length) return false;

  const avg = lightness.reduce((a, b) => a + b) / lightness.length;
  const selector = getSelector(element);
  const rule = sheet.makeRule(`${selector} { ${revertFilter} }`);
  const status = getLightnessStatusFromValue(avg);

  if (status === "dark") {
    log("add rule", { element, size });
    sheet.addRule(rule);
    element[invertedPropName] = true;
    element[rulesPropName]?.push(rule);
    return true;
  } else {
    // log("skip", { element, size, colors, lightness });
  }

  return false;
}
