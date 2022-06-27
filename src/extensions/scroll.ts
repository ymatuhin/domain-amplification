import { checkInsideInverted } from "../dom/check-inside-inverted";
import { checkIsScrollable } from "../dom/check-is-scrollable";
import { getSelector } from "../dom/get-selector";
import { addRule, removeRule } from "../styles";
import type { Extension } from "./index";

const rule1 = `:root { color-scheme: dark; }`;
const rule2 = `body, input, button, textarea, select { color-scheme: light; }`;

export default {
  start() {
    addRule(rule1);
    addRule(rule2);
  },
  handle(element) {
    if (!checkIsScrollable(element)) return;
    if (!checkInsideInverted(element)) return;
    const selector = getSelector(element);
    addRule(`${selector} { color-scheme: dark; }`);
  },
  stop() {
    removeRule(rule1);
    removeRule(rule2);
  },
} as Extension;
