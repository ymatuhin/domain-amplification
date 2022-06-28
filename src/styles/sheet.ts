import { logger } from "../config";

const log = logger("stylesheet");
const sheet = new CSSStyleSheet();

// @ts-ignore
document.adoptedStyleSheets.push(sheet);

export function addRule(rule: string) {
  log("add", { rule });
  const rulesArr = Array.from(sheet.cssRules);
  if (rulesArr.some(({ cssText }) => cssText === rule)) return;
  const index = sheet.insertRule(rule, sheet.cssRules.length);
  return sheet.cssRules[index].cssText;
}

export function removeRule(rule: string) {
  log("remove", { rule });
  const rulesArr = Array.from(sheet.cssRules);
  const index = rulesArr.findIndex(({ cssText }) => cssText === rule);
  if (index >= 0) sheet.deleteRule(index);
}

export function clearRules() {
  log("clear");
  // @ts-ignore
  sheet.replaceSync("");
}

export function getRules() {
  log("get");
  const rules = Array.from(sheet.cssRules);
  return rules.map((rule) => rule.cssText).join("\n");
}
