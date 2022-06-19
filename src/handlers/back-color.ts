import {
  checkBackColorPresence,
  rgbaRx,
} from "../utils/check-back-color-presence";
import {
  computeLightnessValue,
  getLightnessStatusFromValue,
} from "../utils/lightness";
import { rgbaToObject } from "../utils/rgba-to-object";

export default (item: HTMLElement) => {
  const styles = getComputedStyle(item);
  if (!checkBackColorPresence(styles)) return;

  const colors = styles.background.match(rgbaRx) ?? [];
  const noTransparent = colors.filter((color) => rgbaToObject(color).a !== 0);
  const lightness = noTransparent.map(computeLightnessValue) as number[];

  if (!lightness.length) return;
  const avg = lightness.reduce((a, b) => a + b) / lightness.length;
  const status = getLightnessStatusFromValue(avg);
  item.dataset.daBgColor = status;
};
