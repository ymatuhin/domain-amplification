import { rgbToHsl } from "./rgb-to-hsl";
import { rgbaToObject } from "./rgba-to-object";

export function getLightnessStatus(styles: CSSStyleDeclaration) {
  const { r, g, b, a } = rgbaToObject(styles.backgroundColor);
  if (a < 0.8) return null;
  const { l } = rgbToHsl(r, g, b);
  return l > 55 ? "light" : l < 35 ? "dark" : "medium";
}
