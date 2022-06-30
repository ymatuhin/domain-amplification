import { checkInsideInverted } from "../dom/check-inside-inverted";
import { checkIsScrollable } from "../dom/check-is-scrollable";
import { getSelector } from "../dom/get-selector";
import { addRule, makeRule, removeRule } from "../styles";
import type { Extension } from "./index";

const rule1 = makeRule(`:root { color-scheme: dark; }`);
const rule2 = makeRule(
  `body, input, button, textarea, select { color-scheme: light; }`,
);

export default {
  start() {
    addRule(rule1);
    addRule(rule2);
  },
  handleElement(element) {
    if (element instanceof HTMLHtmlElement) return;
    if (element instanceof HTMLBodyElement) return;
    if (!checkIsScrollable(element)) return;
    if (!element.inverted && !checkInsideInverted(element)) return;
    const selector = getSelector(element);
    const rule = makeRule(`${selector} { color-scheme: dark; }`);
    addRule(rule);
  },
  stop() {
    removeRule(rule1);
    removeRule(rule2);
  },
} as Extension;
