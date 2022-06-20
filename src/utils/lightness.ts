import { rgbaRx } from "./check-back-color-presence";
import { rgbToHsl } from "./rgb-to-hsl";
import { rgbaToObject } from "./rgba-to-object";

export function getLightnessStatus(property: string) {
  const colors = property.match(rgbaRx) ?? [];
  const noTransparent = colors.filter((color) => rgbaToObject(color).a !== 0);
  const lightness = noTransparent.map(computeLightnessValue) as number[];

  if (!lightness.length) return;
  const avg = lightness.reduce((a, b) => a + b) / lightness.length;
  return getLightnessStatusFromValue(avg);
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
