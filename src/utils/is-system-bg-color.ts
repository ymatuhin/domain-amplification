import { rgbaToObject } from "./rgba-to-object";

export function isSystemBgColor($element: HTMLElement) {
  const { backgroundColor } = getComputedStyle($element);
  if (!backgroundColor) return true;
  const { r, g, b, a } = rgbaToObject(backgroundColor);
  const isCustomColor = r >= 0 && g >= 0 && b >= 0 && a >= 0.8;
  return !isCustomColor;
}
