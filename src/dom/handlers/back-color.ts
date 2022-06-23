import {
  checkBackColorPresence,
  computeLightnessValue,
  getLightnessStatusFromValue,
  rgbaToObject,
} from "../../color";
import { checkBackImagePresence } from "../../color/check-back-image-presence";
import { attrs, rgbaRx } from "../../config";

export default (element: HTMLElement, styles = getComputedStyle(element)) => {
  element.removeAttribute(attrs.image);
  element.removeAttribute(attrs.back);

  if (checkBackImagePresence(styles)) element.setAttribute(attrs.image, "");
  if (!checkBackColorPresence(styles)) return;

  const colors = styles.background.match(rgbaRx) ?? [];
  const noTransparent = colors.filter((color) => rgbaToObject(color).a !== 0);
  const lightness = noTransparent.map(computeLightnessValue) as number[];

  if (!lightness.length) return;
  const avg = lightness.reduce((a, b) => a + b) / lightness.length;
  const status = getLightnessStatusFromValue(avg);

  element.setAttribute(attrs.back, status);
};
