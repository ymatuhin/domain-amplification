import { rgbaToObject } from "./rgba-to-object";

export function checkBackColorIsSystem($element: HTMLElement) {
  const { backgroundColor } = getComputedStyle($element);
  if (!backgroundColor) return true;
  const { a } = rgbaToObject(backgroundColor);
  return a === 0;
}
