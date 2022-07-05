import { rgbaRx } from "../config";
import { rgbaToObject } from "./rgba-to-object";

export function getLightnessStatus(property: string) {
  const colors = property.match(rgbaRx) ?? [];
  const noTransparent = colors.filter((color) => rgbaToObject(color).a !== 0);
  const lightness = noTransparent.map(getRgbLightness) as number[];

  if (!lightness.length) return;
  const avg = lightness.reduce((a, b) => a + b) / lightness.length;
  return getLightnessStatusFromValue(avg);
}

export function getLightnessStatusFromValue(value: number) {
  return value > 0.6 ? "light" : value <= 0.4 ? "dark" : "medium";
}

export function getRgbLightness(property: string) {
  const { r, g, b, a } = rgbaToObject(property);
  if (a === 0) return null;
  const max = Math.max(r, g, b) / 255;
  const min = Math.min(r, g, b) / 255;
  return (max + min) / 2;
}
