import { rgbaToObject } from "./rgba-to-object";

export function checkTextColorIsSystem($element: HTMLElement) {
  document.documentElement.dataset.sdmScheme = "light";
  $element.dataset.sdmScheme = "light";
  const { color: prevColor } = getComputedStyle($element);

  document.documentElement.dataset.sdmScheme = "dark";
  $element.dataset.sdmScheme = "dark";
  const { color: nextColor } = getComputedStyle($element);

  delete document.documentElement.dataset.sdmScheme;
  delete $element.dataset.sdmScheme;

  const { a } = rgbaToObject(prevColor);

  return prevColor !== nextColor || a === 0;
}
