import { logger } from "../config";
// @ts-ignore
import rafThrottle from "raf-throttle";

const log = logger("stylesheet");
const sheet = new CSSStyleSheet();

// @ts-ignore
document.adoptedStyleSheets.push(sheet);

const queue: { type: "add" | "remove"; rule: string }[] = [];
const handleQueue = rafThrottle(() => {
  queue.forEach(({ rule, type }) => {
    if (type === "add") {
      const rulesArr = Array.from(sheet.cssRules);
      if (rulesArr.some(({ cssText }) => cssText === rule)) return;
      sheet.insertRule(rule, sheet.cssRules.length);
    } else {
      const rulesArr = Array.from(sheet.cssRules);
      const index = rulesArr.findIndex(({ cssText }) => cssText === rule);
      if (index >= 0) sheet.deleteRule(index);
    }
  });
});

export function addRule(rule: string) {
  log("add", { rule });
  queue.push({ type: "add", rule });
  requestAnimationFrame(handleQueue);
}

export function removeRule(rule: string) {
  log("remove", { rule });
  queue.push({ type: "remove", rule });
  requestAnimationFrame(handleQueue);
}

export function makeRule(rule: string) {
  const sheet = new CSSStyleSheet();
  sheet.insertRule(rule);
  return sheet.cssRules[0].cssText;
}

export function getRules() {
  const rules = Array.from(sheet.cssRules);
  return rules.map((rule) => rule.cssText).join("\n");
}

export function clearRules() {
  log("clear", getRules());
  // @ts-ignore
  sheet.replaceSync("");
}
