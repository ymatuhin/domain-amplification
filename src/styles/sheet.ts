// @ts-ignore
import rafThrottle from "raf-throttle";
import { logger } from "../config";

const log = logger("stylesheet");
const sheet = new CSSStyleSheet();
const listeners: Function[] = [];

const notify = rafThrottle(() => {
  const rules = Array.from(sheet.cssRules);
  const textRules = rules.map((rule) => rule.cssText).join("\n");
  listeners.forEach((listener) => listener(textRules));
});

// @ts-ignore
document.adoptedStyleSheets.push(sheet);

export function addRule(rule: string) {
  log("add", { rule });
  const rulesArr = Array.from(sheet.cssRules);
  // TODO: fix somehow false comparison here due to diff in input and parsed values
  if (rulesArr.some(({ cssText }) => cssText === rule)) return;
  const index = sheet.insertRule(rule, sheet.cssRules.length);
  requestAnimationFrame(notify);
  return sheet.cssRules[index].cssText;
}

export function removeRule(rule: string) {
  log("remove", { rule });
  const rulesArr = Array.from(sheet.cssRules);
  const index = rulesArr.findIndex(({ cssText }) => cssText === rule);
  requestAnimationFrame(notify);
  if (index >= 0) sheet.deleteRule(index);
}

export function clearRules() {
  log("clear");
  // @ts-ignore
  sheet.replaceSync("");
}

export function subscribe(fn: Function) {
  if (!listeners.includes(fn)) {
    listeners.push(fn);
  }
  return () => {
    const index = listeners.indexOf(fn);
    listeners.splice(index, 1);
  };
}
