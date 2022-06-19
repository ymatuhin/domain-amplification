import { rgbToHsl } from "./rgb-to-hsl";
import { rgbaToObject } from "./rgba-to-object";

export function getLightnessStatus(property: string) {
  const lightness = computeLightnessValue(property);
  if (!lightness) return null;
  return getLightnessStatusFromValue(lightness);
}

export function getLightnessStatusFromValue(value: number) {
  return value > 50 ? "light" : value <= 40 ? "dark" : "medium";
}

export function computeLightnessValue(property: string) {
  const { r, g, b, a } = rgbaToObject(property);
  if (a === 0) return null;
  const { l } = rgbToHsl(r, g, b);
  return l * a;
}
