import { locals, logger } from "../config";

const log = logger("stylesheet");
const sheet = new CSSStyleSheet();
const saved = localStorage.getItem(locals.styles) ?? "";
// @ts-ignore
sheet.replaceSync(saved);
// @ts-ignore
document.adoptedStyleSheets = [sheet];

export function addRule(rule: string) {
  log("addRule", rule);
  const rulesArr = Array.from(sheet.cssRules);
  if (rulesArr.some(({ cssText }) => cssText === rule)) return;
  sheet.insertRule(rule, sheet.cssRules.length);
  requestIdleCallback(save);
}

export function removeRule(rule: string) {
  log("removeRule", rule);
  const rulesArr = Array.from(sheet.cssRules);
  const index = rulesArr.findIndex(({ cssText }) => cssText === rule);
  if (index >= 0) sheet.deleteRule(index);
  requestIdleCallback(save);
}

export function clearRules() {
  log("clearRules");
  // @ts-ignore
  sheet.replaceSync("");
}

function save() {
  const rules = Array.from(sheet.cssRules);
  const text = rules.map((rule) => rule.cssText).join("\n");
  localStorage.setItem(locals.styles, text);
}
