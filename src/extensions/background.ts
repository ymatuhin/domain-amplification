import {
  checkBackColorPresence,
  computeLightnessValue,
  rgbaToObject,
} from "../color";
import { checkBackImagePresence } from "../color/check-back-image-presence";
import { logger, mediaSelector, rgbaRx } from "../config";
import { checkInsideInverted } from "../dom/check-inside-inverted";
import { getElementSize } from "../dom/get-element-size";
import { getSelector } from "../dom/get-selector";
import { addRule, mediaFilter, removeRule } from "../styles";
import type { Extension } from "./index";

const log = logger("background");

export default {
  handleElement(element) {
    if (element.matches(mediaSelector)) return;
    if (element.closest(mediaSelector)) return;
    if (checkInsideInverted(element)) return;

    if (element.isConnected) {
      log("connected, not inside inverted", { element });
      const styles = getComputedStyle(element);
      const hasImage = checkBackImagePresence(styles);
      const hasColor = checkBackColorPresence(styles);
      if (!hasImage && !hasColor) return;
      log("has background", { element });

      const size = getElementSize(element);
      const selector = getSelector(element);
      const rule = `${selector} { ${mediaFilter}}`;
      log("data", { element, selector, size, hasImage, hasColor });

      if (hasImage) {
        if (size > 20) {
          addRule(rule);
          element.inverted = true;
        }
      } else {
        const colors = styles.background.match(rgbaRx) ?? [];
        const noTransparent = colors.filter(
          (color) => rgbaToObject(color).a !== 0,
        );
        const lightness = noTransparent.map(computeLightnessValue) as number[];
        log("data2", { element, selector, colors, noTransparent, lightness });

        if (!lightness.length) return;
        const avg = lightness.reduce((a, b) => a + b) / lightness.length;
        log("data3", { element, selector, avg });
        if (avg < 40 && size > 4) {
          addRule(rule);
          element.inverted = true;
        }
      }
    } else {
      const selector = getSelector(element);
      const rule = `${selector} { ${mediaFilter}}`;
      log("unconnected", { element, selector });
      removeRule(rule);
    }
  },
  stop() {},
} as Extension;
