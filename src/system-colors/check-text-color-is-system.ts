import { rgbaToObject } from "../color/rgba-to-object";
import { classes } from "../config";

export function checkTextColorIsSystem(element: HTMLElement) {
  const html = document.documentElement;
  html.style.overflow = "hidden";
  html.classList.add(classes.schemeDark);
  const { color: prevColor } = getComputedStyle(element);
  html.classList.remove(classes.schemeDark);

  html.classList.add(classes.schemeLight);
  const { color: nextColor } = getComputedStyle(element);
  html.classList.remove(classes.schemeLight);
  html.style.overflow = "";

  const { a } = rgbaToObject(prevColor);
  return prevColor !== nextColor || a === 0;
}
