import type { HTMLElementExtended, MiddlewareParams } from ".";
import {
  checkBackColorPresence,
  getLightnessStatusFromValue,
  getRgbLightness,
  rgbaToObject,
} from "../color";
import { checkBackImagePresence } from "../color/check-back-image-presence";
import { logger, rgbaRx } from "../config";
import { checkInsideInverted } from "../dom/check-inside-inverted";
import { getElementSize } from "../dom/get-element-size";
import { getSelector } from "../dom/get-selector";
import { addRule, makeRule, mediaFilter } from "../styles";

const log = logger("ext:back-color");

export default function (params: MiddlewareParams) {
  const { element, isDocument, isIgnored } = params;

  if (!element || isDocument || isIgnored) return params;

  if (!element.isConnected) return params;
  if (checkInsideInverted(element)) return params;

  const inverted = handleElement(element);

  return { ...params, inverted };
}

function handleElement(element: HTMLElementExtended) {
  const styles = getComputedStyle(element);
  const hasImage = checkBackImagePresence(styles);
  if (hasImage) return;
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
  const rule = makeRule(`${selector} { ${mediaFilter}}`);
  const status = getLightnessStatusFromValue(avg);

  if (status === "dark" && size > 4) {
    log("add rule", { element });
    addRule(rule);
    element.__sdm_inverted = true;
    element.__sdm_rule = rule;
    return true;
  } else {
    log("skip", { element, size, colors, lightness });
  }

  return false;
}
